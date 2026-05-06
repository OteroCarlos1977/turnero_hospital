const STORAGE_KEY = 'turnero_hospital_mock_db_v1';
const EMAIL_MODE = import.meta.env?.VITE_EMAIL_MODE || 'mock';

const seedDb = {
  especialidad: [
    { id: 1, espec: 'Clínica Médica' },
    { id: 2, espec: 'Cardiología' },
    { id: 3, espec: 'Pediatría' },
  ],
  dias: [
    { id: 1, dia: 'Lunes' },
    { id: 2, dia: 'Martes' },
    { id: 3, dia: 'Miércoles' },
    { id: 4, dia: 'Jueves' },
    { id: 5, dia: 'Viernes' },
    { id: 6, dia: 'Sábado' },
    { id: 7, dia: 'Domingo' },
  ],
  medicos: [
    { id: 1, nombre: 'Ana', apellido: 'Pérez', especialidad_id: 1, telefono: '1122334455', fecha_ingreso: '2024-02-15', matricula: 'MN-1001' },
    { id: 2, nombre: 'Luis', apellido: 'Gómez', especialidad_id: 2, telefono: '1166778899', fecha_ingreso: '2023-11-08', matricula: 'MN-1002' },
    { id: 3, nombre: 'María', apellido: 'Sosa', especialidad_id: 3, telefono: '1144556677', fecha_ingreso: '2024-06-20', matricula: 'MN-1003' },
  ],
  disponibilidad_medica: [
    { id: 1, medico_id: 1, dia_semana: 1, hora_inicio: '09:00:00', hora_fin: '12:00:00' },
    { id: 2, medico_id: 1, dia_semana: 3, hora_inicio: '14:00:00', hora_fin: '17:00:00' },
    { id: 3, medico_id: 2, dia_semana: 2, hora_inicio: '10:00:00', hora_fin: '13:00:00' },
    { id: 4, medico_id: 3, dia_semana: 4, hora_inicio: '08:30:00', hora_fin: '11:30:00' },
  ],
  pacientes: [
    { id: 1, nombre: 'Paciente', apellido: 'Demo', dni: '40000001', edad: 30, fecha_nacimiento: '1996-01-01', genero: 'M', direccion: 'Calle Demo 123', telefono: '1100000000', email: 'paciente@example.com', fecha_registro: '2026-04-30' },
  ],
  turnos: [],
  usuarios: [
    { id: 1, nombre: 'Admin', apellido: 'Demo', legajo: 'ADM-1', email: 'admin@example.com', rol_id: 1 },
  ],
  auth: [
    { id: 1, usuario: 'admin', password: 'admin123' },
  ],
  emails: [],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadDb() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial = clone(seedDb);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function jsonResponse(body, status = 200, error = false) {
  return Promise.resolve(new Response(JSON.stringify({ error, status, body }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }));
}

function getBody(options) {
  if (!options?.body) return {};
  return JSON.parse(options.body);
}

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : 1;
}

function upsert(items, data, key = 'id') {
  const item = { ...data };
  if (!item[key] || Number(item[key]) === 0) {
    item[key] = nextId(items);
    items.push(item);
    return item;
  }

  const index = items.findIndex((current) => String(current[key]) === String(item[key]));
  if (index >= 0) {
    items[index] = { ...items[index], ...item };
    return items[index];
  }

  items.push(item);
  return item;
}

function removeById(items, id) {
  const index = items.findIndex((item) => String(item.id) === String(id));
  if (index >= 0) items.splice(index, 1);
}

function getEspecialidad(db, id) {
  return db.especialidad.find((item) => Number(item.id) === Number(id));
}

function getMedico(db, id) {
  return db.medicos.find((item) => Number(item.id) === Number(id));
}

function getDia(db, id) {
  return db.dias.find((item) => Number(item.id) === Number(id));
}

function turnosConDetalle(db) {
  return db.turnos.map((turno) => {
    const medico = getMedico(db, turno.medico_id) || {};
    const especialidad = getEspecialidad(db, turno.especialidad_id) || {};
    const paciente = db.pacientes.find((item) => String(item.dni) === String(turno.paciente_dni)) || {};

    return {
      ...turno,
      medico_nombre: medico.nombre,
      medico_apellido: medico.apellido,
      medico_id: medico.id,
      espec_id: especialidad.id,
      especialidad: especialidad.espec,
      paciente_nombre: paciente.nombre,
      paciente_apellido: paciente.apellido,
      nombre: medico.nombre,
      apellido: medico.apellido,
    };
  });
}

