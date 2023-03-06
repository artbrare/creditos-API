// Importamos la biblioteca mongoose para conectarnos a la base de datos MongoDB
const mongoose = require('mongoose');

mongoose.set({ 'strictQuery': true });

// Conexión a la base de datos
const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(con => {
        console.log(`MongoDB database connected with host: ${con.connection.host}`)
    });
}

module.exports = connectDatabase;