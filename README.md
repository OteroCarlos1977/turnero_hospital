# Turnero Hospital

Aplicación para gestionar turnos médicos. Permite seleccionar especialidad, consultar disponibilidad, registrar pacientes, reservar/cancelar turnos y administrar médicos, usuarios, especialidades y horarios.

La versión preparada para deploy en Vercel funciona como demo estática con una API mock basada en JSON y persistencia en `localStorage`. No requiere MySQL ni backend Express para el despliegue.

## Tecnologías

- Frontend: React, Vite, React Router, React Hook Form, SweetAlert2.
- Demo deploy: Vercel + JSON/localStorage.
- Backend histórico/local: Node.js, Express, MySQL, JWT, bcrypt, Nodemailer.

## Deploy En Vercel

La configuración está en `vercel.json`.

1. Importar el repositorio en Vercel.
2. Usar la raíz del repo como directorio del proyecto.
3. Vercel ejecutará:

```bash
cd front && npm install
cd front && npm run build
```

4. La salida publicada será `front/dist`.

La app usa por defecto:

```env
VITE_API_MODE=mock
VITE_EMAIL_MODE=mock
```

Esto hace que las llamadas `/api/...` se resuelvan contra datos JSON del navegador y se persistan en `localStorage`.

Para enviar emails reales desde Vercel, configurar estas variables en el proyecto:

```env
SMTP_SERVICE=gmail
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password
VITE_EMAIL_MODE=real
```

En Gmail debe usarse una contraseña de aplicación. No guardar estas credenciales en el repositorio.

Usuario demo:

- Usuario: `admin`
- Password: `admin123`

Para reiniciar los datos demo en el navegador, borrar el `localStorage` del sitio.

## Requisitos Para Desarrollo Local

- Node.js 18 o superior.
- MySQL 8 o compatible solo si se usa el backend histórico.
- Cuenta SMTP solo si se usa el backend histórico para correo real.

## Configuración

1. Instalar dependencias del frontend:

```bash
cd front
npm install
```

2. Levantar el frontend:

```bash
npm run dev
```

Por defecto, el frontend corre en `http://localhost:5173`.

## Backend Local Opcional

El backend Express/MySQL se conserva para desarrollo local o futura evolución con base real.

1. Instalar dependencias del backend desde la raíz:

```bash
npm install
```

2. Crear el archivo `.env` en la raíz usando `.env.example` como base.

3. Crear la base de datos usando `docs/schema.sql`.

Opcionalmente, cargar datos demo:

```bash
mysql -u root -p turno_hospital < docs/seed.sql
```

Usuario demo:

- Usuario: `admin`
- Password: `admin123`

4. Levantar el backend:

```bash
npm run dev
```

Para conectar el frontend al backend real:

```env
VITE_API_MODE=remote
VITE_API_URL=http://localhost:3000
```

## Variables De Entorno

```env
PORT=3000
JWT_SECRET=replace-with-a-long-random-secret
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=turno_hospital
SMTP_SERVICE=gmail
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
```

En el frontend se puede configurar la URL de la API con:

```env
VITE_API_URL=http://localhost:3000
```

## Seguridad

- Las credenciales no deben versionarse.
- Las contraseñas de usuarios se guardan con bcrypt.
- El JWT expira a las 8 horas.
- Las operaciones administrativas requieren token Bearer.
- Las consultas SQL con parámetros externos deben mantenerse parametrizadas.

## Endpoints Principales

- `POST /api/auth/login`
- `GET /api/especialidad`
- `GET /api/medicos/disponible/:id`
- `POST /api/pacientes`
- `POST /api/turnos`
- `GET /api/turnos/:dni`
- `PUT /api/turnos`
- `GET /api/usuarios/usuarios/` con JWT
- `POST /api/medicos` con JWT
- `POST /api/usuarios` con JWT
- `POST /api/especialidad` con JWT
- `POST /api/disponibilidad` con JWT
