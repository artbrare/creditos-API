// Crea una clase ErrorHandler que extiende la clase Error
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandler;