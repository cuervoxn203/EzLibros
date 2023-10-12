const { Client } = require('pg') //Obtener la clase cliente

const client = new Client({ //Configurar la conexion
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

client.connect(function (err) {
    if (err) {
        console.error('Error de conexión:', err)
        throw err
    } else {
        console.log("Conexion exitosa")
    }
})

module.exports = client //Exportar la conexion
