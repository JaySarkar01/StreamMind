import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import type { Channel, DefaultGenerics, Event, StreamChat } from "stream-chat";
import type { AIAgent } from "../types";
import { GeminiResponseHandler } from "./GeminiResponseHandler";

export class GeminiAgent implements AIAgent {
  private model?: GenerativeModel;
  private lastInteractionTs = Date.now();
  private handlers: GeminiResponseHandler[] = [];

  constructor(
    readonly chatClient: StreamChat,
    readonly channel: Channel
  ) {}

  dispose = async () => {
    this.chatClient.off("message.new", this.handleMessage);
    await this.chatClient.disconnectUser();

    this.handlers.forEach((handler) => handler.dispose());
    this.handlers = [];
  };

  get user() {
    return this.chatClient.user;
  }

  getLastInteraction = (): number => this.lastInteractionTs;

  init = async () => {
    const apiKey = process.env.GOOGLE_API_KEY as string | undefined;
    if (!apiKey) {
      throw new Error("Google Gemini API key is required");
    }

    const client = new GoogleGenerativeAI(apiKey);

    // Choose the Gemini model
    this.model = client.getGenerativeModel({
      model: "gemini-1.5-flash", // or "gemini-1.5-pro"
      generationConfig: {
        temperature: 0.7,
      },
    });

    this.chatClient.on("message.new", this.handleMessage);
  };

  private getWritingAssistantPrompt = (context?: string): string => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `You are an expert AI Writing Assistant. Your primary purpose is to be a collaborative writing partner.

**Core Capabilities:**
- Content creation, improvement, style adaptation, brainstorming, and writing coaching.
- Web Search: You may call an external "web_search" function (not built into Gemini).
- Current Date: ${currentDate}. Use this for time-sensitive queries.

**Instructions:**
1. Always request a web search (via 'web_search') when the user asks for current info, news, or facts.
2. When you receive web_search results, use them for your answer, not outdated knowledge.
3. Synthesize info clearly and cite URLs if available.

**Response Style:**
- Direct, professional, no fluff.
- Clear formatting.
- Do not add “Here’s the edit:” type intros.

**Writing Context**: ${context || "General writing assistance."}`;
  };

  private handleMessage = async (e: Event<DefaultGenerics>) => {
    if (!this.model) {
      console.log("Gemini not initialized");
      return;
    }

    if (!e.message || e.message.ai_generated) {
      return;
    }

    const message = e.message.text;
    if (!message) return;

    this.lastInteractionTs = Date.now();

    const writingTask = (e.message.custom as { writingTask?: string })
      ?.writingTask;
    const context = writingTask ? `Writing Task: ${writingTask}` : undefined;
    const instructions = this.getWritingAssistantPrompt(context);

    // Create a placeholder AI-generated message
    const { message: channelMessage } = await this.channel.sendMessage({
      text: "",
      ai_generated: true,
    });

    await this.channel.sendEvent({
      type: "ai_indicator.update",
      ai_state: "AI_STATE_THINKING",
      cid: channelMessage.cid,
      message_id: channelMessage.id,
    });

    // Attach the handler that streams Gemini responses
    const handler = new GeminiResponseHandler(
      this.model, // ✅ pass model directly
      this.chatClient,
      this.channel,
      channelMessage,
      () => this.removeHandler(handler)
    );

    this.handlers.push(handler);
    void handler.run(`${instructions}\n\nUser: ${message}`);
  };

  private removeHandler = (handlerToRemove: GeminiResponseHandler) => {
    this.handlers = this.handlers.filter(
      (handler) => handler !== handlerToRemove
    );
  };
}
