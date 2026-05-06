# Turnero Hospital

Aplicacion web para gestionar turnos medicos. Permite seleccionar especialidad, consultar disponibilidad, registrar pacientes, reservar o cancelar turnos y acceder a un panel administrativo para administrar medicos, usuarios, especialidades, disponibilidad y turnos.

Demo: https://turnero-hospital-two.vercel.app/

## Estado Del Proyecto

El repositorio esta preparado como demo funcional para Vercel. La aplicacion usa una API mock en el navegador con datos JSON y persistencia en `localStorage`, por lo que no requiere base MySQL ni backend Express para probar el flujo completo.

El envio de correo se conserva como funcion serverless en `api/enviarEmail.js` y puede ejecutarse en modo mock o real segun las variables de entorno.

## Funcionalidades

- Home de presentacion para solicitar o consultar turnos.
- Seleccion de especialidad y medico disponible.
- Reserva de turnos con datos del paciente.
- Consulta y cancelacion de turnos por DNI.
- Login administrativo.
- Panel de administracion para medicos, usuarios, especialidades, disponibilidad y turnos.
- Exportacion o generacion de documentos con `jspdf`.
- Persistencia demo en `localStorage`.
- Modo mock para Vercel sin backend externo.

## Tecnologias

- React 18
- Vite
- React Router
- React Hook Form
- SweetAlert2
- Font Awesome
- jsPDF
- Vercel Serverless Functions
- localStorage

## Usuario Demo

```text
Usuario: admin
Password: admin123
```

Para reiniciar los datos demo, borrar el `localStorage` del dominio en el navegador.

## Instalacion Local

Desde la raiz del repositorio:

```bash
npm install
cd front
npm install
npm run dev
```

La aplicacion queda disponible normalmente en:

```text
http://localhost:5173
```

## Build

```bash
cd front
npm run build
```

Para previsualizar el build:

```bash
npm run preview
```

## Validacion

```bash
cd front
npm run lint
npm run build
```

El lint y el build fueron validados luego de la limpieza de comentarios y ajustes visuales del navbar.

## Deploy En Vercel

La configuracion esta en `vercel.json`.

```text
Install command: npm install && cd front && npm install
Build command: cd front && npm run build
Output directory: front/dist
```

Variables recomendadas para demo:

```env
VITE_API_MODE=mock
VITE_EMAIL_MODE=mock
```

Para envio real de email desde Vercel:

```env
SMTP_SERVICE=gmail
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password
VITE_EMAIL_MODE=real
```

En Gmail se debe usar una contrasena de aplicacion. No subir credenciales al repositorio.

## Estructura

```text
api/
  enviarEmail.js          Funcion serverless para email
front/
  src/componentes/        Componentes de la aplicacion
  src/services/api.js     Capa de acceso a API
  src/services/mockApi.js API mock y persistencia demo
docs/
  schema.sql              Referencia historica del modelo relacional
  seed.sql                Datos demo de referencia
```

## Notas De Seguridad

- Las credenciales SMTP deben configurarse solo como variables de entorno.
- La demo usa credenciales simples porque corre en modo presentacion.
- Para una version productiva se recomienda backend real, JWT firmado, hashing de contrasenas y base persistente.
- Los datos de `localStorage` no deben considerarse persistencia real.

## Mejoras Recomendadas

- Agregar tests de flujo para reserva, cancelacion y panel administrativo.
- Sustituir credenciales demo por autenticacion real si el proyecto evoluciona fuera de presentacion.
- Revisar tamanos de chunks si se agregan mas funcionalidades de documentos PDF.
