import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <header style={s.nav}>
      <div style={s.left}>
        <span style={s.logo}>TaskFlow</span>
        <span style={s.ver}>v1.0</span>
      </div>
      <div style={s.right}>
        <span
          style={{
            ...s.roleBadge,
            background: user?.role === "admin" ? "#7c6dfa22" : "#22c55e22",
            color: user?.role === "admin" ? "#7c6dfa" : "#22c55e",
            borderColor: user?.role === "admin" ? "#7c6dfa55" : "#22c55e55",
          }}
        >
          {user?.role?.toUpperCase()}
        </span>
        <span style={s.name}>{user?.name}</span>
        <button className="btn-ghost" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </header>
  );
}

const s = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", height: 60,
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    position: "sticky", top: 0, zIndex: 100,
    backdropFilter: "blur(12px)",
  },
  left: { display: "flex", alignItems: "center", gap: 10 },
  logo: {
    fontFamily: "Syne, sans-serif", fontWeight: 800,
    fontSize: 20, color: "var(--accent)", letterSpacing: "-0.5px",
  },
  ver: { fontSize: 11, color: "var(--muted)", marginTop: 2 },
  right: { display: "flex", alignItems: "center", gap: 14 },
  roleBadge: {
    border: "1px solid", borderRadius: 6,
    padding: "2px 10px", fontSize: 10,
    fontWeight: 700, letterSpacing: 1,
  },
  name: { fontSize: 13, color: "var(--muted)" },
};