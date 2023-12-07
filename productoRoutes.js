const express = require('express');
const multer = require('multer');
const Producto = require('./models/producto'); // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './imagenes'); // Aquí se guardarán las imágenes
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Ruta para agregar un producto
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const producto = new Producto({
            nombreproducto: req.body.nombreproducto,
            categoria: req.body.categoria,
            detalle: req.body.detalle,
            autor: req.body.autor,
            editorial: req.body.editorial,
            imagen: req.file ? req.file.path : null // Guarda la ruta si hay un archivo, o null si no hay archivo
        });

        await producto.save();
        res.status(201).send(producto);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;