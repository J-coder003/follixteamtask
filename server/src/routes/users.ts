import { Router } from "express";
import { db, type User } from "../db.js";

export const usersRouter = Router();

// GET /api/users
usersRouter.get("/", (_req, res) => {
  const rows = db
    .prepare("SELECT id, name, email FROM users ORDER BY name")
    .all() as User[];
  res.json(rows);
});
