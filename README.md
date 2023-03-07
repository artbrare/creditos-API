
# Créditos API

La API Créditos es una aplicación RESTful construida con Node.js, Express y MongoDB para un sistema de créditos personales. Esta API permite la creación, actualización, obtención y eliminación de clientes y créditos. Se considera lo siguiente:

* El alta de clientes se considera como un registro rápido. En su alta no se solicitan archivos multimedia como copia de su identificación oficial, CURP, u otros documentos que podrían ser solicitados por una institución financiera.
* Para los créditos se considera que el alta de un crédito simplemente se hace como una solicitud de crédito. Es decir, se deja como un ejercicio posterior la aprobación del crédito, así como pagos del crédito, tablas de amortización, etc.

1. [Instalación](#instalación)
2. [Esquemas utilizados](#esquemas-utilizados)
    - [Esquema de clientes](#esquema-de-clientes)
    - [Esquema de créditos](#esquema-de-créditos)
3. [Endpoints de la API](#endpoints-de-la-api)
    - [Clientes](#clientes)
        - [Crear un cliente](#crear-un-cliente)
        - [Actualizar un cliente](#actualizar-un-cliente)
        - [Obtener todos los clientes](#obtener-todos-los-clientes)
        - [Obtener un cliente](#obtener-un-cliente)
        - [Eliminar un cliente](#eliminar-un-cliente)
    - [Créditos](#créditos)
        - [Crear un crédito](#crear-un-crédito)
        - [Actualizar un crédito](#actualizar-un-crédito)
        - [Obtener todos los créditos de un cliente](#obtener-todos-los-créditos-de-un-cliente)
        - [Obtener un crédito de un cliente](#obtener-un-crédito-de-un-cliente)
        - [Eliminar un crédito](#eliminar-un-crédito)
4. [Filtros API](#filtros-api)
5. [Trabajo posterior](#trabajo-posterior)

--------
## Instalación
### Requisitos previos
Para que puedas Créditos API, necesitas tener instalado lo siguiente:
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
### Esquema de clientes

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
| ingresosMensuales      | Sí        | Ingresos mensuales del cliente.                                                                     |
| eliminado              | Sí        | Indica si el cliente ha sido eliminado del sistema. Valor por defecto: false.                                                         |
| fechaCreacion          | Sí        | Fecha de creación del registro del cliente. Inmutable.                                                                                |
### Esquema de créditos
| Atributo        | Requerido | Descripción                                                                                                                                             |
|-----------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| cliente         | Sí        | Identificador del cliente asociado con este crédito.                                                                                                 |
| monto           | Sí        | Monto del crédito solicitado.                                                                                                                        |
| tasaInteres     | Sí        | Tasa de interés anual aplicada al crédito, expresada como un número entre 0 y 1.                                                                     |
| plazo           | Sí        | Plazo del crédito en meses.                                                                                                                          |
| estatus         | No        | Estado actual del crédito. Puede ser "en proceso", "activo", "deuda pendiente", "liquidado", "cancelado" o "rechazado". Por defecto es "en proceso". |                                                                                            |
| fechaAprobacion | No        | Fecha en que se aprobó el crédito y comenzó a ejecutarse.                                                                                            |
| motivoRechazo   | No        | Si el crédito fue rechazado, esta es la razón proporcionada.                                                                                            |
| eliminado       | Sí        | Indica si el crédito ha sido eliminado del sistema. Por defecto es false.                                                                                           |
| fechaCreacion   | Sí        | Fecha de creación del registro del crédito. Inmutable.         

## Endpoints de la API
### Clientes

Todas las solicitudes que tienen que ver con los clientes. Estas son: crear un cliente, actualizar un cliente, obtener una lista de clientes, obtener un cliente y eliminar un cliente.

#### Crear un cliente

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



#### Actualizar un cliente

Se actualiza la información de un cliente en la base de datos. Por medio de parámetros se puede filtrar y ordenar la busqueda. Además, se permite definir qué atributos recibir en la respuesta.

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



#### Obtener todos los clientes


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



#### Obtener un cliente


Se obtiene la información de un cliente dado su ID.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/cliente/6406585a0d27cabc88f63448
```



#### Eliminar un cliente


Se elimina un cliente de la base de datos dado su ID.


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{DOMAIN}}/api/v1/cliente/6404d2cd0902dd89d5c437f3
```



### Créditos

Todas las solicitudes que tienen que ver con los créditos de un cliente. Estas son: crear un crédito, actualizar un crédito, obtener una lista de créditos, obtener un crédito y eliminar un crédito.



#### Crear un crédito


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



#### Actualizar un crédito


Dado el ID del cliente y el ID del crédito, se actualiza la información de un crédito. Por medio de parámetros se puede filtrar y ordenar la busqueda. Además, se permite definir qué atributos recibir en la respuesta.

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



#### Obtener todos los créditos de un cliente


Dado el ID del cliente, se obtienen todos sus créditos.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/cliente/640657f80d27cabc88f63440/credito/
```



#### Obtener un crédito de un cliente


Dado el ID del cliente y el ID del crédito, se obtiene la información del crédito.


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{DOMAIN}}/api/v1/cliente/640657f80d27cabc88f63440/credito/640659ed0d27cabc88f6345e
```



#### Eliminar un crédito


Dado el ID del cliente y el ID del crédito, se elimina el crédito. S0lamente se pueden eliminar créditos pre aprobados o en su defecto, con estatus "en proceso".


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{DOMAIN}}/api/v1/cliente/640659ed0d27cabc88f6345e/credito/640659d20d27cabc88f63458
```

## Filtros API

### filter()

Este método filtra los resultados de una consulta de MongoDB con base en una serie de parámetros recibidos en la URL. Primero hace una copia de la cadena de consulta, elimina los campos que no se necesitan y luego convierte los operadores de comparación en sintaxis de MongoDB. Finalmente, realiza la consulta utilizando los parámetros especificados y devuelve los resultados filtrados.

Por ejemplo, la siguiente consulta regresa los clientes con género femenino y con ingresos mensuales mayores a $40,000.00.

```
{{DOMAIN}}/api/v1/cliente/?ingresosMensuales[gt]=40000&genero=Femenino
```

### sort()
Este método ordena los resultados de la consulta de acuerdo con los parámetros especificados en la URL. Si no se especifican campos de ordenamiento en la URL, ordena los resultados por fecha de creación en orden descendente.

Por ejemplo, la siguiente consulta regresa los clientes ordenados por ingresos mensuales de forma ascendente 
```
{{DOMAIN}}/api/v1/cliente/?sort=ingresosMensuales
```

### limitFields()

Este método limita los campos que se devuelven en los resultados de la consulta de acuerdo con los parámetros especificados en la URL. Si se especifican campos en la URL, se devuelven solo esos campos. De lo contrario, se devuelven todos los campos excepto el campo __v.

Por ejemplo, la siguiente consulta regresa una lista de clientes con los campos de nombre, apellidos e ingresos mensuales exclusivamente.

```
{{DOMAIN}}/api/v1/cliente/?fields=nombre,apellidos,ingresosMensuales
```

### pagination() 

Este método divide los resultados de la consulta en páginas y devuelve los resultados para una página específica de acuerdo con los parámetros especificados en la URL. Por defecto, se devuelve la primera página y se limita el número de resultados a 25 objetos por consulta. El número de página y el límite de resultados se especifican en la URL.

## Trabajo posterior

- Agregar **pruebas unitarias**: Es importante realizar pruebas unitarias exhaustivas para garantizar la calidad del código y detectar posibles errores. 

- Agregar **autenticación de usuarios**: Para garantizar la seguridad del sistema y proteger la información de los clientes y sus créditos.

- Considerar el agregar **archivos multimedia** como imágenes escaneadas de identificación oficial u otros documentos.

- Para mejorar la gestión de los créditos y facilitar su seguimiento, se puede agregar funcionalidad de **pagos y tablas de amortización**. De esta manera, los clientes podrán realizar pagos de manera más eficiente y se podrá hacer un seguimiento más detallado del estado de los créditos.

- Implementar un **sistema de notificaciones**: Para mantener a los clientes actualizados y brindar un mejor servicio, se puede considerar la implementación de un sistema de notificaciones. De esta manera, se puede enviar información relevante sobre los créditos, como fechas de pago, actualizaciones de estatus, entre otros.

- Agregar funcionalidad de **reportes y estadísticas**: De esta manera, se pueden obtener *insights* valiosos sobre el comportamiento de los créditos y los clientes.

---
[Regresar](#créditos-api)
