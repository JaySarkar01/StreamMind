Chat AI App

A modern AI-powered chat application built with Stream Chat, Google Gemini, and web search capabilities. This full-stack application provides an intelligent writing assistant that can help with content creation, research, and real-time collaboration.

🚀 Features

Real-time Chat: Powered by GetStream.io
 for seamless messaging

AI Writing Assistant: Google Gemini integration for intelligent content generation

Web Search: Live web search capabilities using Tavily API for current information

Modern UI: Beautiful React interface with dark/light theme support

Writing Prompts: Categorized writing prompts for business, content, communication, and creative tasks

Agent Management: Dynamic AI agent lifecycle management

Secure Authentication: JWT-based token authentication

Responsive Design: Mobile-first design with Tailwind CSS

🏗️ Architecture
Backend (nodejs-ai-assistant/)

Node.js/Express server

Stream Chat server-side integration

Google Gemini API for AI responses

Tavily API for web search functionality

Agent management system with automatic cleanup

Frontend (react-stream-ai-assistant/)

React with TypeScript

Stream Chat React components

Tailwind CSS + shadcn/ui for modern styling

Vite for fast development and building

📋 Prerequisites

Node.js 20 or higher

npm or yarn package manager

GetStream.io account (free tier available)

Google AI Studio / Gemini API key

Tavily API account (for web search)

🛠️ Setup Instructions
1. Clone the Repository
git clone <your-repository-url>
cd chat-ai-app

2. Backend Setup

Navigate to the backend directory:

cd nodejs-ai-assistant


Install dependencies:

npm install


Create environment file by copying the example:

cp .env.example .env


Configure your .env file with the following keys:

# GetStream credentials - Get these from https://getstream.io/dashboard
STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_api_secret_here

# Google Gemini API key - Get from https://ai.google.dev/
GEMINI_API_KEY=your_gemini_api_key_here

# Tavily API key - Get from https://tavily.com
TAVILY_API_KEY=your_tavily_api_key_here


Replaced OPENAI_API_KEY with GEMINI_API_KEY.

3. Frontend Setup

Navigate to the frontend directory:

cd ../react-stream-ai-assistant


Install dependencies:

npm install


Create environment file:

cp .env.example .env


Configure your .env file:

# Stream Chat Configuration
VITE_STREAM_API_KEY=your_stream_api_key_here

# Backend URL
VITE_BACKEND_URL=http://localhost:3000

4. Getting API Keys
GetStream.io Setup

Sign up at GetStream.io

Create a new Chat application

Copy your API Key and API Secret from the dashboard

Use the same API Key in both backend and frontend .env files

Google Gemini API Setup

Go to Google AI Studio

Create (or select) a project and generate an API Key

Add it to your backend .env as GEMINI_API_KEY

Tavily API Setup

Sign up at Tavily

Get your API key from the dashboard

Add it to your backend .env file

🚀 Running the Application
Start the Backend Server
cd nodejs-ai-assistant
npm run dev


The backend will run on http://localhost:3000

Start the Frontend Application
cd react-stream-ai-assistant
npm run dev


The frontend will run on http://localhost:8080

📖 How GetStream.io Works

GetStream.io
 is a cloud-based API service that provides real-time chat functionality. Here's how it integrates with our app:

Core Concepts

Stream Chat Client: Handles all chat operations and real-time updates

Channels: Individual chat rooms where messages are exchanged

Users: Authenticated participants in the chat

Messages: Text, files, reactions, and custom data

Tokens: JWT-based authentication for secure access

Integration Flow
graph TD
    A[Frontend React App] --> B[Stream Chat React Components]
    B --> C[Stream Chat API]
    C --> D[Backend Node.js Server]
    D --> E[Google Gemini API]
    D --> F[Tavily Web Search]
    D --> G[AI Agent Management]

Key Features Used

Real-time Messaging: Instant message delivery and updates

User Presence: Online/offline status indicators

Channel Management: Create, join, and manage chat channels

Message Threading: Support for threaded conversations

File Uploads: Share images and documents

Custom Fields: Extended message and user data

Webhooks: Server-side event handling

🤖 AI Agent System

The application features a sophisticated AI agent management system:

Agent Lifecycle

Creation: AI agents are created per channel when requested

Initialization: Gemini model setup with optional web search capabilities

Message Handling: Processes user messages and generates responses (streaming)

Web Search: Automatically searches the web for current information

Cleanup: Automatic disposal after inactivity

Agent Capabilities

Content Writing: Various writing tasks from business to creative

Web Research: Live search for current information and facts

Context Awareness: Maintains conversation context

Customizable Prompts: Specialized writing assistance

🎨 UI Components

The frontend uses modern UI components built with:

Radix UI: Accessible component primitives

Tailwind CSS: Utility-first CSS framework

shadcn/ui: Beautiful, customizable components

Lucide React: Modern icon library

Dark Mode Support: System preference detection

📡 API Endpoints
Backend Routes

GET / - Health check and server status

POST /start-ai-agent - Initialize AI agent for a channel

POST /stop-ai-agent - Stop and cleanup AI agent

GET /agent-status - Check AI agent status

POST /token - Generate user authentication tokens

🔒 Security Features

JWT Authentication: Secure token-based authentication

Environment Variables: Sensitive data protection

CORS Configuration: Cross-origin request security

Token Expiration: Automatic token refresh system

Input Validation: Server-side validation for all requests

🚀 Deployment
Backend Deployment

Set environment variables on your hosting platform

Run npm run start for production

Ensure PORT is configured (defaults to 3000)

Frontend Deployment

Run npm run build to create production build

Deploy the dist folder to your static hosting service

Configure environment variables for production

🛠️ Development
Backend Development
cd nodejs-ai-assistant
npm run dev  # Starts with nodemon for auto-reload

Frontend Development
cd react-stream-ai-assistant
npm run dev  # Starts Vite dev server

Building for Production
# Backend
cd nodejs-ai-assistant
npm run start

# Frontend
cd react-stream-ai-assistant
npm run build

📚 Technologies Used
Backend

Node.js - Runtime environment

Express - Web framework

Stream Chat - Real-time messaging

Google Gemini (Generative Language API) - AI language model

Axios - HTTP client

CORS - Cross-origin resource sharing

TypeScript - Type safety

Frontend

React - UI library

TypeScript - Type safety

Vite - Build tool

Stream Chat React - Chat UI components

Tailwind CSS - Styling

Radix UI - Accessible components

React Hook Form - Form handling

React Router - Navigation
