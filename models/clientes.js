const mongoose = require("mongoose");
validator = require("validator");

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "Favor de ingresar tu nombre."],
    maxlength: 50,
  },
  apellidos: {
    type: String,
    required: ["Favor de ingresar tus apellidos."],
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, "Favor de ingresar tu correo electrónico."],
    unique: true,
    validate: [validator.isEmail, "Escribe un correo electrónico válido."],
    maxlength: 256,
  },
  fechaNacimiento: {
    type: Date,
    required: [true, "Ingresa tu fecha de nacimiento"],
  },
  rfc: {
    type: String,
    required: [true, "Ingresa tu RFC."],
    unique: true,
    match: /^[A-ZÑ&]{4}\d{6}[A-Z\d]{3}$/,
    maxlength: 13,
  },
  curp: {
    type: String,
    required: [true, "Ingresa tu CURP"],
    unique: true,
    match: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]{2}$/i,
    maxlength: 18,
  },
  genero: {
    type: String,
    enum: ["Masculino", "Femenino", "No binario", "Prefiero no decir"],
  },
  estadoCivil: {
    type: String,
    enum: [
      "Soltero/a",
      "Casado/a",
      "Divorciado/a",
      "Viudo/a",
      "Unión libre",
      "Separado/a",
      "Prefiero no decir",
    ],
  },
  direccion: {
    calle: String,
    colonia: String,
    ciudad: String,
    estado: String,
    codigoPostal: String,
  },
  montoSolicitado: {
    type: Number,
    required: [true, "Favor de ingresar el monto solicitado"]
  },
  ingresosMensuales: {
    type:Number,
    required: [true, "En caso de no tener ingresos actualmente, escribir 0."]
  },
  eliminado: {
    type: Boolean,
    required: true,
    default: false,
  },
  fechaCreacion: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true // Atributo inmutable
  },
});

module.exports = mongoose.model("Cliente", clienteSchema);
