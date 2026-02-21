import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Setup
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey || "" });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
      }

      const model = "gemini-3-flash-preview";
      
      // Format history for Gemini API
      // Note: history is expected to be an array of { role: 'user' | 'model', parts: [{ text: string }] }
      const chatHistory = history || [];

      const response = await ai.models.generateContent({
        model: model,
        contents: [
          ...chatHistory,
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "آپ ایک دوستانہ اردو چیٹ بوٹ ہیں۔ آپ کا لہجہ خوشگوار اور مددگار ہونا چاہیے۔ آپ روزانہ لطیفے سناتے ہیں اور اردو میں بات کرتے ہیں۔ آپ کا نام 'اردو جوک بوٹ' ہے۔ ہمیشہ اردو (RTL) میں جواب دیں۔",
        }
      });

      const text = response.text;
      res.json({ text });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
