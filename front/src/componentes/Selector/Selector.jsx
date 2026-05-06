import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import { Aviso } from "../Aviso/Aviso";
import { apiFetch } from "../../services/api";

export function Selector() {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidad, setEspecialidad] = useState({ id: "", nombre: "" });
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await apiFetch("/api/especialidad");

        if (!response.ok) {
          throw new Error("Error al obtener las especialidades");
        }

        const data = await response.json();

        if (data.body && Array.isArray(data.body)) {
          setEspecialidades(data.body);
        } else {
          console.error("El formato de la respuesta no es el esperado:", data);
        }
      } catch (error) {
        console.error("Error al obtener las especialidades:", error);
      }
    };

    fetchEspecialidades();
  }, []);

  const handleContinue = () => {
    if (especialidad.id) {
      navigate("/tarjeta", {
        state: {
          especialidadId: especialidad.id,
          especialidadNombre: especialidad.nombre,
        },
      });
    } else {
      setShowMessage(true);
      
    }
  };

  return (
    <>
      <div style={{ display: showMessage ? "none" : "block" }}>
        <h3>Seleccione Especialidad Médica</h3>

        <select
          value={especialidad.id}
          onChange={(e) => {
            const selectedEspecialidad = especialidades.find(
              (esp) => esp.id === parseInt(e.target.value)
            );

            setEspecialidad({
              id: selectedEspecialidad?.id || "",
              nombre: selectedEspecialidad?.espec || "",
            });
          }}
        >
          <option value="">Seleccione una especialidad</option>

          {especialidades.map((esp, index) => (
            <option key={index} value={esp.id}>
              {esp.espec}
            </option>
          ))}
        </select>

        <Button
          texto="Continuar"
          style={{ backgroundColor: "rgba(86, 124, 219, 0.8)" }}
          onClick={handleContinue}
        />

        <Button
          texto="Volver"
          style={{ backgroundColor: "rgba(117, 225, 113, 0.8)" }}
          onClick={() => navigate("/")}
        />
      </div>
      <div className="mensaje">
        {showMessage && (
          <Aviso
            message="Por favor, seleccione una especialidad antes de continuar."
            buttonText="Entendido"
            onButtonClick={() => setShowMessage(false)}
          />
        )}
      </div>
    </>
  );
}
