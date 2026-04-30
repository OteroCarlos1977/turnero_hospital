const nodemailer = require('nodemailer');

function sendJson(res, status, body, error = false) {
  res.status(status).json({
    error,
    status,
    body,
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, 'Método no permitido', true);
  }

  const { to, subject, text } = req.body || {};

  if (!to || !subject || !text) {
    return sendJson(res, 400, 'Faltan datos obligatorios para enviar el correo', true);
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return sendJson(res, 500, 'El servicio de correo no está configurado', true);
  }

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Turnero Hospital" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    return sendJson(res, 200, 'Correo enviado exitosamente');
  } catch (error) {
    console.error('[email error]', error);
    return sendJson(res, 500, 'Error al enviar el correo', true);
  }
};
