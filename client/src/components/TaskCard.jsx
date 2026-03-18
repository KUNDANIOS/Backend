import { useState } from "react";

const PRIORITY = {
  low:    { color: "#22c55e", label: "LOW" },
  medium: { color: "#f59e0b", label: "MED" },
  high:   { color: "#ef4444", label: "HIGH" },
};

const STATUS_CYCLE = { "todo": "in-progress", "in-progress": "done", "done": "todo" };
const STATUS_LABEL = { "todo": "Todo", "in-progress": "In Progress", "done": "Done" };
const STATUS_COLOR = {
  "todo":        { bg: "#ffffff11", color: "#aaa" },
  "in-progress": { bg: "#7c6dfa22", color: "#7c6dfa" },
  "done":        { bg: "#22c55e22", color: "#22c55e" },
};

export default function TaskCard({ task, onDelete, onStatusChange, isAdmin }) {
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const p = PRIORITY[task.priority] || PRIORITY.medium;
  const sc = STATUS_COLOR[task.status] || STATUS_COLOR["todo"];

  const handleStatus = async () => {
    setUpdating(true);
    await onStatusChange(task._id, STATUS_CYCLE[task.status]);
    setUpdating(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id);
    setDeleting(false);
  };

  return (
    <div style={s.card}>
      {/* Header row */}
      <div style={s.header}>
        <span style={{ ...s.priority, color: p.color }}>● {p.label}</span>
        <span style={{ ...s.statusBadge, ...sc }}>{STATUS_LABEL[task.status]}</span>
      </div>

      {/* Title */}
      <h3 style={s.title}>{task.title}</h3>

      {/* Description */}
      {task.description && <p style={s.desc}>{task.description}</p>}

      {/* Owner (admin view) */}
      {isAdmin && task.owner?.name && (
        <div style={s.owner}>
          <span style={s.ownerDot}>◆</span>
          <span>{task.owner.name}</span>
          <span style={{ color: "var(--muted)", fontSize: 11 }}>
            {task.owner.email}
          </span>
        </div>
      )}

      {/* Footer actions */}
      <div style={s.footer}>
        <button
          className="btn-ghost"
          onClick={handleStatus}
          disabled={updating}
          style={{ fontSize: 11, padding: "5px 12px" }}
        >
          {updating ? <span className="spinner" style={{ width: 12, height: 12 }} /> : `→ ${STATUS_LABEL[STATUS_CYCLE[task.status]]}`}
        </button>
        <button
          className="btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "..." : "Delete"}
        </button>
      </div>

      {/* Created at */}
      <span style={s.date}>
        {new Date(task.createdAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        })}
      </span>
    </div>
  );
}

const s = {
  card: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "18px 18px 14px",
    display: "flex", flexDirection: "column", gap: 10,
    transition: "border-color 0.2s, transform 0.15s",
    position: "relative",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  priority: { fontSize: 10, fontWeight: 700, letterSpacing: 0.8 },
  statusBadge: {
    fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
    borderRadius: 6, padding: "2px 8px",
  },
  title: {
    fontFamily: "Syne, sans-serif", fontSize: 14,
    fontWeight: 700, lineHeight: 1.4, color: "var(--text)",
  },
  desc: { fontSize: 12, color: "var(--muted)", lineHeight: 1.5 },
  owner: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 11, color: "var(--muted)",
    background: "var(--surface3)",
    borderRadius: 6, padding: "5px 10px",
  },
  ownerDot: { color: "var(--accent)", fontSize: 8 },
  footer: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginTop: 4,
  },
  date: { fontSize: 10, color: "var(--muted)", alignSelf: "flex-end" },
};