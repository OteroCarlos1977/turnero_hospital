// Requerimos express y otros módulos necesarios
const express = require('express');
const config = require('./config');
const cors = require('cors');
const nodemailer = require('nodemailer');
const respuesta = require('./red/respuestas');

const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

// Requerimos las rutas de Pacientes, Turnos, Médicos, Especialidades y Disponibilidad
const pacientes = require('./modulos/pacientes/rutas');
const turnos = require('./modulos/turnos/rutas');
const medicos = require('./modulos/medicos/rutas');
const especialidad = require('./modulos/especialidades/rutas');
const disponibilidad = require('./modulos/disponibilidad_medica/rutas');
const usuarios = require('./modulos/usuarios/rutas');
const auth = require('./modulos/auth/rutas')

// Manejo de errores
const error = require('./red/errors');

// Utilización de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Configuración del puerto
app.set('port', config.app.port);

const transporter = nodemailer.createTransport({
    service: config.smtp.service,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
    },
});

// Endpoint para enviar el email

app.post('/api/enviarEmail', (req, res) => {
    const { to, subject, text } = req.body;

    if (!config.smtp.user || !config.smtp.pass) {
        return respuesta.error(req, res, 'El servicio de correo no está configurado', 500);
    }

    if (!to || !subject || !text) {
        return respuesta.error(req, res, 'Faltan datos obligatorios para enviar el correo', 400);
    }

    const mailOptions = {
        from: config.smtp.user,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return respuesta.error(req, res, 'Error al enviar el correo', 500);
        } else {
            console.log('Email enviado: ' + info.response);
            return respuesta.success(req, res, 'Correo enviado exitosamente', 200);
        }
    });
});

// Configuración de las rutas
// Estas rutas corresponden a los módulos de tu aplicación
app.use('/api/pacientes', pacientes);
app.use('/api/medicos', medicos);
app.use('/api/turnos', turnos);
app.use('/api/especialidad', especialidad);
app.use('/api/disponibilidad', disponibilidad);
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use(error);
// Exportamos la instancia de Express configurada
module.exports = app;
