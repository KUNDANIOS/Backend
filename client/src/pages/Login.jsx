import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      nav("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Brand */}
        <div style={s.brand}>
          <h1 style={s.logo}>TaskFlow</h1>
          <p style={s.tagline}>Backend Intern Assignment</p>
        </div>

        <h2 style={s.heading}>Welcome back</h2>
        <p style={s.sub}>Sign in to your workspace</p>

        {error && <div style={s.alert}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              required
              autoComplete="email"
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "12px", marginTop: 8, fontSize: 15 }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span className="spinner" /> Signing in...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <p style={s.foot}>
          No account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh", display: "flex",
    alignItems: "center", justifyContent: "center",
    padding: 20,
    background: "radial-gradient(ellipse at 60% 20%, #7c6dfa18 0%, transparent 60%), var(--bg)",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16, padding: "40px 36px",
    width: "100%", maxWidth: 420,
    boxShadow: "0 24px 64px #00000055",
  },
  brand: { textAlign: "center", marginBottom: 28 },
  logo: {
    fontFamily: "Syne, sans-serif", fontSize: 32,
    fontWeight: 800, color: "var(--accent)",
    letterSpacing: "-1px",
  },
  tagline: { fontSize: 11, color: "var(--muted)", marginTop: 4, letterSpacing: 1 },
  heading: { fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4 },
  sub: { fontSize: 13, color: "var(--muted)", marginBottom: 24 },
  alert: {
    background: "#ef44441a", border: "1px solid #ef444455",
    color: "#ef4444", borderRadius: 8,
    padding: "10px 14px", fontSize: 13, marginBottom: 16,
  },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: 0.5 },
  foot: { marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--muted)" },
};