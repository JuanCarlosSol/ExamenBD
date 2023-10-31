var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = new Schema({
    codigo: {type: Number, required: true},
    descripcion: {type: String, required: true, max: 500},
    precio: {type: Number, required: true},
    stock: {type: Number, required: true},
    categoria: {type: String, required: true, max: 100},
    marca: {type: String, required: true, max: 100},
    modelo: {type: String, required: true, max: 100},
});

module.exports = mongoose.model('Producto', ProductoSchema);