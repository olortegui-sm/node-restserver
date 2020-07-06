const express = require('express');
const fileUpload = require('express-fileupload');
const { verificaToken } = require('../middlewares/autentication');
const fs = require('fs');
const app = express();
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());


app.put('/upload/:tipo/:id', verificaToken, function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: true,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son: ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let archivoExtension = archivo.name.split('.');
    let extension = archivoExtension[archivoExtension.length - 1];

    // extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', ')
            }
        });
    }

    //cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuarios')
            imagenUsuario(id, res, nombreArchivo);
        else
            imagenProducto(id, res, nombreArchivo);

    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            removeFile(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            removeFile(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        removeFile(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            removeFile(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            removeFile(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        removeFile(productoBD.img, 'productos');

        productoBD.img = nombreArchivo;
        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });

    });
}

function removeFile(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;