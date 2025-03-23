import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Map = ({ endereco }) => {
  const [coordenadas, setCoordenadas] = useState({ lat: -23.5505, lng: -46.6333 }); // Coordenadas padrão (São Paulo)
  const [erro, setErro] = useState(null); // Estado para armazenar erros
  const [carregando, setCarregando] = useState(false); // Estado para indicar carregamento

  useEffect(() => {
    if (!endereco || endereco.trim() === "") {
      setErro("Endereço não fornecido.");
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const geocodificarEndereco = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            endereco
          )}&key=AIzaSyAduCVtekC9pPo89fNcser4_IAzF8SCHRQ`,
          { signal }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar dados de geocodificação.");
        }

        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordenadas({ lat, lng });
        } else {
          throw new Error(
            data.error_message || "Endereço não encontrado ou inválido."
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Erro ao geocodificar endereço:", error);
          setErro(`Erro ao geocodificar endereço: ${error.message}`);
        }
      } finally {
        setCarregando(false);
      }
    };

    geocodificarEndereco();

    return () => controller.abort(); // Cancela a requisição ao desmontar o componente
  }, [endereco]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAduCVtekC9pPo89fNcser4_IAzF8SCHRQ">
      {/* Exibe mensagem de erro se houver */}
      {erro && (
        <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
          {erro}
        </div>
      )}

      {/* Exibe mensagem de carregamento */}
      {carregando && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          Carregando mapa...
        </div>
      )}

      {/* Renderiza o mapa apenas se não houver erro e não estiver carregando */}
      {!erro && !carregando && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={coordenadas}
          zoom={15}
        >
          <Marker position={coordenadas} />
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default Map;