function medicosConEspecialidad(db) {
  return db.medicos.map((medico) => ({
    ...medico,
    especialidad: getEspecialidad(db, medico.especialidad_id)?.espec || '',
  }));
}

function disponibilidadPorEspecialidad(db, especialidadId) {
  return db.medicos
    .filter((medico) => Number(medico.especialidad_id) === Number(especialidadId))
    .flatMap((medico) => db.disponibilidad_medica
      .filter((item) => Number(item.medico_id) === Number(medico.id))
      .map((item) => ({
        especialidad: getEspecialidad(db, medico.especialidad_id)?.espec,
        id: medico.id,
        nombre: medico.nombre,
        apellido: medico.apellido,
        dia: getDia(db, item.dia_semana)?.dia,
        hora_inicio: item.hora_inicio,
        hora_fin: item.hora_fin,
      })));
}

function disponibilidadPorMedico(db, medicoId) {
  const medico = getMedico(db, medicoId) || {};

  return db.disponibilidad_medica
    .filter((item) => Number(item.medico_id) === Number(medicoId))
    .map((item) => ({
      id: item.id,
      apellido: medico.apellido,
      nombre: medico.nombre,
      dia_semana: item.dia_semana,
      dia: getDia(db, item.dia_semana)?.dia,
      hora_inicio: item.hora_inicio,
      hora_fin: item.hora_fin,
    }));
}

function normalizeTime(value) {
  return String(value || '').slice(0, 5);
}

function isSameTurno(a, b) {
  return Number(a.medico_id) === Number(b.medico_id)
    && String(a.fecha_turno) === String(b.fecha_turno)
    && normalizeTime(a.horario) === normalizeTime(b.horario);
}

function isAuthorized(options) {
  if (!options?.auth) return true;
  return Boolean(localStorage.getItem('authToken'));
}

