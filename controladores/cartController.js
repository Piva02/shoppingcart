const sequelize = require('../config/database');

exports.addToCart = async (req, res) => {
    try {
        const { id_usuario, id_producto, cantidad } = req.body;

        // Agregar producto al carrito
        await sequelize.query(
            'INSERT INTO cart_detail (id_cart, id_producto, cantidad) VALUES ((SELECT id_cart FROM cart WHERE id_usuario = :id_usuario AND estado = \'activo\'), :id_producto, :cantidad)',
            {
                replacements: { id_usuario, id_producto, cantidad },
            }
        );

        res.status(201).json({ message: 'Producto agregado al carrito exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { id_usuario, id_producto } = req.body;

        // Eliminar producto del carrito
        await sequelize.query(
            'DELETE FROM cart_detail WHERE id_cart = (SELECT id_cart FROM cart WHERE id_usuario = :id_usuario AND estado = \'activo\') AND id_producto = :id_producto',
            {
                replacements: { id_usuario, id_producto },
            }
        );

        res.status(200).json({ message: 'Producto eliminado del carrito exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.confirmCart = async (req, res) => {
    try {
        const { id_usuario } = req.body;

        // Obtener el id_cart del usuario
        const [cart] = await sequelize.query('SELECT id_cart FROM cart WHERE id_usuario = :id_usuario AND estado = \'activo\'', {
            replacements: { id_usuario },
            type: sequelize.QueryTypes.SELECT,
        });

        if (!cart) {
            return res.status(404).json({ error: 'No se encontró un carrito activo para este usuario.' });
        }

        const { id_cart } = cart;

        // Ejecutar el procedimiento almacenado para confirmar el pedido
        await sequelize.query('EXEC sp_ConfirmarPedido @id_usuario=:id_usuario', {
            replacements: { id_usuario }
        });

        res.status(200).json({ message: 'Pedido confirmado exitosamente. Nuevo carrito creado.' });
    } catch (error) {
        console.error('Error confirmando el pedido:', error);
        res.status(500).json({ error: error.message || 'Error desconocido' });
    }
};
