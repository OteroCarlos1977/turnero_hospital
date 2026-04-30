CREATE DATABASE IF NOT EXISTS turno_hospital;
USE turno_hospital;

CREATE TABLE IF NOT EXISTS especialidad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  espec VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS dias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dia VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO dias (id, dia) VALUES
  (1, 'Lunes'),
  (2, 'Martes'),
  (3, 'Miércoles'),
  (4, 'Jueves'),
  (5, 'Viernes'),
  (6, 'Sábado'),
  (7, 'Domingo')
ON DUPLICATE KEY UPDATE dia = VALUES(dia);

CREATE TABLE IF NOT EXISTS pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni VARCHAR(20) NOT NULL UNIQUE,
  edad INT,
  fecha_nacimiento DATE,
  genero VARCHAR(20),
  direccion VARCHAR(150),
  telefono VARCHAR(30),
  email VARCHAR(120),
  fecha_registro DATE
);

CREATE TABLE IF NOT EXISTS medicos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  especialidad_id INT NOT NULL,
  telefono VARCHAR(30),
  fecha_ingreso DATE,
  matricula VARCHAR(50),
  FOREIGN KEY (especialidad_id) REFERENCES especialidad(id)
);

CREATE TABLE IF NOT EXISTS disponibilidad_medica (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medico_id INT NOT NULL,
  dia_semana INT NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  FOREIGN KEY (medico_id) REFERENCES medicos(id),
  FOREIGN KEY (dia_semana) REFERENCES dias(id)
);

CREATE TABLE IF NOT EXISTS turnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  especialidad_id INT NOT NULL,
  paciente_dni VARCHAR(20) NOT NULL,
  medico_id INT NOT NULL,
  fecha_turno DATE NOT NULL,
  horario TIME NOT NULL,
  FOREIGN KEY (especialidad_id) REFERENCES especialidad(id),
  FOREIGN KEY (medico_id) REFERENCES medicos(id),
  FOREIGN KEY (paciente_dni) REFERENCES pacientes(dni),
  UNIQUE KEY turno_unico (medico_id, fecha_turno, horario)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  legajo VARCHAR(50),
  email VARCHAR(120),
  rol_id INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS auth (
  id INT PRIMARY KEY,
  usuario VARCHAR(80) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);
