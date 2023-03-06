const Cliente = require('../models/clientes');
const Creditos = require('../models/creditos');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFilters = require('../utils/apiFilters');


// POST: /api/v1/cliente/ → Crea un cliente
exports.crearCliente = catchAsyncErrors(async (req, res, next) => {
    
    // Validar el cuerpo de la solicitud
    if (req.body.eliminado) {
        return next(new ErrorHandler("No se permite establecer 'eliminado' en la solicitud.", 400));
    }

    // Se crea un nuevo cliente en la base de datos
    const cliente = await Cliente.create(req.body);

    return res.status(200).json({
        success: true,
        message: 'Cliente creado exitosamente.',
        data: cliente
    });
});

// PUT: /api/v1/cliente/:idCliente → Actualiza información de un cliente existente
exports.actualizarCliente = catchAsyncErrors(async (req, res, next) => {

    // Validar el cuerpo de la solicitud
    if (req.body.eliminado) {
        return next(new ErrorHandler("No se permite establecer 'eliminado' en la solicitud.", 400));
    };

    let cliente = await Cliente.findById(req.params.idCliente);

    if (!cliente || cliente.eliminado) {
        return next(new ErrorHandler("No se encontró el cliente en la base de datos.", 404));
    };

    cliente = await Cliente.findByIdAndUpdate(req.params.idCliente, req.body, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        success: true,
        message: 'Cliente actualizado exitosamente.',
        data: cliente
    });
});

// GET: /api/v1/cliente/ → Obtiene una lista de clientes
exports.obtenerClientes = catchAsyncErrors(async (req, res, next) => {

    const apiFilters = new APIFilters(Cliente.find({ eliminado: false }), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();
    const clientes = await apiFilters.query // Encuentra a los clientes no eliminados

    return res.status(200).json({
        success: true,
        results: clientes.length,
        data: clientes
    });
});

// GET: /api/v1/cliente/:idCliente → Obtiene información de un solo cliente
exports.obtenerCliente = catchAsyncErrors(async (req, res, next) => {

    // Verificar que el cliente existe o no esté eliminado
    const cliente = await Cliente.findById(req.params.idCliente);
    if (!cliente || cliente.eliminado) {
        return next(new ErrorHandler("No se encontró el cliente en la base de datos.", 404));
    };

    return res.status(200).json({
        success: true,
        data: cliente
    });
});

// DELETE: /api/v1/cliente/:idCliente→ Borra un cliente
exports.eliminarCliente = catchAsyncErrors(async (req, res, next) => {

    // Verificar que el cliente existe o no esté eliminado
    const cliente = await Cliente.findById(req.params.idCliente);
    if (!cliente || cliente.eliminado) {
        return next(new ErrorHandler("No se encontró el cliente en la base de datos.", 404));
    };
    
    // Si el cliente tiene créditos activos no se puede borrar. Se solicitará que se cancelen primero sus créditos.
    const creditosActivo = await Creditos.findOne({
        cliente: req.params.idCliente,
        estatus: 'activo'
    });

    if (creditosActivo) {
        return next(new ErrorHandler("No se puede eliminar clientes con créditos activos. Favor de cambiar el estatus de sus créditos", 400));
    };

    await Cliente.findByIdAndUpdate(req.params.idCliente, { eliminado: true });

    return res.status(200).json({
        success: true,
        message: 'Cliente eliminado exitosamente.',
    });
});
