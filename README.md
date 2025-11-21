# Gemini AI Chatbot

A simple React-based chatbot powered by Google's Gemini 2.0 Flash model. Built with Vite and styled with Bootstrap.

## Features

- 💬 Real-time chat interface
- 🤖 Powered by Gemini 2.0 Flash Experimental
- ⚡ Fast and responsive UI with Vite
- 🎨 Clean Bootstrap styling
- 📱 Fully responsive design
- ⏳ Loading states for better UX

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Generate your API key

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Enter your API key:**
   - Open the app in your browser (usually http://localhost:5173)
   - Enter your Gemini API key in the setup screen
   - Start chatting!

## Usage

Simply type your questions or queries in the input field and press Enter or click the send button. The chatbot will respond using the Gemini AI model.

## Tech Stack

- React 18
- Vite
- Google Generative AI SDK (@google/generative-ai)
- Bootstrap 5
- Bootstrap Icons

## Note

This is a basic implementation without database persistence. Messages are stored in memory and will be cleared on page refresh.

