import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import type { ErrorRequestHandler } from "express";
import router from "./router";

const app = express();

// Configuration CORS

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
);

// Parsing des requêtes JSON
app.use(express.json());

// Routes de l'API
// Routes de l'API EN PREMIER
app.use(router);

// Fichiers statiques APRÈS
const clientBuildPath = path.join(__dirname, "../../client/dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      res.status(404).json({ message: "API route not found" });
      return;
    }
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

// Middleware de gestion d'erreurs
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  next(err);
};
app.use(logErrors);

export default app;
