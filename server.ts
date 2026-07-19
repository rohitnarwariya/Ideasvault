import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import app from "./api/index";

const PORT = 3000;

// Print all registered API endpoints during startup
console.log("-----------------------------------------");
console.log("REGISTERED API ENDPOINTS:");
console.log("- GET  /api/health");
console.log("- POST /api/ai/analyze");
console.log("- POST /api/ai/transcribe");
console.log("- POST /api/ai/generate-title");
console.log("-----------------------------------------");

// Vite middleware integration for full-stack SPA support
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  setupVite().catch((err) => {
    console.error("Failed to start Vite middleware server:", err);
  });
}

export default app;
