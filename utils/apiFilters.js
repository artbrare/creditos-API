/* 
Este archivo contiene una clase llamada APIFilters que es utilizada para
filtrar y ordenar los resultados de las consultas a una API.

La clase tiene los siguientes métodos:

    filter(): Filtra los resultados de la consulta eliminando los campos
    que no se necesitan, además convierte los operadores gt, gte, lt, lte y
    in en operadores equivalentes de MongoDB.

    sort(): Ordena los resultados de la consulta según los campos especificados
    en el query string. Si no se especifica ningún campo, se ordena por fecha
    de creación en orden descendente.

    limitFields(): Selecciona los campos que se deben devolver en los resultados
    de la consulta según los campos especificados en el query string. Si no se
    especifica ningún campo, se devuelven todos excepto el campo '__v'.

    pagination(): Devuelve los resultados de la consulta según el número de
    página y el límite de resultados especificados en el query string. Si no se
    especifica ningún valor, se utilizan los valores por defecto (página 1,
    límite de 25 resultados).
*/

class APIFilters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    };

    filter() {

        const queryCopy = {...this.queryStr}

        // Se eliminan los campos que no se necesitan de la consulta
        const removeFields = ['sort', 'fields', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el])

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };

    sort() {
        // Ordena los resultados según los campos especificados en el query string
        if(this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-fechaCreacion');
        }

        return this;
    };

    limitFields() {
        if(this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    };

    pagination() {
        // Devuelve los resultados de la consulta según el número de página y el límite de resultados especificados.
        // Por default se considera que se solicita la primera página y el límite es de 25 objetos por consulta.
        const page = parseInt(this.queryStr.page, 10) || 1;
        const limit = parseInt(this.queryStr.limit, 10) || 25;
        const skipResults = (page - 1) * limit;

        this.query = this.query.skip(skipResults).limit(limit);

        return this;
    }
};

module.exports = APIFilters;