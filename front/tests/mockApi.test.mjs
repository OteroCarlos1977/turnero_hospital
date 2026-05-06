import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

import { mockApiFetch } from '../src/services/mockApi.js';

function createLocalStorageMock() {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

async function readBody(response) {
  return response.json();
}

beforeEach(() => {
  globalThis.localStorage = createLocalStorageMock();
});

test('login mock devuelve token para credenciales validas', async () => {
  const response = await mockApiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario: 'admin', password: 'admin123' }),
  });
  const payload = await readBody(response);

  assert.equal(response.status, 200);
  assert.equal(payload.error, false);
  assert.equal(payload.body, 'mock-token-admin');
});

test('login mock rechaza credenciales invalidas', async () => {
  const response = await mockApiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario: 'admin', password: 'incorrecta' }),
  });
  const payload = await readBody(response);

  assert.equal(response.status, 401);
  assert.equal(payload.error, true);
  assert.equal(payload.body, 'Información Inválida');
});

test('devuelve medicos disponibles por especialidad', async () => {
  const response = await mockApiFetch('/api/medicos/disponible/1');
  const payload = await readBody(response);

  assert.equal(response.status, 200);
  assert.equal(payload.body.length, 2);
  assert.equal(payload.body[0].especialidad, 'Clínica Médica');
  assert.equal(payload.body[0].apellido, 'Pérez');
});

test('registra turno y lo devuelve con detalle por DNI', async () => {
  const turno = {
    id: 0,
    especialidad_id: 1,
    medico_id: 1,
    paciente_dni: '40000001',
    fecha_turno: '2026-06-10',
    horario: '09:30',
  };

  const createResponse = await mockApiFetch('/api/turnos', {
    method: 'POST',
    body: JSON.stringify(turno),
  });
  const createPayload = await readBody(createResponse);

  assert.equal(createResponse.status, 201);
  assert.equal(createPayload.body, 'Registro guardado con éxito');

  const listResponse = await mockApiFetch('/api/turnos/40000001');
  const listPayload = await readBody(listResponse);

  assert.equal(listPayload.body.length, 1);
  assert.equal(listPayload.body[0].especialidad, 'Clínica Médica');
  assert.equal(listPayload.body[0].medico_apellido, 'Pérez');
  assert.equal(listPayload.body[0].paciente_nombre, 'Paciente');
});

test('evita reservar dos turnos iguales para el mismo medico, fecha y horario', async () => {
  const turno = {
    id: 0,
    especialidad_id: 1,
    medico_id: 1,
    paciente_dni: '40000001',
    fecha_turno: '2026-06-10',
    horario: '09:30:00',
  };

  await mockApiFetch('/api/turnos', {
    method: 'POST',
    body: JSON.stringify(turno),
  });

  const response = await mockApiFetch('/api/turnos', {
    method: 'POST',
    body: JSON.stringify({ ...turno, id: 0, paciente_dni: '40000002', horario: '09:30' }),
  });
  const payload = await readBody(response);

  assert.equal(response.status, 409);
  assert.equal(payload.error, true);
  assert.equal(payload.body, 'El turno seleccionado ya no está disponible');
});

test('elimina turnos por id', async () => {
  await mockApiFetch('/api/turnos', {
    method: 'POST',
    body: JSON.stringify({
      id: 0,
      especialidad_id: 1,
      medico_id: 1,
      paciente_dni: '40000001',
      fecha_turno: '2026-06-10',
      horario: '09:30',
    }),
  });

  const beforeDelete = await readBody(await mockApiFetch('/api/turnos/40000001'));
  assert.equal(beforeDelete.body.length, 1);

  const deleteResponse = await mockApiFetch('/api/turnos', {
    method: 'PUT',
    body: JSON.stringify({ id: beforeDelete.body[0].id }),
  });
  const deletePayload = await readBody(deleteResponse);

  assert.equal(deletePayload.body, 'Registro eliminado satisfactoriamente');

  const afterDelete = await readBody(await mockApiFetch('/api/turnos/40000001'));
  assert.equal(afterDelete.body.length, 0);
});

test('protege rutas marcadas con auth cuando no hay token local', async () => {
  const response = await mockApiFetch('/api/turnos', { auth: true });
  const payload = await readBody(response);

  assert.equal(response.status, 401);
  assert.equal(payload.error, true);
  assert.equal(payload.body, 'No autorizado');
});
