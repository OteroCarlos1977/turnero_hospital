import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

import { apiFetch, apiUrl, authHeaders, getAuthToken } from '../src/services/api.js';

function createLocalStorageMock(initialEntries = []) {
  const store = new Map(initialEntries);

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

beforeEach(() => {
  globalThis.localStorage = createLocalStorageMock();
});

test('apiUrl construye rutas contra la URL base local por defecto', () => {
  assert.equal(apiUrl('/api/turnos'), 'http://localhost:3000/api/turnos');
});

test('getAuthToken lee token local y authHeaders lo serializa como Bearer', () => {
  localStorage.setItem('authToken', 'mock-token-admin');

  assert.equal(getAuthToken(), 'mock-token-admin');
  assert.deepEqual(authHeaders(), { Authorization: 'Bearer mock-token-admin' });
});

test('authHeaders devuelve objeto vacio cuando no hay token local', () => {
  assert.equal(getAuthToken(), null);
  assert.deepEqual(authHeaders(), {});
});

test('apiFetch usa el modo mock por defecto y devuelve respuesta normalizada', async () => {
  const response = await apiFetch('/api/especialidad');
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.error, false);
  assert.ok(payload.body.some((item) => item.espec === 'Clínica Médica'));
});

test('apiFetch respeta la marca auth cuando no existe token local', async () => {
  const response = await apiFetch('/api/turnos', { auth: true });
  const payload = await response.json();

  assert.equal(response.status, 401);
  assert.equal(payload.error, true);
  assert.equal(payload.body, 'No autorizado');
});