export function mockApiFetch(path, options = {}) {
  const db = loadDb();
  const method = (options.method || 'GET').toUpperCase();
  const normalizedPath = path.replace(/\/$/, '');

  if (!isAuthorized(options)) {
    return jsonResponse('No autorizado', 401, true);
  }

  if (normalizedPath === '/api/auth/login' && method === 'POST') {
    const body = getBody(options);
    const auth = db.auth.find((item) => item.usuario === body.usuario && item.password === body.password);
    if (!auth) return jsonResponse('Información Inválida', 401, true);
    return jsonResponse(`mock-token-${auth.usuario}`);
  }

  if (normalizedPath === '/api/enviarEmail' && method === 'POST') {
    if (EMAIL_MODE === 'real') {
      return fetch('/api/enviarEmail', {
        method: 'POST',
        headers: options.headers || { 'Content-Type': 'application/json' },
        body: options.body,
      });
    }

    const body = getBody(options);
    db.emails.push({ id: nextId(db.emails), ...body, fecha: new Date().toISOString() });
    saveDb(db);
    return jsonResponse('Correo enviado exitosamente');
  }

  if (normalizedPath === '/api/especialidad' && method === 'GET') return jsonResponse(db.especialidad);
  if (normalizedPath.startsWith('/api/especialidad/') && method === 'GET') {
    const id = normalizedPath.split('/').pop();
    return jsonResponse(db.especialidad.filter((item) => Number(item.id) === Number(id)));
  }
  if (normalizedPath === '/api/especialidad' && method === 'POST') {
    upsert(db.especialidad, getBody(options));
    saveDb(db);
    return jsonResponse('Registro guardado con éxito', 201);
  }
  if (normalizedPath === '/api/especialidad' && method === 'PUT') {
    removeById(db.especialidad, getBody(options).id);
    saveDb(db);
    return jsonResponse('Registro eliminado satisfactoriamente');
  }

  if (normalizedPath === '/api/medicos/conespec' && method === 'GET') return jsonResponse(medicosConEspecialidad(db));
  if (normalizedPath.startsWith('/api/medicos/disponible/') && method === 'GET') {
    const id = normalizedPath.split('/').pop();
    return jsonResponse(disponibilidadPorEspecialidad(db, id));
  }
  if (normalizedPath === '/api/medicos' && method === 'GET') return jsonResponse(db.medicos);
  if (normalizedPath.startsWith('/api/medicos/') && method === 'GET') {
    const id = normalizedPath.split('/').pop();
    return jsonResponse(db.medicos.filter((item) => Number(item.id) === Number(id)));
  }
  if (normalizedPath === '/api/medicos' && method === 'POST') {
    upsert(db.medicos, getBody(options));
    saveDb(db);
    return jsonResponse('Registro guardado con éxito', 201);
  }
  if (normalizedPath === '/api/medicos' && method === 'PUT') {
    removeById(db.medicos, getBody(options).id);
    saveDb(db);
    return jsonResponse('Registro eliminado satisfactoriamente');
  }

  if (normalizedPath === '/api/pacientes' && method === 'POST') {
    upsert(db.pacientes, getBody(options));
    saveDb(db);
    return jsonResponse('Registro guardado con éxito', 201);
  }
  if (normalizedPath.startsWith('/api/pacientes/') && method === 'GET') {
    const dni = normalizedPath.split('/').pop();
    return jsonResponse(db.pacientes.filter((item) => String(item.dni) === String(dni)));
  }

  if (normalizedPath === '/api/turnos' && method === 'GET') return jsonResponse(turnosConDetalle(db));
  if (normalizedPath.startsWith('/api/turnos/otorgados/') && method === 'GET') {
    const id = normalizedPath.split('/').pop();
    return jsonResponse(db.turnos.filter((item) => Number(item.especialidad_id) === Number(id)));
  }
  if (normalizedPath.startsWith('/api/turnos/') && method === 'GET') {
    const dni = normalizedPath.split('/').pop();
    return jsonResponse(turnosConDetalle(db).filter((item) => String(item.paciente_dni) === String(dni)));
  }
  if (normalizedPath === '/api/turnos' && method === 'POST') {
    const body = getBody(options);
    const exists = db.turnos.some((turno) => isSameTurno(turno, body) && Number(turno.id) !== Number(body.id));
    if (exists) {
      return jsonResponse('El turno seleccionado ya no está disponible', 409, true);
    }
    upsert(db.turnos, body);
    saveDb(db);
    return jsonResponse('Registro guardado con éxito', 201);
  }
  if (normalizedPath === '/api/turnos' && method === 'PUT') {
    removeById(db.turnos, getBody(options).id);
    saveDb(db);
    return jsonResponse('Registro eliminado satisfactoriamente');
  }

  if (normalizedPath === '/api/disponibilidad' && method === 'GET') return jsonResponse(db.disponibilidad_medica);
  if (normalizedPath.startsWith('/api/disponibilidad/medico/') && method === 'GET') {
    const id = normalizedPath.split('/').pop();
    return jsonResponse(disponibilidadPorMedico(db, id));
  }
  if (normalizedPath === '/api/disponibilidad' && method === 'POST') {
    upsert(db.disponibilidad_medica, getBody(options));
    saveDb(db);
    return jsonResponse('Registro guardado con éxito', 201);
  }
  if (normalizedPath === '/api/disponibilidad' && method === 'PUT') {
    removeById(db.disponibilidad_medica, getBody(options).id);
    saveDb(db);
    return jsonResponse('Registro eliminado satisfactoriamente');
  }

  if (normalizedPath === '/api/usuarios/usuarios' && method === 'GET') {
    return jsonResponse(db.usuarios.map((usuario) => ({
      ...usuario,
      usuario: db.auth.find((auth) => Number(auth.id) === Number(usuario.id))?.usuario || '',
    })));
  }
  if (normalizedPath.startsWith('/api/usuarios/usuario/') && method === 'GET') {
    const usuario = normalizedPath.split('/').pop();
    const auth = db.auth.find((item) => item.usuario === usuario);
    return jsonResponse(db.usuarios.filter((item) => Number(item.id) === Number(auth?.id)));
  }
  if (normalizedPath.startsWith('/api/usuarios/') && method === 'GET') {
    const id = normalizedPath.split('/').pop();
    return jsonResponse(db.usuarios.filter((item) => Number(item.id) === Number(id)));
  }
  if (normalizedPath === '/api/usuarios' && method === 'POST') {
    const body = getBody(options);
    const usuario = upsert(db.usuarios, body);
    if (body.usuario || body.password) {
      upsert(db.auth, {
        id: usuario.id,
        usuario: body.usuario,
        password: body.password,
      });
    }
    saveDb(db);
    return jsonResponse('Registro guardado con éxito', 201);
  }
  if (normalizedPath === '/api/usuarios' && method === 'PUT') {
    const id = getBody(options).id;
    removeById(db.usuarios, id);
    removeById(db.auth, id);
    saveDb(db);
    return jsonResponse('Registro eliminado satisfactoriamente');
  }

  return jsonResponse(`Ruta mock no implementada: ${method} ${path}`, 404, true);
}
