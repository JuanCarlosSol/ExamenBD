var mongoose = require('mongoose');
var Producto = require("../models/Producto");

var ProductoController = {};

ProductoController.list = function(req, res){

    Producto.find({}).exec(function(err, productos){
        if (err) { console.log('Error: ',err); return;}
        console.log("The Index");
        res.render('../views/producto/index', {productos: productos, titulo: 'Index'});
    });
};

ProductoController.show = function(req, res){

    Producto.findOne({_id: req.params.id}).exec(function(err, producto){
        if(err){console.log('Error: ',err); return;}
        res.render('../views/producto/show', {producto: producto});
    });
};

ProductoController.create = function(req, res){
    res.render('../views/producto/create');
};

ProductoController.save = function(req, res) {
    var producto = new Producto(req.body);
    producto.save(function(err){
        if(err){console.log('Error: ', err); return;}
        console.log("Succesfully created an product");
        res.redirect("/productos/show/" + producto._id);
    });
};

ProductoController.edit = function(req, res){
    Producto.findOne({_id: req.params.id}).exec(function(err, producto){
        if(err){console.log("Error: ", err); return;}
        res.render("../views/producto/edit", {producto: producto});
    });
};


ProductoController.update = function(req, res){
    Producto.findByIdAndUpdate(req.params.id, {$set: {
        codigo: req.body.codigo,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        stock: req.body.stock,
        categoria: req.body.categoria,
        marca: req.body.marca,
        modelo: req.body.modelo,
    }}, {new: true},
    function(err, producto){
        if(err){
            console.log("Error: ", err);
            res.render('../views/usuario/edit', {producto:producto});
        }
        console.log(producto);
        res.redirect('/productos/show/' + producto._id);
    });
};

ProductoController.delete = function(req, res){
    Producto.remove({_id: req.params.id}, function(err){
        if(err){console.log("Error: ", err); return;}
        console.log("Product Deleted");
        res.redirect("/productos");
    });
};

module.exports = ProductoController;

