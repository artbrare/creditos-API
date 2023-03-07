// Importación de paquetes necesarios
const express = require('express');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require('body-parser')

// Creacion de la instancia de la aplicación
const app = express();

// Configuración de las variables de entorno
dotenv.config({path: './src/config/config.env'});

// Conexión a la base de datos
const connectDatabase = require('./config/database');
connectDatabase();

// Middleware para analizar las peticiones HTTP en formato JSON
app.use(express.json());

// API documentacion en página princial
app.use(bodyParser.urlencoded({ extended : true }));

app.use(express.static('public'));

// Configuración de los middlewares de seguridad
app.use(helmet());
app.use(xssClean());
app.use(hpp());
app.use(cors());

// / Configuración del límite de solicitudes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // número máximo de solicitudes
});
app.use(limiter)

// Configuración de las rutas
const clientes = require('./routes/clientes');
const creditos = require('./routes/creditos');
app.use('/api/v1', clientes);
app.use('/api/v1', creditos);

// Manejo de errores para rutas no encontradas
app.all("*", (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found.`), 404);
});

// Configuración del middleware de manejo de errores
const errorMiddleware = require('./middlewares/errors');
const ErrorHandler = require('./utils/errorHandler');
app.use(errorMiddleware);

// Inicio del servidor
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
});

// Manejando rechazos de promesas no capturadas
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection.')
    server.close(() => {
        process.exit(1);
    });
});

