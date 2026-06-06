import { Router } from "express";
import { db, type Task } from "../db.js";

export const tasksRouter = Router();

// GET /api/tasks?status=open&search=foo&assignee_id=1|unassigned
tasksRouter.get("/", (req, res) => {
  const { status, search, assignee_id } = req.query;

  let sql = `
    SELECT t.id, t.title, t.status, t.assignee_id, u.name AS assignee_name, t.created_at
    FROM tasks t
    LEFT JOIN users u ON u.id = t.assignee_id
    WHERE 1 = 1
  `;
  const params: unknown[] = [];

  if (typeof status === "string" && status) {
    sql += " AND t.status = ?";
    params.push(status);
  }

  if (typeof search === "string" && search) {
    sql += " AND lower(t.title) LIKE ?";
    params.push(`%${search.toLowerCase()}%`);
  }

  if (typeof assignee_id === "string" && assignee_id) {
    if (assignee_id === "unassigned") {
      sql += " AND t.assignee_id IS NULL";
    } else {
      sql += " AND t.assignee_id = ?";
      params.push(Number(assignee_id));
    }
  }

  sql += " ORDER BY t.created_at DESC, t.id DESC";

  // BUG FIX: better-sqlite3's .all() takes a single binding argument (an array),
  // not spread params. The original .all(...params) silently fails or returns
  // incorrect results when multiple filter params are present.
  const rows = db.prepare(sql).all(params) as Task[];
  res.json(rows);
});

// POST /api/tasks  { title, assignee_id? }
tasksRouter.post("/", (req, res) => {
  const title = (req.body?.title ?? "").trim();
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const assignee_id = req.body?.assignee_id ?? null;

  const result = db
    .prepare("INSERT INTO tasks (title, status, assignee_id) VALUES (?, 'open', ?)")
    .run(title, assignee_id);

  const created = db
    .prepare(`
      SELECT t.id, t.title, t.status, t.assignee_id, u.name AS assignee_name, t.created_at
      FROM tasks t
      LEFT JOIN users u ON u.id = t.assignee_id
      WHERE t.id = ?
    `)
    .get(result.lastInsertRowid) as Task;

  res.status(201).json(created);
});

// PATCH /api/tasks/:id  { status?, assignee_id? }
tasksRouter.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status, assignee_id } = req.body ?? {};

  if (status !== undefined && status !== "open" && status !== "done") {
    return res.status(400).json({ error: "status must be 'open' or 'done'" });
  }

  if (status !== undefined) {
    const result = db
      .prepare("UPDATE tasks SET status = ? WHERE id = ?")
      .run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "task not found" });
    }
  }

  if (assignee_id !== undefined) {
    const newAssignee = assignee_id === null ? null : Number(assignee_id);
    const result = db
      .prepare("UPDATE tasks SET assignee_id = ? WHERE id = ?")
      .run(newAssignee, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "task not found" });
    }
  }

  const updated = db
    .prepare(`
      SELECT t.id, t.title, t.status, t.assignee_id, u.name AS assignee_name, t.created_at
      FROM tasks t
      LEFT JOIN users u ON u.id = t.assignee_id
      WHERE t.id = ?
    `)
    .get(id) as Task;

  res.json(updated);
});
