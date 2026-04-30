require('dotenv').config();

module.exports = {
    app:{
        port: process.env.PORT || 3000,
    },
    jwt:{
        secret: process.env.JWT_SECRET || 'change-me-in-production',
        
    },
    mysql:{
        host: process.env.MYSQL_HOST || 'localhost',
        port: Number(process.env.MYSQL_PORT) || 3306,
        user: process.env.MYSQL_USER || 'root',
        password:  process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DB || 'turno_hospital',
        
    },
    smtp:{
        service: process.env.SMTP_SERVICE || 'gmail',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
}
