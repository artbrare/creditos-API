const express = require("express");
const router = express.Router();

// Importar controladores de clientes
const {
    crearCliente,
    actualizarCliente,
    obtenerClientes,
    obtenerCliente,
    eliminarCliente,
} = require("../controllers/clientesController");

// Definir ruta para crear un cliente y obtener todos los clientes
router.route("/cliente")
    .post(crearCliente)
    .get(obtenerClientes);

// Definir ruta para actualizar, obtener y eliminar un cliente por su id
router.route('/cliente/:idCliente')
    .put(actualizarCliente)
    .get(obtenerCliente)
    .delete(eliminarCliente);

module.exports = router;
