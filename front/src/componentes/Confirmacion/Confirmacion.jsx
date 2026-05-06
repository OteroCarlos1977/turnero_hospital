import { useState } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import './Confirmacion.css'; 

export function Confirmacion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);

  const showAlert = () => {
    Swal.fire({
      title: 'Turno Confirmado',
      text: 'El turno ha sido confirmado y se ha enviado un correo con los detalles.',
      icon: 'success',
      confirmButtonText: 'Continuar',
    });
  }

  const { pacienteData,
    
    nombre_especialidad,
    nombre_medico,
    dia,
    horario, } = location.state || {};

  const handleAceptar = async () => {
    if (!pacienteData?.email) {
      await Swal.fire({
        title: 'Falta el email',
        text: 'No se encontró el email del paciente para enviar la confirmación.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    setEnviando(true);

    try {
      const response = await apiFetch("/api/enviarEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: pacienteData.email,
          subject: "Confirmación de Turno",
          text: `Estimado/a ${pacienteData.nombre} ${pacienteData.apellido},
          
          Su turno ha sido confirmado con los siguientes detalles:
          - Especialidad: ${nombre_especialidad}
          - Médico: Dr. ${nombre_medico}
          - Día: ${dia}
          - Hora: ${horario}

          Por favor, preséntese con unos minutos de antelación.`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.body || "Error al enviar el correo de confirmación");
      }

      await showAlert();

      navigate("/");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      await Swal.fire({
        title: 'No se pudo enviar el email',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container-confirmacion">
      <h3>TURNO SOLICITADO</h3>
      <div className="datos-turno">
        <p><strong>Especialidad:</strong> {nombre_especialidad}</p>
        <p><strong>Médico:</strong> Dr. {nombre_medico}</p>
        <p><strong>Día:</strong> {dia}</p>
        <p><strong>Hora:</strong> {horario}</p>
        <p><strong>Nombre del Paciente:</strong> {pacienteData.nombre} {pacienteData.apellido}</p>
        <p><strong>Email del Paciente:</strong> {pacienteData.email}</p>
      </div>
      <button onClick={handleAceptar} className="btnConfirmacion" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Aceptar Turno'}
      </button>
    </div>
  );
}
