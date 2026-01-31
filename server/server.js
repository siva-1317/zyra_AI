import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Check API key
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY ? "LOADED" : "MISSING");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) return res.json({ reply: "Empty message" });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const reply =
      response?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("REPLY:", reply);

    res.json({ reply });

  } catch (err) {

    console.error("===== FULL GEMINI ERROR =====");
    console.error(err);
    console.error("============================");

    res.json({ reply: "Gemini failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
