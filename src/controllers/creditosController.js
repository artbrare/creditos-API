const Credito = require('../models/creditos');
const Cliente = require('../models/clientes');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFilters = require('../utils/apiFilters');


// POST: /api/v1/cliente/:idCliente/credito → Crea un crédito para un cliente
exports.crearCredito = catchAsyncErrors(async (req, res, next) => {

    // Verificar que el cliente existe o no esté eliminado
    const cliente = await Cliente.findById(req.params.idCliente);

    if (!cliente || cliente.eliminado) {
        return next(new ErrorHandler("No se encontró el cliente en la base de datos.", 404));
    };

    // Validar el cuerpo de la solicitud
    if (req.body.eliminado) {
        return next(new ErrorHandler("No se permite establecer 'eliminado' en la solicitud.", 400));
    }

    if (req.body.estatus) {
        return next(new ErrorHandler("No se permite establecer el estatus del crédito en la solicitud.", 400));
    }

    const credito = await Credito.create({ cliente: cliente._id, ...req.body });

    return res.status(200).json({
        success: true,
        message: 'Crédito creado exitosamente.',
        data: credito
    });
});

// PUT: /api/v1/cliente/:idCliente/credito/:idCredito → Actualiza información de crédito existente
exports.actualizarCredito = catchAsyncErrors(async (req, res, next) => {

    /* Reglas para actualizar un crédito:

    Los únicos campos, además de estatus, que se pueden modificar de un crédito son: monto, tasaInteres, plazo. Estos
    campos únicamente se pueden modificar si el estatus actual es "en proceso"
    
    Se puede actualizar el estatus del crédito siguiendo las siguientes reglas:

    - De "en proceso" se puede cambiar a cualquier otro estatus
    - De "activo" se puede cambiar a "deuda pendiente", "pagado", "cancelado"
    - De "deuda pendiente" se puede cambiar a "activo", "pagado", "cancelado"
    - No se puede modificar el estatus si su estatus previo es "pagado", "cancelado", "rechazado"

    Esto es con el fin del ejercicio. Posteriormente el campo estatus se podrá actualizar de otra manera. Por ejemplo: 
    si se agrega la funcionalidad de pagos, en el momento de pagar todo el monto de capital de un crédito el estatus
    puede ser cambiado a "Pagado". Ahorita esa funcionalidad se deja afuera del alcance de este ejercicio.
    
    */

    // Validar el cuerpo de la solicitud
    if (req.body.eliminado) {
        return next(new ErrorHandler("No se permite establecer 'eliminado' en la solicitud.", 400));
    };

    // Verificar que el cliente existe o no esté eliminado
    const cliente = await Cliente.findById(req.params.idCliente);
    if (!cliente || cliente.eliminado) {
        return next(new ErrorHandler("No se encontró el cliente en la base de datos.", 404));
    };

    // Verificar que el crédito existe o no esté eliminado
    let credito = await Credito.findOne({ _id: req.params.idCredito, cliente: req.params.idCliente });

    const { monto, tasaInteres, plazo, estatus, motivoRechazo } = req.body;

    if (credito.estatus === "en proceso") {
        credito.monto = monto || credito.monto;
        credito.tasaInteres = tasaInteres || credito.tasaInteres;
        credito.plazo = plazo || credito.plazo;

        if (estatus !== undefined && estatus === "rechazado") {
            if (motivoRechazo) {
                credito.motivoRechazo = motivoRechazo;
            };
        };

        if (estatus !== undefined && estatus === "activo") {
            credito.fechaAprobacion = Date.now();
        };
    };

    if (estatus !== undefined && estatus !== credito.estatus) {
        switch (credito.estatus) {
            case "activo":
                if (estatus !== "deuda pendiente" && estatus !== "pagado" && estatus !== "cancelado") {
                    return next(new ErrorHandler("No se puede cambiar a ese estatus desde 'activo'.", 400));
                }
                break;

            case "deuda pendiente":
                if (estatus !== "activo" && estatus !== "pagado" && estatus !== "cancelado") {
                    return next(new ErrorHandler("No se puede cambiar a ese estatus desde 'deuda pendiente'.", 400));
                }
                break;

            case "pagado":
            case "cancelado":
            case "rechazado":
                return next(new ErrorHandler("No se puede modificar el estatus de un crédito en ese estado.", 400));
        };
        credito.estatus = estatus;
    };

    const creditoActualizado = await credito.save();

    return res.status(200).json({
        success: true,
        message: 'Crédito actualizado exitosamente.',
        data: creditoActualizado
    });

});

// GET: /api/v1/cliente/:idCliente/credito/ → Obtiene una lista de créditos de un cliente en específico
exports.obtenerCreditos = catchAsyncErrors(async (req, res, next) => {

    // Verificar que el cliente existe o no esté eliminado
    const cliente = await Cliente.findById(req.params.idCliente);

    if (!cliente || cliente.eliminado) {
        return next(new ErrorHandler("No se encontró el cliente en la base de datos.", 404));
    };

    const apiFilters = new APIFilters(Credito.find({
        cliente: req.params.idCliente,
        eliminado: false,
    }), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();

    const creditos = await apiFilters.query;

    return res.status(200).json({
        success: true,
        results: creditos.length,
        data: creditos
    });
});

// GET: /api/v1/cliente/:idCliente/credito/:idCredito → Obtiene información de un crédito en específico
exports.obtenerCredito = catchAsyncErrors(async (req, res, next) => {

    // Verificar que el cliente existe o no esté eliminado
    const cliente = await Cliente.findById(req.params.idCliente);
    if (!cliente || cliente.eliminado) {
        return next(new ErrorHandler("No se encontró el cliente en la base de datos.", 404));
    };

    const credito = await Credito.findOne({ _id: req.params.idCredito, cliente: req.params.idCliente });
    if (!credito || credito.eliminado) {
        return next(new ErrorHandler("No se encontró el crédito en la base de datos.", 404));
    };

    return res.status(200).json({
        success: true,
        data: credito
    });
});

// DELETE: /api/v1/cliente/:idCliente/credito/:idCredito → Borra un crédito
exports.eliminarCredito = catchAsyncErrors(async (req, res, next) => {

    // Verificar que el cliente existe o no esté eliminado
    const cliente = await Cliente.findById(req.params.idCliente);
    if (!cliente || cliente.eliminado) {
        return next(new ErrorHandler("No se encontró el cliente en la base de datos.", 404));
    };

    // Verificar que el crédito existe o no esté eliminado
    let credito = await Credito.findOne({ _id: req.params.idCredito, cliente: req.params.idCliente });
    if (!credito || credito.eliminado) {
        return next(new ErrorHandler("No se encontró el crédito en la base de datos.", 404));
    };

    // No se pueden borrar créditos previamente aprobados. No afecta para borrar cliente
    if (credito.estatus !== 'en proceso') {
        return next(new ErrorHandler("Sólamente se pueden borrar créditos que no se hayan aprobado previamente.", 400));
    };

    await Cliente.findOneAndUpdate({ _id: req.params.idCredito, cliente: req.params.idCliente },
        { eliminado: true },
        { new: true }
    );

    return res.status(200).json({
        success: true,
        message: 'Crédito eliminado exitosamente.',
    });
});
