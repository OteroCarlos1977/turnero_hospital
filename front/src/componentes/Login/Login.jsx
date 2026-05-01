import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { InputField } from "../InputField/InputField";
import { Button } from "../Button/Button";
import { apiFetch } from "../../services/api";
import './Login.css'

// eslint-disable-next-line react/prop-types
export function Login({ onLoginSuccess }) {
  const [data, setData] = useState({ usuario: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const { register, formState: { errors }, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const loginResponse = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const loginJson = await loginResponse.json();

      if (!loginJson.error && loginJson.body) {
        const token = loginJson.body;

        localStorage.setItem('authToken', token);

        const userResponse = await apiFetch(`/api/usuarios/usuario/${formData.usuario}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          auth: true,
        });

        const userJson = await userResponse.json();

        if (!userJson.error && userJson.body) {
          const { nombre, apellido } = userJson.body[0];
          onLoginSuccess(token, { nombre, apellido });

          navigate("/administrar", { state: { nombre, apellido } });
        } else {
          setLoginError('No se pudieron obtener los datos del usuario');
        }
      } else {
        setLoginError('Nombre de usuario o clave incorrectos');
      }

    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      setLoginError("Hubo un error al realizar la solicitud");
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
      <div className="login-heading">
        <span className="eyebrow">Acceso interno</span>
        <h1>Administración</h1>
        <p>Ingresá con tu usuario para gestionar médicos, especialidades, disponibilidad y turnos.</p>
      </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form_login">
          <InputField
            label="Usuario"
            id="usuario"
            name="usuario"
            type="text"
            value={data.usuario}
            onChange={(e) => setData({ ...data, usuario: e.target.value })}
            register={register}
            required
            errors={errors}
          />
          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            register={register}
            required
            errors={errors}
          />

          {loginError && <p className="error_message">{loginError}</p>}

          <div className="submit-button-container">
          <Button
              texto="Ingresar"
              className="btn-primary"
              type="submit"
            />
             <Button
            texto="Volver"
            onClick={() => navigate("/")}
            tooltip="Regresar a la página anterior"
          />

          </div>
         
        </form>
      </div>
    </section>
  );
}
