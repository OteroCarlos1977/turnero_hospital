import { useState, useEffect } from "react";
import { Button } from "../Button/Button.jsx";
import { InputField } from "../InputField/InputField";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../services/api";

import "./Carga.css";

export function Carga() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab } = location.state || {};
  const [especialidades, setEspecialidades] = useState([]);

  const showAlert = () => {
    Swal.fire({
      title: "Medico Guardado",
      text: "El registro del nuevo medico a sido guardado con exito.",
      icon: "success",
      confirmButtonText: "Continuar",
    });
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await apiFetch("/api/especialidad");
        const data = await response.json();
        if (!data.error) {
          setEspecialidades(data.body);
        }
      } catch (error) {
        console.error("Error al obtener especialidades:", error);
      }
    };
    fetchEspecialidades();
  }, []);

  const formatFecha = (fecha) => {
    const [day, month, year] = fecha.split("/");
    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (data) => {
    if (data.fecha_ingreso) {
      data.fecha_ingreso = formatFecha(data.fecha_ingreso);
    }

    const requestData = { id: 0, ...data };
    let endpoint = "";

    switch (activeTab) {
      case "medicos":
        endpoint = "/api/medicos";
        break;
      case "usuarios":
        endpoint = "/api/usuarios/";
        break;
      case "especialidades":
        endpoint = "/api/especialidad/";
        break;
      case "turnos":
        endpoint = "/api/turnos";
        break;
      default:
        console.error("Tab no válido");
        return;
    }

    try {
      const response = await apiFetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        auth: activeTab !== "turnos",
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos");
      }

      showAlert();
      navigate("/administrar");
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <>
      <div className="container_form">
        <h4 className="titulo_form">{`Cargar Nuevo:  ${activeTab}`}</h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          {activeTab === "medicos" && (
            <>
              <InputField
                label="Nombre"
                id="nombre"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Apellido"
                id="apellido"
                register={register}
                required
                errors={errors}
              />

              <div className="form-group">
                <label htmlFor="especialidad_id">Especialidad</label>
                <select
                  id="especialidad_id"
                  {...register("especialidad_id", { required: true })}
                >
                  <option value="">Seleccione una especialidad</option>
                  {especialidades.map((especialidad) => (
                    <option key={especialidad.id} value={especialidad.id}>
                      {especialidad.espec}
                    </option>
                  ))}
                </select>
                {errors.especialidad_id && <span>Este campo es requerido</span>}
              </div>

              <InputField
                label="Teléfono"
                id="telefono"
                register={register}
                required
                errors={errors}
              />

              <InputField
                label="Fecha Ingreso (DD/MM/YYYY)"
                id="fecha_ingreso"
                register={register}
                required
                errors={errors}
              />

              <InputField
                label="Matrícula"
                id="matricula"
                register={register}
                required
                errors={errors}
              />
            </>
          )}

          {activeTab === "usuarios" && (
            <>
              <InputField
                label="Nombre"
                id="nombre"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Apellido"
                id="apellido"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Legajo"
                id="legajo"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Email"
                id="email"
                type="email"
                register={register}
                required
                errors={errors}
                pattern={/^\S+@\S+$/i}
              />
              <InputField
                label="Rol"
                id="rol_id"
                type="number"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Usuario"
                id="usuario"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Password"
                id="password"
                type="password"
                register={register}
                required
                errors={errors}
              />
            </>
          )}

          {activeTab === "especialidades" && (
            <InputField
              label="Especialidad"
              id="espec"
              register={register}
              required
              errors={errors}
            />
          )}

          {activeTab === "turnos" && (
            <>
              <InputField
                label="Nombre Paciente"
                id="nombre_paciente"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Apellido Paciente"
                id="apellido_paciente"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="DNI"
                id="dni"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Fecha del Turno"
                id="fecha_turno"
                type="date"
                register={register}
                required
                errors={errors}
              />
              <InputField
                label="Horario"
                id="horario_turno"
                type="time"
                register={register}
                required
                errors={errors}
              />
            </>
          )}

          <div className="submit-button-container">
            <Button
              type="submit"
              texto={` Guardar ${
                activeTab === "medicos"
                  ? "Médico"
                  : activeTab === "usuarios"
                  ? "Usuario"
                  : activeTab === "especialidades"
                  ? "Especialidad"
                  : "Turno"
              }`}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              icono={faSave}
            />
            
              <Button
                texto="  Cancelar"
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                }}
                onClick={() => navigate("/administrar")}
                icono={faTimes}
                tooltip="Cancelar y volver"
              />
            </div>
          
        </form>
      </div>
    </>
  );
}
