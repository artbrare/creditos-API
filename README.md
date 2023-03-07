
# Créditos API

La API Créditos es una aplicación RESTful construida con Node.js, Express y MongoDB para un sistema de créditos personales. Esta API permite la creación, actualización, obtención y eliminación de clientes y créditos. Se consideró lo siguiente:

* El alta de clientes se considera como un registro rápido. En su alta no se solicitan archivos multimedia como copia de su identificación oficial, curp, u otros documentos que podrían ser solicitados por una institución financiera.
* Para los créditos se considera que el alta de un crédito simplemente se hace como una solicitud de crédito. Es decir, se deja como un ejercicio posterior la aprobación del crédito, así como pagos del crédito, tablas de amortización, etc.

1. [Instalación](#instalación)
1. [Esquemas utilizados](#esquemas-utilizados)
    * [Clientes](#esquemaClientes)
    * [Creditos](#esquemaCreditos)
1. [Endpoints de la API](#serviciosAPI)
    * [Clientes](#clientes)
        1. [Crear un cliente](#1-crear-un-cliente)
        1. [Actualizar un cliente](#2-actualizar-un-cliente)
        1. [Obtener todos los clientes](#3-obtener-todos-los-clientes)
        1. [Obtener un cliente](#4-obtener-un-cliente)
        1. [Eliminar un cliente](#5-eliminar-un-cliente)
    * [Créditos](#crditos)
        1. [Crear un crédito](#1-crear-un-crdito)
        1. [Actualizar un crédito](#2-actualizar-un-crdito)
        1. [Obtener todos los créditos de un cliente](#3-obtener-todos-los-crditos-de-un-cliente)
        1. [Obtener un crédito de un cliente](#4-obtener-un-crdito-de-un-cliente)
        1. [Eliminar un crédito](#5-eliminar-un-crdito)
1. [Filtros API](#filtros-api)
1. [Trabajo posterior](#trabajoPosterior)

--------
## Instalación
### Requisitos previos
Para poder instalar Creditos API, necesitas tener instalado lo siguiente:
- Node.js
- npm
- MongoDB

### Instrucciones
Clona este repositorio en tu maquina local:
```
git clone https://github.com/artbrare/creditos-API
```
Instala las dependencias necesarias:
```
npm install
```
Crea un archivo `.env` en la carpeta `config` con las variables de entorno necesarias:
```bash
PORT = 3000
NODE_ENV = development // En caso de querer trabajar en entorno de desarrollo.
DB_LOCAL_URI = mongodb://0.0.0.0:27017/nombre_de_tu_base_de_datos
```
Inicia el servidor:
```
npm start
```

Una vez que hayas completado estos pasos, podrás utilizar el proyecto en tu máquina local en la dirección `http://localhost:PORT`.

Nota: al abrir `http://localhost:PORT` en tu navegador se desplegará la documentación de los endpoints de la API.

## Esquemas utilizados
### Clientes

| Atributo               | Requerido | Descripción |
|------------------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------|
| nombre                 | Sí        | Nombre del cliente. Máximo 50 caracteres.                                                                                             |
| apellidos              | Sí        | Apellidos del cliente. Máximo 100 caracteres.                                                                                         |
| email                  | Sí        | Correo electrónico del cliente. Único y validado mediante una expresión regular. Máximo 256 caracteres.                               |
| fechaNacimiento        | Sí        | Fecha de nacimiento del cliente.                                                                                                      |
| rfc                    | Sí        | Registro Federal de Contribuyentes del cliente. Único y validado mediante una expresión regular. Máximo 13 caracteres.                |
| curp                   | Sí        | Clave Única de Registro de Población del cliente. Único y validado mediante una expresión regular. Máximo 18 caracteres.              |
| genero                 | No        | Género del cliente. Valores permitidos: Masculino, Femenino, No binario, Prefiero no decir.                                           |
| estadoCivil            | No        | Estado civil del cliente. Valores permitidos: Soltero/a, Casado/a, Divorciado/a, Viudo/a, Unión libre, Separado/a, Prefiero no decir. |
| direccion.calle        | No        | Calle de la dirección del cliente.                                                                                                    |
| direccion.colonia      | No        | Colonia de la dirección del cliente.                                                                                                  |
| direccion.ciudad       | No        | Ciudad de la dirección del cliente.                                                                                                   |
| direccion.estado       | No        | Estado de la dirección del cliente.                                                                                                   |
| direccion.codigoPostal | No        | Código postal de la dirección del cliente.                                                                                            |
| montoSolicitado        | Sí        | Monto de crédito solicitado por el cliente.                                                                                           |
| ingresosMensuales      | Sí        | Ingresos mensuales del cliente. Si no tiene ingresos actualmente.                                                                     |
| eliminado              | Sí        | Indica si el cliente ha sido eliminado del sistema. Valor por defecto: false.                                                         |
| fechaCreacion          | Sí        | Fecha de creación del registro del cliente. Inmutable.                                                                                |
### Créditos
| Atributo        | Requerido | Descripción                                                                                                                                             |
|-----------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| cliente         | Sí        | El identificador del cliente asociado con este crédito.                                                                                                 |
| monto           | Sí        | El monto del crédito solicitado.                                                                                                                        |
| tasaInteres     | Sí        | La tasa de interés anual aplicada al crédito, expresada como un número entre 0 y 1.                                                                     |
| plazo           | Sí        | El plazo del crédito en meses.                                                                                                                          |
| estatus         | No        | El estado actual del crédito. Puede ser "en proceso", "activo", "deuda pendiente", "liquidado", "cancelado" o "rechazado". Por defecto es "en proceso". |                                                                                            |
| fechaAprobacion | No        | La fecha en que se aprobó el crédito y comenzó a ejecutarse.                                                                                            |
| motivoRechazo   | No        | Si el crédito fue rechazado, esta es la razón proporcionada.                                                                                            |
| eliminado       | Sí        | Indica si el crédito ha sido eliminado del sistema. Por defecto es false.                                                                                           |
| fechaCreacion   | Sí        | Fecha de creación del registro del crédito. Inmutable.         

## Endpoints de la API
### Clientes

Todas las solicitudes que tienen que ver con los clientes. Estas son: crear un cliente, actualizar un cliente, obtener una lista de clientes, obtener un cliente y eliminar un cliente.

#### 1. Crear un cliente

Crea y agrega a la base de datos un cliente nuevo.

***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{DOMAIN}}/api/v1/cliente
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "nombre": "Cecilia",
    "apellidos": "Martínez González",
    "email": "cecilia.martinez@example.com",
    "fechaNacimiento": "1990-05-10",
    "rfc": "MAGC900510KJ8",
    "curp": "MAGC900510MDFNZL08",
    "genero": "Femenino",
    "estadoCivil": "Soltero/a",
    "direccion": {
    "calle": "Calle de la rosa",
    "colonia": "Villa de las flores",
    "ciudad": "Tijuana",
    "estado": "Baja California",
    "codigoPostal": "22010"
    },
    "montoSolicitado": 250000,
    "ingresosMensuales": 30000
}


```



#### 2. Actualizar un cliente


Se actualiza la información de un cliente en la base de datos.

Por medio de parámetros se puede filtrar, ordenar la busqueda. Además, se permite definir qué atributos recibir en la respuesta.

Se cuenta con la funcionalidad de pagination.


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{DOMAIN}}/api/v1/cliente/6406585a0d27cabc88f63448
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "nombre": "Cecilia Alejandra"
}
```



#### 3. Obtener todos los clientes


Obtener todos los clientes de la base de datos.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/cliente/sort
```



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
|  |  |  |



#### 4. Obtener un cliente


Se obtiene la información de un cliente dado su ID.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/cliente/6406585a0d27cabc88f63448
```



#### 5. Eliminar un cliente


Se elimina un cliente de la base de datos dado su ID.


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{DOMAIN}}/api/v1/cliente/6404d2cd0902dd89d5c437f3
```



### Créditos

Todas las solicitudes que tienen que ver con los créditos de un cliente. Estas son: crear un crédito, actualizar un crédito, obtener una lista de créditos, obtener un crédito y eliminar un crédito.



#### 1. Crear un crédito


Dado el ID del cliente, se crea un crédito en estatus "en proceso" el cual define un crédito pre aprobado. 


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{DOMAIN}}/api/v1/cliente/640657f80d27cabc88f63440/credito
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
  "monto": 35000,
  "tasaInteres": 0.15,
  "plazo": 6
}
```



#### 2. Actualizar un crédito


Dado el ID del cliente y el ID del crédito, se actualiza la información de un crédito.

Por medio de parámetros se puede filtrar, ordenar la busqueda. Además, se permite definir qué atributos recibir en la respuesta.

Se cuenta con la funcionalidad de pagination.


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{DOMAIN}}/api/v1/cliente/640657f80d27cabc88f63440/credito/640659e30d27cabc88f6345b
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "estatus": "rechazado"
}
```



#### 3. Obtener todos los créditos de un cliente


Dado el ID del cliente, se obtienen todos sus créditos.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/cliente/640657f80d27cabc88f63440/credito/
```



#### 4. Obtener un crédito de un cliente


Dado el ID del cliente y el ID del crédito, se obtiene la información del crédito.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/cliente/640657f80d27cabc88f63440/credito/640659ed0d27cabc88f6345e
```



#### 5. Eliminar un crédito


Dado el ID del cliente y el ID del crédito, se elimina el crédito. Sólamente se pueden eliminar créditos pre aprobados o en su defecto, con estatus "en proceso"


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{DOMAIN}}/api/v1/cliente/640659ed0d27cabc88f6345e/credito/640659d20d27cabc88f63458
```



---
[Regresar](#creditos-api)
