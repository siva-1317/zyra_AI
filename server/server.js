import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const api = "AIzaSyBSW17Zdz-mfgQAhgHNFiUjCXDYnF_-YI0";

const ai = new GoogleGenAI({
  apiKey: api,
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

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
      response.candidates[0].content.parts[0].text;

    res.json({ reply });

  } catch (err) {
    console.error("GEMINI ERROR:", err.message);
    res.json({ reply: "Gemini failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
