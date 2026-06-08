import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Plane,
  Users,
  Package,
  Globe,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { apiService } from "../services/api";
import type { Airline, Aircraft } from "../services/api";
import { useSSE } from "../hooks/useSSE";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";

export function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [airlinesData, aircraftData] = await Promise.all([
        apiService.getAirlines(),
        apiService.getGlobalFleet(),
      ]);
      setAirlines(airlinesData);
      setAircraft(aircraftData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados da frota. Verifique a API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useSSE(() => fetchData());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070d1a]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const filtered = airlines.filter(
    (a) =>
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.codigo_iata.toLowerCase().includes(search.toLowerCase()),
  );

  const totalFleet = aircraft.length;
  const totalPassenger = aircraft.filter(
    (a) =>
      a.tipo?.toLowerCase() === "passageiro" ||
      a.tipo?.toLowerCase() === "passenger",
  ).length;
  const totalCargo = aircraft.filter(
    (a) =>
      a.tipo?.toLowerCase() === "carga" || a.tipo?.toLowerCase() === "cargo",
  ).length;

  const fleetByAirline = airlines.map((a) => ({
    name: a.codigo_iata,
    total: aircraft.filter((ac) => ac.companhia_id === a.id).length,
  }));

  return (
    <div className="min-h-screen pt-14" style={{ background: "#070d1a" }}>
      {/* Background mesh */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,200,248,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(124,58,237,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                color: "#00c8f8",
                letterSpacing: "0.2em",
              }}
            >
              AIRCRAFT API // DASHBOARD
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "38px",
              fontWeight: 700,
              color: "#e8edf5",
              lineHeight: 1.15,
            }}
          >
            Fleet Intelligence
            <br />
            <span style={{ color: "#00c8f8" }}>Monitor</span>
          </h1>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "15px",
              color: "#6b7fa3",
              marginTop: "10px",
            }}
          >
            Monitoramento em tempo real das frotas aéreas brasileiras
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "AERONAVES",
              value: totalFleet,
              sub: "na base de dados",
              color: "#00c8f8",
              icon: <Plane size={16} />,
            },
            {
              label: "PASSAGEIROS",
              value: totalPassenger,
              sub: "aeronaves PAX",
              color: "#00c8f8",
              icon: <Users size={16} />,
            },
            {
              label: "CARGA",
              value: totalCargo,
              sub: "aeronaves cargo",
              color: "#a855f7",
              icon: <Package size={16} />,
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl p-5"
              style={{
                background: "rgba(13,22,40,0.8)",
                border: "1px solid rgba(0,200,248,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    color: "#6b7fa3",
                    letterSpacing: "0.15em",
                  }}
                >
                  {kpi.label}
                </span>
                <div style={{ color: kpi.color, opacity: 0.6 }}>{kpi.icon}</div>
              </div>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "32px",
                  fontWeight: 700,
                  color: kpi.color,
                  lineHeight: 1,
                }}
              >
                {kpi.value}
              </p>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "11px",
                  color: "#4a5568",
                  marginTop: "6px",
                }}
              >
                {kpi.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div
              className="flex items-center gap-2 px-4 mb-4 rounded-lg"
              style={{
                background: "rgba(15,30,54,0.9)",
                border: "1px solid rgba(0,200,248,0.12)",
                height: "42px",
              }}
            >
              <Search size={14} style={{ color: "#6b7fa3" }} />
              <input
                type="text"
                placeholder="Buscar companhia por nome, IATA ou ICAO..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: "#e8edf5",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#4a5568",
                }}
              >
                {filtered.length}/{airlines.length}
              </span>
            </div>

            <div className="space-y-2">
              {filtered.map((airline) => {
                const fleetCount = aircraft.filter(
                  (a) => a.companhia_id === airline.id,
                ).length;

                return (
                  <div
                    key={airline.id}
                    className="rounded-xl p-4 cursor-pointer transition-all group"
                    style={{
                      background: "rgba(13,22,40,0.7)",
                      border: "1px solid rgba(0,200,248,0.08)",
                      backdropFilter: "blur(4px)",
                    }}
                    onClick={() => {
                      navigate(`/airline/${airline.codigo_iata}`);
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(0,200,248,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(0,200,248,0.08)";
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `rgba(0, 200, 248, 0.1)`,
                          border: `1.5px solid rgba(0, 200, 248, 0.2)`,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#00c8f8",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {airline.codigo_iata}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p
                            style={{
                              fontFamily: "'Outfit', sans-serif",
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#e8edf5",
                            }}
                          >
                            {airline.nome}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="flex items-center gap-1"
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "10px",
                              color: "#4a5568",
                            }}
                          >
                            <Globe size={9} /> {airline.pais}
                          </span>
                          <span style={{ color: "rgba(0,200,248,0.15)" }}>
                            ·
                          </span>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "10px",
                              color: "#4a5568",
                            }}
                          >
                            Est. {airline.ano_fundacao}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <p
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "20px",
                              fontWeight: 700,
                              color: "#00c8f8",
                              lineHeight: 1,
                            }}
                          >
                            {fleetCount}
                          </p>
                          <p
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "9px",
                              color: "#4a5568",
                              letterSpacing: "0.1em",
                              marginTop: "2px",
                            }}
                          >
                            AERONAVES
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "9px",
                              color: "#4a5568",
                              letterSpacing: "0.1em",
                              marginTop: "2px",
                            }}
                          >
                            AERONAVES
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          style={{ color: "#6b7fa3" }}
                          className="group-hover:text-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="mt-2" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(13,22,40,0.8)",
                border: "1px solid rgba(0,200,248,0.1)",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#6b7fa3",
                  letterSpacing: "0.12em",
                  marginBottom: "16px",
                }}
              >
                FROTA POR COMPANHIA
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={fleetByAirline} barSize={20}>
                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#6b7fa3",
                      fontSize: 10,
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0d1628",
                      border: "1px solid rgba(0,200,248,0.2)",
                      borderRadius: "8px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      color: "#e8edf5",
                    }}
                    cursor={{ fill: "rgba(0,200,248,0.05)" }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#00c8f8"
                    radius={[3, 3, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(13,22,40,0.8)",
                border: "1px solid rgba(0,200,248,0.1)",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#6b7fa3",
                  letterSpacing: "0.12em",
                  marginBottom: "12px",
                }}
              >
                ENDPOINTS DISPONÍVEIS
              </p>
              {[
                { method: "GET", path: "/airlines", color: "#10b981" },
                { method: "GET", path: "/airlines/{iata}", color: "#10b981" },
                { method: "GET", path: "/aircraft", color: "#10b981" },
                {
                  method: "GET",
                  path: "/aircraft/{prefixo}",
                  color: "#10b981",
                },
                { method: "POST", path: "/airlines", color: "#f59e0b" },
                { method: "POST", path: "/aircraft", color: "#f59e0b" },
              ].map((ep) => (
                <div
                  key={ep.path}
                  className="flex items-center gap-2 py-1.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "9px",
                      fontWeight: 600,
                      color: ep.color,
                      background: `${ep.color}15`,
                      padding: "2px 5px",
                      borderRadius: "3px",
                      letterSpacing: "0.05em",
                      minWidth: "38px",
                      textAlign: "center",
                    }}
                  >
                    {ep.method}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      color: "#6b7fa3",
                    }}
                  >
                    {ep.path}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(13,22,40,0.8)",
                border: "1px solid rgba(0,200,248,0.1)",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#6b7fa3",
                  letterSpacing: "0.12em",
                  marginBottom: "12px",
                }}
              >
                DISTRIBUIÇÃO POR TIPO
              </p>
              {[
                {
                  label: "Passageiros",
                  count: totalPassenger,
                  pct: Math.round((totalPassenger / totalFleet) * 100),
                  color: "#00c8f8",
                },
                {
                  label: "Carga",
                  count: totalCargo,
                  pct: Math.round((totalCargo / totalFleet) * 100),
                  color: "#a855f7",
                },
              ].map((t) => (
                <div key={t.label} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "12px",
                        color: "#c4cdd8",
                      }}
                    >
                      {t.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "11px",
                        color: t.color,
                      }}
                    >
                      {t.count}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${t.pct}%`,
                        background: t.color,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
