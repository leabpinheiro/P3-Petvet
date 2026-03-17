import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import type { ErrorRequestHandler } from "express";
import router from "./router";

const app = express();

// Configuration CORS
if (process.env.CLIENT_URL != null) {
  app.use(cors({ origin: [process.env.CLIENT_URL] }));
}

// Parsing des requêtes JSON
app.use(express.json());

// Routes de l'API
app.use(router);

// Gestion des fichiers statiques (Production)
const publicFolderPath = path.join(__dirname, "../../server/public");
if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

const clientBuildPath = path.join(__dirname, "../../client/dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (_, res) => {
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
