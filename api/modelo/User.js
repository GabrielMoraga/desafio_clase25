// Configuración de las conexiones a dbs
const mongoose = require('mongoose');

const MONGO_ATLAS_URL="mongodb+srv://gmoraga:0i9X9EXC@cluster0.jiqqhtj.mongodb.net/?retryWrites=true&w=majority"
/

mongoose.connect("mongodb+srv://gmoraga:0i9X9EXC@cluster0.jiqqhtj.mongodb.net/?retryWrites=true&w=majority")


const userSchema= new mongoose.Schema(
    {
        id: Number,
        timestamp: Date,
        username: {type: String, require: true, max: 100},
        password: {type: String, require: true, max: 100}
    });

const modeloUser = mongoose.model('User',userSchema);


module.exports = modeloUser