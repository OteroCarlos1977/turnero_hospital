USE turno_hospital;

INSERT INTO especialidad (id, espec) VALUES
  (1, 'Clínica Médica'),
  (2, 'Cardiología')
ON DUPLICATE KEY UPDATE espec = VALUES(espec);

INSERT INTO medicos (id, nombre, apellido, especialidad_id, telefono, fecha_ingreso, matricula) VALUES
  (1, 'Ana', 'Pérez', 1, '1122334455', CURDATE(), 'MN-1001'),
  (2, 'Luis', 'Gómez', 2, '1166778899', CURDATE(), 'MN-1002')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  apellido = VALUES(apellido),
  especialidad_id = VALUES(especialidad_id),
  telefono = VALUES(telefono),
  fecha_ingreso = VALUES(fecha_ingreso),
  matricula = VALUES(matricula);

INSERT INTO disponibilidad_medica (id, medico_id, dia_semana, hora_inicio, hora_fin) VALUES
  (1, 1, 1, '09:00:00', '12:00:00'),
  (2, 1, 3, '14:00:00', '17:00:00'),
  (3, 2, 2, '10:00:00', '13:00:00')
ON DUPLICATE KEY UPDATE
  medico_id = VALUES(medico_id),
  dia_semana = VALUES(dia_semana),
  hora_inicio = VALUES(hora_inicio),
  hora_fin = VALUES(hora_fin);

INSERT INTO usuarios (id, nombre, apellido, legajo, email, rol_id) VALUES
  (1, 'Admin', 'Demo', 'ADM-1', 'admin@example.com', 1)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  apellido = VALUES(apellido),
  legajo = VALUES(legajo),
  email = VALUES(email),
  rol_id = VALUES(rol_id);

INSERT INTO auth (id, usuario, password) VALUES
  (1, 'admin', '$2b$05$0bCnabn5eeeDb8L0Ih8xmOSNX9BnE3tp22KRtLSlI0ipjz4xpFalK')
ON DUPLICATE KEY UPDATE
  usuario = VALUES(usuario),
  password = VALUES(password);
