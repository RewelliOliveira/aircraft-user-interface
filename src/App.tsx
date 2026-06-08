import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { Navbar } from "./app/components/Navbar";
import { Dashboard } from "./app/components/Dashboard";
import { AirlineDetails } from "./app/components/AirlineDetails";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.style.fontFamily = "'Inter', 'Outfit', sans-serif";
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/airline/:iata" element={<AirlineDetails />} />
      </Routes>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(13, 22, 40, 0.95)",
            border: "1px solid rgba(0, 200, 248, 0.2)",
            color: "#e8edf5",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            backdropFilter: "blur(12px)",
          },
        }}
        position="bottom-right"
      />
    </BrowserRouter>
  );
}
