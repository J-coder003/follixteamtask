import express from "express";
import cors from "cors";
import { tasksRouter } from "./routes/tasks.js";
import { usersRouter } from "./routes/users.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

// In production, CORS_ORIGIN should be set to the Vercel frontend URL.
// Locally it falls back to the Vite dev server.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Render health checks, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
  })
);

app.use(express.json());

app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`TeamTasks API running on port ${PORT}`);
});
