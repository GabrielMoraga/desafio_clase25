// Configuración de las conexiones a dbs
const mongoose = require('mongoose');
require('dotenv').config()
const uri = process.env.MONGO_ATLAS_URL

console.log(uri)
mongoose.connect(uri)


const userSchema= new mongoose.Schema(
    {
        id: Number,
        timestamp: Date,
        username: {type: String, require: true, max: 100},
        password: {type: String, require: true, max: 100}
    });

const modeloUser = mongoose.model('User',userSchema);


module.exports = modeloUser