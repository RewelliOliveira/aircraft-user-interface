import { Plane, Activity, Radio } from "lucide-react";
import { Link, useLocation } from "react-router";

export function Navbar() {
  const location = useLocation();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
      style={{
        background: "rgba(7, 13, 26, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0, 200, 248, 0.12)",
      }}
    >
      <Link to="/" className="flex items-center gap-2.5 group">
        <div
          className="w-7 h-7 rounded flex items-center justify-center"
          style={{ background: "rgba(0, 200, 248, 0.15)", border: "1px solid rgba(0, 200, 248, 0.3)" }}
        >
          <Plane size={14} className="text-primary rotate-45" />
        </div>
        <span
          className="tracking-widest uppercase text-foreground/90 group-hover:text-primary transition-colors"
          style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.15em" }}
        >
          AircraftAPI
        </span>
      </Link>

      <div className="flex items-center gap-1">
        <NavItem to="/" label="Dashboard" active={location.pathname === "/"} />
        <NavItem to="/status" label="Status" active={location.pathname === "/status"} />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <Radio size={10} className="text-emerald-400 animate-pulse" />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#10b981", letterSpacing: "0.08em" }}>
            API LIVE
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded"
          style={{ background: "rgba(0, 200, 248, 0.08)", border: "1px solid rgba(0, 200, 248, 0.15)" }}
        >
          <Activity size={11} className="text-primary" />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#00c8f8", letterSpacing: "0.08em" }}>
            v2.4.1
          </span>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className="px-4 py-1.5 rounded transition-all"
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "13px",
        fontWeight: 500,
        color: active ? "#00c8f8" : "#6b7fa3",
        background: active ? "rgba(0, 200, 248, 0.08)" : "transparent",
        border: active ? "1px solid rgba(0, 200, 248, 0.15)" : "1px solid transparent",
      }}
    >
      {label}
    </Link>
  );
}
