const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface Airline {
  id: number;
  nome: string;
  codigo_iata: string;
  pais: string;
  ano_fundacao: number;
  frota: Aircraft[];
}

export interface Aircraft {
  id: number;
  prefixo: string;
  modelo: string;
  fabricante: string;
  ano_fabricacao: number;
  autonomia_km: number;
  tipo: string;
  piloto_automatico_ativo: boolean;
  companhia_id: number;
  num_assentos?: number;
  classes_disponiveis?: string;
  tripulacao_minima?: number;
  capacidade_carga_kg?: number;
  tipo_mercadoria?: string;
  temperatura_controlada?: boolean;
}

export const apiService = {
  async getAirlines(): Promise<Airline[]> {
    const response = await fetch(`${API_BASE_URL}/companhias`);
    if (!response.ok) throw new Error("Falha ao buscar companhias");
    return response.json();
  },

  async getAirline(id: number): Promise<Airline> {
    const response = await fetch(`${API_BASE_URL}/companhias/${id}`);
    if (!response.ok) throw new Error("Falha ao buscar companhia");
    return response.json();
  },

  async getAirlineByIATA(iata: string): Promise<Airline> {
    const response = await fetch(`${API_BASE_URL}/companhias/iata/${iata}`);
    if (!response.ok) throw new Error("Falha ao buscar companhia por IATA");
    return response.json();
  },

  async getGlobalFleet(): Promise<Aircraft[]> {
    const response = await fetch(`${API_BASE_URL}/aeronaves`);
    if (!response.ok) throw new Error("Falha ao buscar frota global");
    return response.json();
  },

  async getFleet(airlineId: number): Promise<Aircraft[]> {
    const response = await fetch(`${API_BASE_URL}/companhias/${airlineId}/aeronaves`);
    if (!response.ok) throw new Error("Falha ao buscar frota");
    return response.json();
  },

  async addAircraft(airlineId: number, data: Partial<Aircraft>): Promise<Aircraft> {
    const response = await fetch(`${API_BASE_URL}/companhias/${airlineId}/aeronaves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Falha ao adicionar aeronave");
    return response.json();
  },

  async removeAircraft(airlineId: number, aircraftId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/companhias/${airlineId}/aeronaves/${aircraftId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Falha ao remover aeronave");
  }
};
