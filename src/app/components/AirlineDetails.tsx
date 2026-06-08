import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Search,
  Users,
  Package,
  Plane,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";
import { apiService } from "../services/api";
import type { Airline, Aircraft } from "../services/api";
import { useSSE } from "../hooks/useSSE";
import { AircraftCard } from "./AircraftCard";
import { toast } from "sonner";

export function AirlineDetails() {
  const { iata } = useParams<{ iata: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState<"all" | "passenger" | "cargo">(
    "all",
  );
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(
    null,
  );
  const [airline, setAirline] = useState<Airline | null>(null);
  const [fleet, setFleet] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!iata) return;
    try {
      const airlineData = await apiService.getAirlineByIATA(iata);
      setAirline(airlineData);
      setFleet(airlineData.frota || []);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
      toast.error("Companhia não encontrada.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [iata]);

  useSSE(() => fetchData());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070d1a]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!airline)
    return (
      <div className="pt-20 text-center text-muted-foreground">
        Companhia não encontrada.
      </div>
    );

  const filtered = fleet.filter((a) => {
    const matchSearch =
      a.prefixo.toLowerCase().includes(search.toLowerCase()) ||
      a.modelo.toLowerCase().includes(search.toLowerCase());
    const matchTipo =
      filterTipo === "all" ||
      (filterTipo === "passenger"
        ? a.tipo?.toLowerCase() === "passageiros" ||
          a.tipo?.toLowerCase() === "passenger"
        : a.tipo?.toLowerCase() === "carga" ||
          a.tipo?.toLowerCase() === "cargo");
    return matchSearch && matchTipo;
  });

  const passageiros = fleet.filter(
    (a) =>
      a.tipo?.toLowerCase() === "passageiros" ||
      a.tipo?.toLowerCase() === "passenger",
  ).length;
  const carga = fleet.filter(
    (a) =>
      a.tipo?.toLowerCase() === "carga" || a.tipo?.toLowerCase() === "cargo",
  ).length;

  return (
    <div className="min-h-screen pt-14" style={{ background: "#070d1a" }}>
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(13,22,40,0.98) 0%, rgba(7,13,26,1) 100%)",
          borderBottom: "1px solid rgba(0,200,248,0.1)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse 60% 80% at 80% 50%, rgba(0, 200, 248, 0.15), transparent)`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 transition-colors hover:text-primary"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "13px",
              color: "#6b7fa3",
            }}
          >
            <ArrowLeft size={14} />
            Voltar ao Dashboard
          </button>

          <div className="flex items-start gap-6">
            <div
              className="flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center"
              style={{
                background: `rgba(0, 200, 248, 0.1)`,
                border: `2px solid rgba(0, 200, 248, 0.2)`,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#00c8f8",
                  letterSpacing: "0.05em",
                }}
              >
                {airline.codigo_iata}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#e8edf5",
                  }}
                >
                  {airline.nome}
                </h1>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span
                  className="flex items-center gap-1.5"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "#6b7fa3",
                  }}
                >
                  <span style={{ color: "#00c8f8" }}>ID</span> #{airline.id}
                </span>
                <span style={{ color: "rgba(0,200,248,0.2)" }}>|</span>
                <span
                  className="flex items-center gap-1.5"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "#6b7fa3",
                  }}
                >
                  <MapPin size={11} /> {airline.pais}
                </span>
                <span style={{ color: "rgba(0,200,248,0.2)" }}>|</span>
                <span
                  className="flex items-center gap-1.5"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "#6b7fa3",
                  }}
                >
                  <Calendar size={11} /> Est. {airline.ano_fundacao}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "14px",
                  color: "#6b7fa3",
                  maxWidth: "560px",
                  lineHeight: 1.6,
                }}
              >
                Companhia aérea operando em {airline.pais}. Fundada em{" "}
                {airline.ano_fundacao}.
              </p>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              {[
                {
                  label: "TOTAL FROTA",
                  value: String(fleet.length),
                  color: "#00c8f8",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg px-4 py-3 text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: s.color,
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "9px",
                      color: "#6b7fa3",
                      letterSpacing: "0.1em",
                      marginTop: "2px",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-6">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(0,200,248,0.06)",
              border: "1px solid rgba(0,200,248,0.15)",
            }}
          >
            <Users size={13} style={{ color: "#00c8f8" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "#00c8f8",
              }}
            >
              {passageiros} PASSAGEIROS
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(124,58,237,0.06)",
              border: "1px solid rgba(124,58,237,0.15)",
            }}
          >
            <Package size={13} style={{ color: "#a855f7" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "#a855f7",
              }}
            >
              {carga} CARGA
            </span>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <div
            className="flex-1 flex items-center gap-2 px-4 rounded-lg"
            style={{
              background: "rgba(15,30,54,0.8)",
              border: "1px solid rgba(0,200,248,0.12)",
              height: "40px",
            }}
          >
            <Search size={14} style={{ color: "#6b7fa3" }} />
            <input
              type="text"
              placeholder="Buscar por prefixo ou modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#e8edf5",
              }}
            />
          </div>
          <FilterBtn
            active={filterTipo === "all"}
            onClick={() => setFilterTipo("all")}
          >
            TODOS
          </FilterBtn>
          <FilterBtn
            active={filterTipo === "passenger"}
            onClick={() => setFilterTipo("passenger")}
          >
            PAX
          </FilterBtn>
          <FilterBtn
            active={filterTipo === "cargo"}
            onClick={() => setFilterTipo("cargo")}
          >
            CARGO
          </FilterBtn>
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid rgba(0,200,248,0.1)",
            background: "rgba(13,22,40,0.6)",
          }}
        >
          <div
            className="grid items-center px-5 py-3"
            style={{
              gridTemplateColumns: "1.4fr 1.8fr 0.8fr 0.7fr 0.9fr",
              borderBottom: "1px solid rgba(0,200,248,0.08)",
              background: "rgba(0,200,248,0.03)",
            }}
          >
            {["PREFIXO", "MODELO", "TIPO", "CAPACIDADE", "ANO"].map((h) => (
              <span
                key={h}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#6b7fa3",
                  letterSpacing: "0.1em",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Plane
                size={32}
                style={{ color: "#0f1e36", margin: "0 auto 12px" }}
              />
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "14px",
                  color: "#6b7fa3",
                }}
              >
                Nenhuma aeronave encontrada
              </p>
            </div>
          ) : (
            filtered.map((ac, idx) => {
              const isCargo =
                ac.tipo?.toLowerCase() === "carga" ||
                ac.tipo?.toLowerCase() === "cargo";
              return (
                <div
                  key={ac.id}
                  className="grid items-center px-5 py-3.5 cursor-pointer transition-colors hover:bg-white/[0.03]"
                  style={{
                    gridTemplateColumns: "1.4fr 1.8fr 0.8fr 0.7fr 0.9fr",
                    borderBottom:
                      idx < filtered.length - 1
                        ? "1px solid rgba(0,200,248,0.05)"
                        : "none",
                  }}
                  onClick={() => {
                    setSelectedAircraft(ac);
                    toast.info(`Carregando dados de ${ac.prefixo}`, {
                      duration: 1500,
                    });
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: isCargo ? "#a855f7" : "#00c8f8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {ac.prefixo}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "13px",
                      color: "#c4cdd8",
                    }}
                  >
                    {ac.modelo}
                  </span>
                  <div
                    className="flex items-center gap-1.5 w-fit px-2 py-0.5 rounded"
                    style={{
                      background: isCargo
                        ? "rgba(124,58,237,0.1)"
                        : "rgba(0,200,248,0.08)",
                      border: `1px solid ${isCargo ? "rgba(124,58,237,0.2)" : "rgba(0,200,248,0.15)"}`,
                    }}
                  >
                    {isCargo ? (
                      <Package size={10} style={{ color: "#a855f7" }} />
                    ) : (
                      <Users size={10} style={{ color: "#00c8f8" }} />
                    )}
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "10px",
                        color: isCargo ? "#a855f7" : "#00c8f8",
                      }}
                    >
                      {isCargo ? "CARGO" : "PAX"}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "13px",
                      color: "#c4cdd8",
                    }}
                  >
                    {isCargo
                      ? `${ac.capacidade_carga_kg || 0}kg`
                      : ac.num_assentos || 0}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "13px",
                      color: "#6b7fa3",
                    }}
                  >
                    {ac.ano_fabricacao}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#4a5568",
            marginTop: "12px",
            letterSpacing: "0.05em",
          }}
        >
          {filtered.length} aeronave{filtered.length !== 1 ? "s" : ""} exibida
          {filtered.length !== 1 ? "s" : ""} · Clique para ver detalhes
        </p>
      </div>

      {selectedAircraft && (
        <AircraftCard
          aircraft={selectedAircraft}
          onClose={() => setSelectedAircraft(null)}
        />
      )}
    </div>
  );
}

function FilterBtn({
  children,
  active,
  onClick,
  accent = "#00c8f8",
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-lg transition-all"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        letterSpacing: "0.08em",
        color: active ? accent : "#6b7fa3",
        background: active ? `${accent}15` : "rgba(15,30,54,0.8)",
        border: `1px solid ${active ? `${accent}35` : "rgba(0,200,248,0.1)"}`,
        height: "40px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}
