const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

exports.createOrder = async (req, res) => {
    try {
        const { id_usuario, total } = req.body;

        await sequelize.query('EXEC sp_ConfirmarPedido @id_usuario=:id_usuario, @total=:total', {
            replacements: { id_usuario, total },
        });

        res.status(201).json({ message: 'Pedido confirmado existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getOrders = async (req, res) => {
    try {
        const orders = await sequelize.query('SELECT * FROM pedidos', { type: sequelize.QueryTypes.SELECT });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await sequelize.query('SELECT * FROM pedidos WHERE id_pedido = :id', {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
        });

        if (order.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json(order[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_usuario, total, estado } = req.body;

        await sequelize.query(
            'UPDATE pedidos SET id_usuario = :id_usuario, total = :total, estado = :estado WHERE id_pedido = :id',
            {
                replacements: { id, id_usuario, total, estado },
            }
        );

        res.status(200).json({ message: 'Pedido actualizado existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        await sequelize.query('DELETE FROM pedidos WHERE id_pedido = :id', {
            replacements: { id },
        });

        res.status(200).json({ message: 'Pedido eliminado existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

