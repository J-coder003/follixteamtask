// In production this is set to the Render API URL via VITE_API_BASE env var.
// Locally it falls back to the Express dev server.
const BASE = (import.meta.env.VITE_API_BASE ?? "http://localhost:3001") + "/api";

export interface Task {
  id: number;
  title: string;
  status: "open" | "done";
  assignee_id: number | null;
  assignee_name: string | null;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export async function fetchTasks(filters: {
  status?: string;
  search?: string;
  assignee_id?: string;
}): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  if (filters.assignee_id) params.set("assignee_id", filters.assignee_id);
  const res = await fetch(`${BASE}/tasks?${params.toString()}`);
  return res.json();
}

export async function createTask(
  title: string,
  assignee_id: number | null
): Promise<Task> {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, assignee_id }),
  });
  return res.json();
}

export async function setTaskStatus(
  id: number,
  status: "open" | "done"
): Promise<Task> {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function setTaskAssignee(
  id: number,
  assignee_id: number | null
): Promise<Task> {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignee_id }),
  });
  return res.json();
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${BASE}/users`);
  return res.json();
}
