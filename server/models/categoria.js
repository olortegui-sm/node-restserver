const mongoose = require('mongoose');
//const uniqueValidation = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

//categoriaSchema.plugin(uniqueValidation, { message: '{PATH} debe de ser única' })

module.exports = mongoose.model('Categoria', categoriaSchema);