import { useEffect } from "react";
import { toast } from "sonner";

const SSE_URL = import.meta.env.VITE_SSE_URL || "http://localhost:8000/eventos/stream";

export function useSSE(onEvent?: (event: any) => void) {
  useEffect(() => {
    const eventSource = new EventSource(SSE_URL);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[SSE] Evento recebido:", data);
        
        switch (data.tipo) {
          case "AERONAVE_ADICIONADA":
            toast.success(`Nova aeronave ${data.dados.prefixo} adicionada!`);
            break;
          case "AERONAVE_REMOVIDA":
            toast.warning(`Aeronave removida da frota.`);
            break;
          case "COMPANHIA_CRIADA":
            toast.success(`Nova companhia ${data.dados.nome} cadastrada!`);
            break;
          case "COMPANHIA_REMOVIDA":
            toast.error(`Uma companhia foi removida do sistema.`);
            break;
        }

        if (onEvent) onEvent(data);
      } catch (error) {
        console.error("[SSE] Erro ao processar evento:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("[SSE] Erro na conexão:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [onEvent]);
}
