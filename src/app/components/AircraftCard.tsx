import type { Aircraft } from "../services/api";
import { CheckCircle, Wrench, AlertTriangle, X, Package, Users, Calendar, Radio } from "lucide-react";

interface Props {
  aircraft: Aircraft;
  onClose: () => void;
}

const statusConfig = {
  ativo: { label: "ATIVO", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.25)", icon: CheckCircle },
  manutencao: { label: "MANUTENÇÃO", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.25)", icon: Wrench },
  aposentado: { label: "APOSENTADO", color: "#6b7fa3", bg: "rgba(107, 127, 163, 0.1)", border: "rgba(107, 127, 163, 0.25)", icon: AlertTriangle },
};

export function AircraftCard({ aircraft, onClose }: Props) {
  // Backend doesn't have status yet, defaulting to 'ativo'
  const st = statusConfig[(aircraft as any).status || "ativo"];
  const StatusIcon = st.icon;
  const isCargo = aircraft.tipo === "carga" || aircraft.tipo === "cargo";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(7, 13, 26, 0.8)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(13, 22, 40, 0.97) 0%, rgba(10, 18, 32, 0.97) 100%)",
          border: `1px solid ${isCargo ? "rgba(124, 58, 237, 0.35)" : "rgba(0, 200, 248, 0.25)"}`,
          boxShadow: `0 0 60px ${isCargo ? "rgba(124, 58, 237, 0.15)" : "rgba(0, 200, 248, 0.1)"}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient bar */}
        <div
          className="h-1 w-full"
          style={{
            background: isCargo
              ? "linear-gradient(90deg, #7c3aed, #a855f7)"
              : "linear-gradient(90deg, #00c8f8, #0ea5e9)",
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: isCargo ? "rgba(124, 58, 237, 0.15)" : "rgba(0, 200, 248, 0.12)",
                border: `1px solid ${isCargo ? "rgba(124, 58, 237, 0.3)" : "rgba(0, 200, 248, 0.25)"}`,
              }}
            >
              {isCargo ? (
                <Package size={18} style={{ color: "#a855f7" }} />
              ) : (
                <Users size={18} style={{ color: "#00c8f8" }} />
              )}
            </div>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "18px", fontWeight: 600, color: isCargo ? "#a855f7" : "#00c8f8", letterSpacing: "0.05em" }}>
                {aircraft.prefixo}
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: "#6b7fa3", marginTop: "1px" }}>
                {isCargo ? "Aeronave de Carga" : "Aeronave de Passageiros"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "#6b7fa3" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">
          {/* Model */}
          <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", fontWeight: 600, color: "#e8edf5" }}>
              {aircraft.modelo}
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#6b7fa3", marginTop: "2px", letterSpacing: "0.08em" }}>
              {aircraft.fabricante.toUpperCase()}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <StatCell
              icon={<Calendar size={13} />}
              label="FABRICAÇÃO"
              value={String(aircraft.ano_fabricacao)}
              accent={isCargo ? "#a855f7" : "#00c8f8"}
            />
            <StatCell
              icon={isCargo ? <Package size={13} /> : <Users size={13} />}
              label={isCargo ? "CAPACIDADE" : "PASSAGEIROS"}
              value={isCargo ? `${aircraft.capacidade_carga_kg || 0}kg` : String(aircraft.num_assentos || 0)}
              accent={isCargo ? "#a855f7" : "#00c8f8"}
            />
            <div
              className="rounded-lg p-3 flex flex-col gap-1"
              style={{ background: `${st.bg}`, border: `1px solid ${st.border}` }}
            >
              <div className="flex items-center gap-1.5">
                <StatusIcon size={11} style={{ color: st.color }} />
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: st.color, letterSpacing: "0.1em" }}>
                  STATUS
                </p>
              </div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600, color: st.color }}>
                {st.label}
              </p>
            </div>
          </div>

          {/* Autonomia */}
          <div className="flex items-center gap-2 mb-2">
            <Radio size={12} style={{ color: "#6b7fa3" }} />
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#6b7fa3", letterSpacing: "0.1em" }}>
              AUTONOMIA: {aircraft.autonomia_km} KM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCell({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div
      className="rounded-lg p-3 flex flex-col gap-1"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-1.5" style={{ color: "#6b7fa3" }}>
        {icon}
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.1em" }}>{label}</p>
      </div>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 600, color: accent }}>
        {value}
      </p>
    </div>
  );
}
