import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 1. Plan 5 distinct coloring pages for the theme & child's name
app.post("/api/coloring-book/plan", async (req, res) => {
  try {
    const { theme, childName, styleLevel = "standard" } = req.body;

    if (!theme || !childName) {
      return res.status(400).json({ error: "Both theme and childName are required." });
    }

    const prompt = `You are a professional children's coloring book author and illustrator.
Create an outline for a 5-page printable children's coloring book with the theme: "${theme}".
The coloring book is personalized for a child named: "${childName}".
Art style level: "${styleLevel}" (e.g. bold lines for young children, clean thick strokes, pure white background, no shading).

Plan 5 distinct, sequential or varied scenes that tell a charming mini-adventure featuring elements of "${theme}".
Make sure each scene is fun, wholesome, age-appropriate, and easy to color.

Return a JSON object with:
- bookTitle: Catchy title like "${childName}'s Awesome Space Dinosaurs"
- dedication: A sweet dedication line like "Specially crafted for ${childName}'s creative adventures"
- pages: An array of exactly 5 pages, each with:
  - pageNumber: 1 to 5
  - sceneTitle: Short title (e.g., "T-Rex Launches the Rocket")
  - storyCaption: A cute 1 or 2 sentence rhyming or descriptive caption for the bottom of the page
  - imagePrompt: A detailed, highly descriptive prompt for an image generation model that generates pure black-and-white coloring page line art.
    The prompt MUST emphasize: "children's coloring book page, crisp thick black line art, pure white background, absolutely no grayscale, no shading, no colors, clean outlines, high contrast vector coloring sheet, simple clear shapes suitable for crayons, ${theme}".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert children's book designer who creates clear, joyful coloring book concepts.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bookTitle: { type: Type.STRING },
            dedication: { type: Type.STRING },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  sceneTitle: { type: Type.STRING },
                  storyCaption: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING },
                },
                required: ["pageNumber", "sceneTitle", "storyCaption", "imagePrompt"],
              },
            },
          },
          required: ["bookTitle", "dedication", "pages"],
        },
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating coloring book plan:", error);
    res.status(500).json({
      error: error?.message || "Failed to plan coloring book scenes",
    });
  }
});

// 2. Generate an individual coloring page image using gemini-3-pro-image-preview
// Support affordance for imageSize: 1K, 2K, 4K
app.post("/api/coloring-book/generate-page", async (req, res) => {
  try {
    const {
      prompt,
      imageSize = "1K",
      sceneTitle,
      theme,
      childName,
      pageNumber,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // Valid size affordances: 1K, 2K, 4K
    const validSizes = ["1K", "2K", "4K"];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : "1K";

    // Reinforced coloring book prompt formatting
    const enhancedPrompt = `A high quality children's coloring book page. ${prompt}.
Style: pure black and white line art coloring page, crisp bold thick outlines, completely blank pure white background, no grayscale, no gradient, no shading, no colors, no photographic textures, clean line art illustration for kids coloring with crayons. Easy to color, centered composition.`;

    // We use model gemini-3-pro-image-preview as requested by user instructions
    // Fallback list if preview naming changes
    const candidateModels = [
      "gemini-3-pro-image-preview",
      "gemini-3-pro-image",
      "gemini-3.1-flash-image",
      "gemini-3.1-flash-lite-image",
    ];

    let imageBase64: string | null = null;
    let usedModel = candidateModels[0];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const configPayload: any = {
          imageConfig: {
            aspectRatio: "3:4", // Portrait ratio ideal for standard 8.5x11 printing
            imageSize: chosenSize,
          },
        };

        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [{ text: enhancedPrompt }],
          },
          config: configPayload,
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            imageBase64 = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
            usedModel = model;
            break;
          }
        }

        if (imageBase64) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} attempt error:`, err?.message || err);
        lastError = err;
      }
    }

    if (!imageBase64) {
      throw new Error(
        lastError?.message || "Could not retrieve image data from Gemini image model."
      );
    }

    res.json({
      imageUrl: imageBase64,
      modelUsed: usedModel,
      imageSize: chosenSize,
      pageNumber,
      sceneTitle,
    });
  } catch (error: any) {
    console.error("Error generating page line art:", error);
    res.status(500).json({
      error: error?.message || "Failed to generate coloring page image",
    });
  }
});

// 3. Multi-turn chat interface using Gemini
// Uses:
// - gemini-3.1-pro-preview for complex tasks
// - gemini-3.5-flash for general tasks
// - gemini-3.1-flash-lite for fast tasks
app.post("/api/chat", async (req, res) => {
  try {
    const {
      messages,
      taskType = "general", // "complex" | "general" | "fast"
      roleType = "creative_storyteller", // "creative_storyteller" | "coloring_coach" | "theme_explorer"
      childName = "Friend",
      theme = "",
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Determine model based on task complexity as mandated in instructions:
    let modelName = "gemini-3.5-flash"; // default general
    if (taskType === "complex") {
      modelName = "gemini-3.1-pro-preview";
    } else if (taskType === "fast") {
      modelName = "gemini-3.1-flash-lite";
    }

    // Role-specific system instructions
    let roleDescription = "";
    switch (roleType) {
      case "coloring_coach":
        roleDescription = `You are "Barnaby the Art Owl", a playful coloring coach for children and parents. You suggest great crayon color palettes, shading ideas for kids, and fun techniques (like rainbow gradients or glitter dots).`;
        break;
      case "theme_explorer":
        roleDescription = `You are "Sparky the Idea Dragon", a magical theme explorer who comes up with imaginative, whimsical coloring book themes and 5-scene storylines (like "Underwater Astronaut Otters" or "Cupcake Castle Knights").`;
        break;
      case "creative_storyteller":
      default:
        roleDescription = `You are "Penny the Story Pen", a warm and encouraging children's book companion. You write joyful rhyming verses, bedtime adventures, and custom coloring book ideas tailored for ${childName || "kids"}${theme ? ` exploring "${theme}"` : ""}.`;
        break;
    }

    const systemInstruction = `${roleDescription}
Maintain a joyful, polite, child-friendly, inspiring tone. Keep responses conversational and well-formatted with clear bullet points when making suggestions.
Current child's name context: "${childName || "Friend"}".
Current book theme context: "${theme || "Not chosen yet"}".
If the user asks for new theme ideas, provide 3 to 5 catchy themes that would make fantastic thick-line coloring pages.`;

    // Map conversation history to Gemini contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || "I couldn't generate a response. Let's try again!";
    res.json({
      reply,
      modelUsed: modelName,
      taskType,
    });
  } catch (error: any) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({
      error: error?.message || "Failed to process chat message",
    });
  }
});

// Vite middleware / static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
