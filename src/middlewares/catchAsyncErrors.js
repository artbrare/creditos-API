// middleware que se encarga de capturar errores en funciones asíncronas.

module.exports = func => (req, res, next) => 
    Promise.resolve(func(req, res, next))
        .catch(next);