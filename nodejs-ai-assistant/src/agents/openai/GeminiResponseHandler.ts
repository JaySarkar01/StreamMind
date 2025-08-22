import type { Channel, Event, MessageResponse, StreamChat } from "stream-chat";
import type { GenerativeModel } from "@google/generative-ai";

export class GeminiResponseHandler {
  private message_text = "";
  private is_done = false;
  private last_update_time = 0;

  constructor(
    private readonly model: GenerativeModel, // ✅ direct model, not SDK
    private readonly chatClient: StreamChat,
    private readonly channel: Channel,
    private readonly message: MessageResponse,
    private readonly onDispose: () => void
  ) {
    this.chatClient.on("ai_indicator.stop", this.handleStopGenerating);
  }

  run = async (prompt: string) => {
    try {
      // Start streaming
      const result = await this.model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const textChunk = chunk.text();
        if (textChunk) {
          this.message_text += textChunk;

          // Throttle updates (1 per second)
          const now = Date.now();
          if (now - this.last_update_time > 1000) {
            await this.chatClient.partialUpdateMessage(this.message.id, {
              set: { text: this.message_text },
            });
            this.last_update_time = now;
          }
        }
      }

      // Final update
      await this.chatClient.partialUpdateMessage(this.message.id, {
        set: { text: this.message_text },
      });

      await this.channel.sendEvent({
        type: "ai_indicator.clear",
        cid: this.message.cid,
        message_id: this.message.id,
      });
    } catch (error) {
      console.error("Gemini error:", error);
      await this.handleError(error as Error);
    } finally {
      await this.dispose();
    }
  };

  dispose = async () => {
    if (this.is_done) return;
    this.is_done = true;
    this.chatClient.off("ai_indicator.stop", this.handleStopGenerating);
    this.onDispose();
  };

  private handleStopGenerating = async (event: Event) => {
    if (this.is_done || event.message_id !== this.message.id) {
      return;
    }
    console.log("Stop generating for message", this.message.id);

    await this.channel.sendEvent({
      type: "ai_indicator.clear",
      cid: this.message.cid,
      message_id: this.message.id,
    });

    await this.dispose();
  };

  private handleError = async (error: Error) => {
    if (this.is_done) return;

    await this.channel.sendEvent({
      type: "ai_indicator.update",
      ai_state: "AI_STATE_ERROR",
      cid: this.message.cid,
      message_id: this.message.id,
    });

    await this.chatClient.partialUpdateMessage(this.message.id, {
      set: {
        text: error.message ?? "Error generating the message",
        message: error.toString(),
      },
    });

    await this.dispose();
  };
}
