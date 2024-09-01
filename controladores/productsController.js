const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

exports.createProduct = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, estado } = req.body;
        await sequelize.query(
            'EXEC sp_ExistenciaProductos @nombre=:nombre, @descripcion=:descripcion, @precio=:precio, @stock=:stock, @estado=:estado', 
            {
                replacements: { nombre, descripcion, precio, stock, estado },
            }
        );
        res.status(201).json({ message: 'Producto creado existosamente' });
    } catch (error) {
        console.error('Error creating product:', error); 
        res.status(500).json({ error: error.message });
    }
};
// Para busqueda del listado de productos
exports.getProducts = async (req, res) => {
    try {
        const products = await sequelize.query('SELECT * FROM Productos', { type: sequelize.QueryTypes.SELECT });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Para busqueda de producto especifico
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await sequelize.query('SELECT * FROM Productos WHERE id_producto = :id', {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
        });

        if (product.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(product[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, estado } = req.body;

        await sequelize.query(
            'UPDATE Productos SET nombre = :nombre, descripcion = :descripcion, precio = :precio, stock = :stock, estado = :estado WHERE id_producto = :id',
            {
                replacements: { id, nombre, descripcion, precio, stock, estado },
            }
        );

        res.status(200).json({ message: 'Producto actualizado existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await sequelize.query('DELETE FROM Productos WHERE id_producto = :id', {
            replacements: { id },
        });

        res.status(200).json({ message: 'Producto eliminado existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProductStock = async (req, res) => {
    try {
        const { id_producto, cantidad } = req.body;

        // Reducir el stock del producto
        const product = await sequelize.query(
            'UPDATE Productos SET stock = stock - :cantidad WHERE id_producto = :id_producto AND stock >= :cantidad',
            {
                replacements: { id_producto, cantidad },
            }
        );

        if (product[0].affectedRows === 0) {
            return res.status(400).json({ message: 'No hay suficiente stock para este producto.' });
        }

        // Verificar si el stock llegó a 0 y actualizar el estado a 'inactivo'
        await sequelize.query(
            'UPDATE Productos SET estado = \'inactivo\' WHERE id_producto = :id_producto AND stock = 0',
            {
                replacements: { id_producto },
            }
        );

        res.status(200).json({ message: 'Stock actualizado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

