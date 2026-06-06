import type { Task, User } from "../api.js";

export function TaskList({
  tasks,
  users,
  onToggle,
  onAssign,
}: {
  tasks: Task[];
  users: User[];
  onToggle: (task: Task) => void;
  onAssign: (task: Task, assignee_id: number | null) => void;
}) {
  if (tasks.length === 0) {
    return <p style={{ color: "#888" }}>No tasks.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map((task) => (
        <li
          key={task.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <input
            type="checkbox"
            checked={task.status === "done"}
            onChange={() => onToggle(task)}
          />
          <span
            style={{
              flex: 1,
              textDecoration: task.status === "done" ? "line-through" : "none",
              color: task.status === "done" ? "#999" : "#222",
            }}
          >
            {task.title}
          </span>
          <select
            value={task.assignee_id ?? ""}
            onChange={(e) =>
              onAssign(task, e.target.value ? Number(e.target.value) : null)
            }
            style={{ padding: "4px 6px", fontSize: 13, color: "#555" }}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </li>
      ))}
    </ul>
  );
}
