import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";

const FILTERS = ["all", "todo", "in-progress", "done"];

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchTasks = async () => {
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const { data } = await api.get("/tasks", { params });
      setTasks(data.data);
    } catch {
      showToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [filter]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const { data } = await api.post("/tasks", form);
      setTasks([data.data, ...tasks]);
      setForm({ title: "", description: "", priority: "medium", status: "todo" });
      showToast("Task created ✓");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create task", "error");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      showToast("Task deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, { status });
      setTasks(tasks.map((t) => (t._id === id ? data.data : t)));
      showToast("Status updated");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div style={s.page}>
      <Navbar />

      <main style={s.main}>
        {/* Stats */}
        <div style={s.stats}>
          {[
            { label: "Total", val: stats.total, color: "var(--accent)" },
            { label: "Todo", val: stats.todo, color: "var(--muted)" },
            { label: "In Progress", val: stats.inProgress, color: "#f59e0b" },
            { label: "Done", val: stats.done, color: "#22c55e" },
          ].map((st) => (
            <div key={st.label} style={s.statCard}>
              <span style={{ ...s.statNum, color: st.color }}>{st.val}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>

        <div style={s.grid}>
          {/* Left: Add Task Form */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>
              <span style={s.titleDot}>+</span> New Task
            </h2>
            <form onSubmit={handleAdd} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Title *</label>
                <input
                  placeholder="e.g. Build REST API"
                  value={form.title}
                  onChange={set("title")}
                  required
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Description</label>
                <input
                  placeholder="Optional details..."
                  value={form.description}
                  onChange={set("description")}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ ...s.field, flex: 1 }}>
                  <label style={s.label}>Priority</label>
                  <select value={form.priority} onChange={set("priority")}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div style={{ ...s.field, flex: 1 }}>
                  <label style={s.label}>Status</label>
                  <select value={form.status} onChange={set("status")}>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <button
                className="btn-primary"
                type="submit"
                disabled={adding}
                style={{ width: "100%", padding: "11px", marginTop: 4 }}
              >
                {adding ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span className="spinner" /> Adding...
                  </span>
                ) : (
                  "Add Task"
                )}
              </button>
            </form>

            {/* API Info */}
            <div style={s.apiInfo}>
              <p style={s.apiTitle}>API Endpoints</p>
              {[
                ["GET", "/api/v1/tasks"],
                ["POST", "/api/v1/tasks"],
                ["PUT", "/api/v1/tasks/:id"],
                ["DELETE", "/api/v1/tasks/:id"],
              ].map(([m, path]) => (
                <div key={path} style={s.apiRow}>
                  <span
                    style={{
                      ...s.method,
                      color:
                        m === "GET"
                          ? "#22c55e"
                          : m === "POST"
                          ? "#7c6dfa"
                          : m === "PUT"
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  >
                    {m}
                  </span>
                  <code style={s.path}>{path}</code>
                </div>
              ))}
              <a
                href="http://localhost:5000/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                style={s.swaggerLink}
              >
                Open Swagger Docs →
              </a>
            </div>
          </div>

          {/* Right: Task List */}
          <div style={s.card}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2 style={s.cardTitle}>
                <span style={s.titleDot}>◆</span> Tasks
              </h2>
              <div style={s.tabs}>
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      ...s.tab,
                      background: filter === f ? "var(--accent)" : "transparent",
                      color: filter === f ? "#fff" : "var(--muted)",
                      border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    {f === "all"
                      ? "All"
                      : f === "in-progress"
                      ? "Active"
                      : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={s.empty}>
                <span
                  className="spinner"
                  style={{
                    width: 28,
                    height: 28,
                    borderColor: "var(--border)",
                    borderTopColor: "var(--accent)",
                  }}
                />
              </div>
            ) : tasks.length === 0 ? (
              <div style={s.empty}>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>
                  {filter === "all" ? "No tasks yet. Create one!" : `No ${filter} tasks.`}
                </p>
              </div>
            ) : (
              <div style={s.taskGrid}>
                {tasks.map((t) => (
                  <TaskCard
                    key={t._id}
                    task={t}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                    isAdmin={user?.role === "admin"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "var(--bg)" },
  main: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  stats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 },
  statCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  statNum: {
    fontFamily: "Syne, sans-serif",
    fontSize: 28,
    fontWeight: 800,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 11,
    color: "var(--muted)",
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  grid: { display: "grid", gridTemplateColumns: "340px 1fr", gap: 20 },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 24,
  },
  cardTitle: {
    fontFamily: "Syne, sans-serif",
    fontSize: 16,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  titleDot: { color: "var(--accent)", fontSize: 14 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--muted)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  apiInfo: {
    marginTop: 24,
    padding: "16px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 10,
  },
  apiTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--muted)",
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  apiRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6 },
  method: { fontSize: 10, fontWeight: 800, letterSpacing: 0.5, minWidth: 44 },
  path: { fontSize: 11, color: "var(--muted)", fontFamily: "monospace" },
  swaggerLink: {
    display: "block",
    marginTop: 12,
    fontSize: 11,
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 600,
  },
  tabs: { display: "flex", gap: 6 },
  tab: {
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  taskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 12,
  },
  empty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
};