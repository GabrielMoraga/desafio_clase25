class ContenedorMongoDB {
    constructor(model) {
        this.model = model;
    }

    //Create
    async guardar(obj) {
        try {
            const newObj = {timestamp: Date.now(), ...obj }
            const saveModel = new this.model(newObj)
            const objectSaved = await saveModel.save()
            return objectSaved
        } catch (error) {
            return error
        }
    }

    //Read
    async listar(username) {
        try {
            const objs = await this.model.findOne({username})
            return objs
        } catch (error) {
            return error
        }
    }

    //Read
    async listarAll() {
        try {
            const objs = await this.model.find({})
            return objs
        } catch (error) {
            return error
        }
    }


    //Update
    async actualizar(obj) {
        console.log(obj)
        try {
            const objs = await this.model.updateOne({id: obj.id}, obj)
            return objs
        } catch (error) {
            return error
        }
    }


    //Delete
    async delete(id) {
        try {
            const objs = await this.model.deleteOne({id: id})
            return objs
        } catch (error) {
            return error
        }
    }
}

module.exports = ContenedorMongoDB