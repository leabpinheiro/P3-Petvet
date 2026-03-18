import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import type { ErrorRequestHandler } from "express";
import router from "./router";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
);

app.use(express.json());

app.use(router);

const publicFolderPath = path.join(__dirname, "../../server/public");
if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

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

const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  next(err);
};
app.use(logErrors);

export default app;
