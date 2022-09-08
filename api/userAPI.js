// Configuración de las conexiones a dbs
const ContenedorMongoDB = require('../contenedores/ContenedorMongoDB')
const modeloUser = require('./modelo/User')

const User = new ContenedorMongoDB(modeloUser)

console.log(User)

module.exports = User