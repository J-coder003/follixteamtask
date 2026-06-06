import { useCallback, useEffect, useState } from "react";
import {
  fetchTasks,
  fetchUsers,
  setTaskStatus,
  setTaskAssignee,
  type Task,
  type User,
} from "./api.js";
import { TaskList } from "./components/TaskList.js";
import { NewTaskForm } from "./components/NewTaskForm.js";

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  // Load users once on mount
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const load = useCallback(() => {
    fetchTasks({ status, search, assignee_id: assigneeFilter }).then(setTasks);
  }, [status, search, assigneeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(task: Task) {
    await setTaskStatus(task.id, task.status === "done" ? "open" : "done");
    load();
  }

  async function handleAssign(task: Task, assignee_id: number | null) {
    await setTaskAssignee(task.id, assignee_id);
    load();
  }

  return (
    <div
      style={{
        maxWidth: 680,
        margin: "40px auto",
        fontFamily: "system-ui, sans-serif",
        padding: "0 16px",
      }}
    >
      <h1>TeamTasks</h1>

      <NewTaskForm users={users} onCreated={load} />

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          style={{ flex: 1, padding: 8, minWidth: 120 }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="done">Done</option>
        </select>
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <TaskList
        tasks={tasks}
        users={users}
        onToggle={handleToggle}
        onAssign={handleAssign}
      />
    </div>
  );
}
