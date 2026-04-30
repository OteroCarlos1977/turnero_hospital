import { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';

function parseLocalDate(dateValue) {
  if (!dateValue) return new Date();
  const [year, month, day] = dateValue.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Hook personalizado para obtener y transformar datos de la API
const TurnosOtorgados = (especialidadId) => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(`/api/turnos/otorgados/${especialidadId}`);
        const data = await response.json();
        
        if (!data.error && data.status === 200) {
          // Transformar los datos
          const transformedData = data.body.map(item => {
            const fecha = parseLocalDate(item.fecha_turno);
            const opcionesFecha = { weekday: 'long', day: '2-digit', month: '2-digit' };
            const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
            const horarioFormateado = item.horario.substring(0, 5);
            
            return {
              medico_id: Number(item.medico_id),
              fecha_turno: fechaFormateada,
              horario_turno: horarioFormateado
            };
          });
          setTurnos(transformedData);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [especialidadId]);

  return turnos;
};

export default TurnosOtorgados;
