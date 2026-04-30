// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../Button/Button';
import {faUser, faUserMd, faStethoscope, faCalendarCheck, faEye, faEdit, faTrash, faPlusCircle, faList, faIdCard, faBriefcaseMedical, faHospitalUser } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { apiFetch } from '../../services/api';

import './Administrador.css';

export function Administrador() {
  const location = useLocation();
  const navigate = useNavigate();
  const { nombre, apellido } = location.state || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [medicos, setMedicos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [especialidad, setEspecialidad] = useState([]);
  const [activeTab, setActiveTab] = useState('medicos');
  

  // Efecto para obtener la lista de médicos
  useEffect(() => {
    if (activeTab === 'medicos') {
      const fetchMedicos = async () => {
        try {
          const response = await apiFetch('/api/medicos/conespec/', { auth: true });
          const data = await response.json();
          if (!data.error && data.body) {
            setMedicos(data.body);
          } else {
            console.error('Error al obtener la lista de médicos');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }

      
      };

      fetchMedicos();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'usuarios') {
      const fetchUsuarios = async () => {
        try {
          const response = await apiFetch('/api/usuarios/usuarios/', { auth: true });
          const data = await response.json();
          if (!data.error && data.body) {
            setUsuarios(data.body);
          } else {
            console.error('Error al obtener la lista de usuarios');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }

      
      };

      fetchUsuarios();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'especialidades') {
      const fetchEspecialidades = async () => {
        try {
          const response = await apiFetch('/api/especialidad/');
          const data = await response.json();
          if (!data.error && data.body) {
            setEspecialidad(data.body);
          } else {
            console.error('Error al obtener la lista de especialidades');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }

      
      };

      fetchEspecialidades();
    }
  }, [activeTab]);

  

  // Filtrar médicos según el término de búsqueda
  const filteredMedicos = medicos.filter(medico =>
    Object.values(medico).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredUsuarios = usuarios.filter(usuario =>
    Object.values(usuario).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredEspecialidad = especialidad.filter(especialidad =>
    Object.values(especialidad).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  
  // Función para cambiar de pestaña
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm(''); // Reiniciar el término de búsqueda al cambiar de pestaña
  };

  // Usar navigate para redirigir a Carga con activeTab
  const handleShowCarga = () => {
    navigate('/carga', { state: { activeTab } });
  };

  

const handleDelete = async (id) => {
    try {
        // Mostrar el mensaje de confirmación utilizando SweetAlert2
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: 'No podrá revertir esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) {
            // Si el usuario cancela, no se procede con la eliminación
            return;
        }

        let url = '';
        let updateState;

        // Seleccionamos la URL y la función de actualización según la pestaña activa
        switch (activeTab) {
            case 'medicos':
                url = '/api/medicos';
                updateState = setMedicos;
                break;
            case 'usuarios':
                url = '/api/usuarios';
                updateState = setUsuarios;
                break;
            case 'especialidades':
                url = '/api/especialidad';
                updateState = setEspecialidad;
                break;
            default:
                console.error('Pestaña activa desconocida');
                return;
        }

        // Realizamos la solicitud PUT para eliminar el registro
        const response = await apiFetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            auth: true,
            body: JSON.stringify({ id }), // Enviamos el ID en el cuerpo de la solicitud
        });

        if (response.ok) {
            // Filtramos el estado actual para eliminar el elemento borrado
            updateState(prevItems => prevItems.filter(item => item.id !== id));

            // Mostrar mensaje de éxito
            await Swal.fire({
                title: 'Eliminado',
                text: 'El registro se ha eliminado satisfactoriamente.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: `No se pudo eliminar el elemento en la pestaña ${activeTab}.`,
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            });
        }
    } catch (err) {
        Swal.fire({
            title: 'Error',
            text: `Error al eliminar el elemento en la pestaña ${activeTab}.`,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
        });
    }
};

const handleView = (id) => {
  navigate('/vista', { state: { activeTab, id } });
};

const handleEdit = (id) => {
  navigate('/editar', { state: { activeTab, id } });
  // Lógica para editar el médico
};


  return (
    <section className="admin-page">
    <div className='encabezado admin-hero'>
      <div>
        <span className="eyebrow admin-eyebrow">Panel de control</span>
        <h1>Administración de turnos</h1>
        <h4>Sesión activa: <strong>{nombre} {apellido}</strong></h4>
      </div>
      <Button
        className="btn-primary"
        texto="Nuevo"
        icono={faPlusCircle}
        onClick={handleShowCarga}
      />
    </div> 

     {/* Barra de navegación de pestañas */}
     <div className="tabs">
      <Button
          tooltip="Medicos" 
          icono={faUserMd}
          className={activeTab === 'medicos' ? 'tab-active' : ''}
          onClick={() => handleTabChange('medicos')}
        />
        <Button
          tooltip="Usuarios" 
          icono={faUser}
          className={activeTab === 'usuarios' ? 'tab-active' : ''}
          onClick={() => handleTabChange('usuarios')}
        />
        <Button
          tooltip="Especialidad" 
          icono={faStethoscope}
          className={activeTab === 'especialidades' ? 'tab-active' : ''}
          onClick={() => handleTabChange('especialidades')}
        />
        <Button
          tooltip="Turnos" 
          icono={faCalendarCheck}
          className={activeTab === 'turnos' ? 'tab-active' : ''}
          onClick={() => handleTabChange('turnos')}
        />
      </div>
      {/* Input de búsqueda */}
      <div className="admin-toolbar">
        <input
          className='busqueda'
          type="text"
          placeholder={`Buscar en ${activeTab}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mostrar contenido según la pestaña activa */}
      {activeTab === 'medicos' && (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Fecha de Ingreso</th>
              <th>Matrícula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicos.map((medico) => (
              <tr key={medico.id}>
                <td>{medico.nombre}</td>
                <td>{medico.apellido}</td>
                <td>{medico.especialidad}</td>
                <td>{medico.telefono}</td>
                <td>{new Date(medico.fecha_ingreso).toLocaleDateString()}</td>
                <td>{medico.matricula}</td>
                <td>
                <Button 
                    className="btn-icon"
                    icono={faEye} 
                    tooltip="Ver"
                    onClick={() => handleView(medico.id)} 
                  />
                  <Button 
                    className="btn-icon"
                    icono={faEdit} 
                    tooltip="Editar" 
                    onClick={() => handleEdit(medico.id)} 
                  />
                  <Button 
                    className="btn-icon btn-danger"
                    icono={faTrash} 
                    tooltip="Eliminar" 
                    onClick={() => handleDelete(medico.id)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      )}
      

      {activeTab === 'usuarios' && (
        <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Legajo</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.legajo}</td>
              <td>{usuario.email}</td>
              <td>{usuario.rol_id}</td>
              <td>{usuario.usuario}</td>
              <td>
              
                <Button 
                  className="btn-icon"
                  icono={faEdit} 
                  tooltip="Editar" 
                  onClick={() => handleEdit(usuario.id)} 
                />
                <Button 
                  className="btn-icon btn-danger"
                  icono={faTrash} 
                  tooltip="Eliminar" 
                  onClick={() => handleDelete(usuario.id)} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}

      {activeTab === 'especialidades' && (
        
        <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEspecialidad.map((especialidad) => (
            <tr key={especialidad.id}>
              <td>{especialidad.espec}</td>
              <td>
               <Button 
                  className="btn-icon"
                  icono={faEdit} 
                  tooltip="Editar" 
                  onClick={() => handleEdit(especialidad.id)} 
                />
                <Button 
                  className="btn-icon btn-danger"
                  icono={faTrash} 
                  tooltip="Eliminar" 
                  onClick={() => handleDelete(especialidad.id)} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
        
      

      {activeTab === 'turnos' && (
        
        <div className="turnos-actions">
        <Button 
        icono={faList} 
        texto="Todos"
        tooltip="Todos" 
        onClick={() => navigate('/vista-turnos', { state: { vista:'todos' } })} 
        />
        <Button 
        icono={faIdCard} 
        texto="Por DNI"
        tooltip="Por DNI" 
        onClick={() => navigate('/vista-turnos', { state: { vista: 'dni' } })} 
        />
        <Button 
        icono={faBriefcaseMedical} 
        texto="Por especialidad"
        tooltip="Por Especialidad" 
        onClick={() => navigate('/vista-turnos', { state: { vista: 'especialidad' } })} 
        />
        <Button 
        icono={faHospitalUser} 
        texto="Por médico"
        tooltip="Por Medico" 
        onClick={() => navigate('/vista-turnos', { state: { vista: 'medico' } })} 
        />
      
      </div>
      
       )}
    </section>
  );
}





