const express = require("express");
const router = express.Router();

// Importar controladores de clientes
const {
    crearCredito,
    actualizarCredito,
    obtenerCreditos,
    obtenerCredito,
    eliminarCredito,
} = require("../controllers/creditosController");

// Definir ruta para crear un crédito y obtener todos los créditos de un cliente
router.route("/cliente/:idCliente/credito")
    .post(crearCredito)
    .get(obtenerCreditos);

// Definir ruta para actualizar, obtener y eliminar un crédito por su id y el id del cliente
router.route("/cliente/:idCliente/credito/:idCredito")
    .put(actualizarCredito)
    .get(obtenerCredito)
    .delete(eliminarCredito);

module.exports = router;