import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import {faTimes, faSave, faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { apiFetch } from "../../services/api";

const DIAS_SEMANA = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
  { id: 7, nombre: "Domingo" },
];

export function Vista() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTab, id } = location.state || {};
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    id: 0,
    medico_id: id || "",
    dia_semana: "",
    hora_inicio: "",
    hora_fin: "",
  });

  useEffect(() => {
    if (activeTab === "medicos" && id) {
      // Fetch para obtener los datos del médico
      apiFetch(`/api/disponibilidad/medico/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            setDatos(data.body);
          } else {
            setError("No se pudieron cargar los datos.");
          }
        })
        .catch(() => {
          setError("Error al conectarse con el servidor.");
        });
    }
  }, [activeTab, id]);

  const handleAgregar = () => {
    setIsModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      const response = await apiFetch("/api/disponibilidad/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        auth: true,
        body: JSON.stringify(nuevoRegistro),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el horario");
      }

      const diaSeleccionado = DIAS_SEMANA.find(
        (dia) => dia.id === Number(nuevoRegistro.dia_semana)
      );

      setDatos([
        ...datos,
        {
          ...nuevoRegistro,
          dia: diaSeleccionado?.nombre || "",
        },
      ]);
      setIsModalOpen(false);
      Swal.fire({
        title: "Éxito al Guardar",
        text: "El nuevo horario fue guardado",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el horario.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro({ ...nuevoRegistro, [name]: value });
  };

  const handleEdit = () => {
    Swal.fire({
      title: "Edición pendiente",
      text: "La edición de horarios todavía no está implementada.",
      icon: "info",
      confirmButtonText: "Aceptar",
    });
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Está seguro?",
        text: "No podrá revertir esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        return;
      }

      const response = await apiFetch('/api/disponibilidad/', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        auth: true,
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setDatos((prevDatos) => prevDatos.filter((item) => item.id !== id));
        await Swal.fire({
          title: "Eliminado",
          text: "El registro se ha eliminado satisfactoriamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el elemento.",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el elemento.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    }
  };

  if (activeTab !== "medicos") {
    return (
      <div>
        <h2>Detalles no disponibles para esta pestaña</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Días Disponibles del Dr. </h2>
      {error && <p className="error_message">{error}</p>}
      {datos.length > 0 && (
        <div>
          <h3>{`${datos[0].nombre} ${datos[0].apellido}`}</h3>
          <Button
            tooltip="Nuevo"
            icono={faPlusCircle}
            style={{ color: "black", backgroundColor: "rgba(7, 2, 224, 0.7)" }}
            onClick={handleAgregar}
          />
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((item, index) => (
                <tr key={index}>
                  <td>{item.dia}</td>
                  <td>{item.hora_inicio}</td>
                  <td>{item.hora_fin}</td>
                  <td>
                    <Button
                      style={{
                        backgroundColor: "rgba(0, 174, 13, 0.8)",
                        borderRadius: "50%",
                        color: "black",
                        border: "none",
                        padding: "10px 15px",
                      }}
                      icono={faEdit}
                      tooltip="Editar"
                      onClick={() => handleEdit(item.id)}
                    />
                    <Button
                      style={{
                        backgroundColor: "rgba(0, 174, 131, 0.8)",
                        borderRadius: "50%",
                        color: "black",
                        border: "none",
                        padding: "10px 15px",
                      }}
                      icono={faTrash}
                      tooltip="Eliminar"
                      onClick={() => handleDelete(item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Button
        texto="Volver"
        style={{ backgroundColor: "rgba(117, 225, 113, 0.8)" }}
        onClick={() => navigate("/administrar")}
        tooltip="Regresar a la página anterior"
      />

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar Nuevo Registro</h3>
            <form>
            <label>
              Día de la Semana:
              <select
                name="dia_semana"
                value={nuevoRegistro.dia_semana}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un día</option>
                {DIAS_SEMANA.map((dia) => (
                  <option key={dia.id} value={dia.id}>
                    {dia.nombre}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Hora de Inicio:
              <input
                type="time"
                name="hora_inicio"
                value={nuevoRegistro.hora_inicio}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Hora de Fin:
              <input
                type="time"
                name="hora_fin"
                value={nuevoRegistro.hora_fin}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <Button
              texto="   Guardar"
              style={{
                backgroundColor: "rgba(7, 87, 173, 0.8)",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
              }}
              onClick={() => handleGuardar()}
              icono={faSave}
              tooltip="Guardar los cambios realizados"
            />
            <Button
              texto="   Cancelar"
              style={{
                backgroundColor: "rgba(223, 112, 14, 0.85)",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
              }}
              onClick={() => navigate('/Administrador')}
              icono={faTimes}
              tooltip="Cancelar y volver"
            />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
