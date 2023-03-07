const mongoose = require("mongoose");

const creditoSchema = new mongoose.Schema({
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, "El crédito debe estar asociado a un cliente"],
      immutable: true // Atributo inmutable
    },
    monto: {
      type: Number,
      required: [true, "Ingrese el monto del crédito"],
      min: [1, "El monto mínimo del crédito es 1"],
    },
    tasaInteres: {
      type: Number,
      required: [true, "Ingrese la tasa de interés anual"],
      min: [0, "La tasa de interés mínima es 0"],
      max: [1, "La tasa de interés máxima es 1"],
    },
    plazo: {
      type: Number,
      required: [true, "Ingrese el plazo en meses"],
      min: [1, "El plazo mínimo es 1 mes"],
    },
    estatus: {
      type: String,
      enum: ['en proceso', 'activo','deuda pendiente','liquidado', 'cancelado', 'rechazado'],
      default: 'en proceso'
    },
    fechaCreacion: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true // Atributo inmutable
    },
    fechaAprobacion: { type: Date }, // fecha donde empieza a correr el crédito
    motivoRechazo: { type: String },
    eliminado: {
      type: Boolean,
      required: true,
      default: false,
    },
  });


module.exports = mongoose.model("Credito", creditoSchema);