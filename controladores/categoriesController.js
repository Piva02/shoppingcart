const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

exports.createCategory = async (req, res) => {
    try {
        const { nombre } = req.body;

        await sequelize.query('INSERT INTO c_roles (nombre_rol) VALUES (:nombre)', {
            replacements: { nombre },
        });

        res.status(201).json({ message: 'Categoría creada existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await sequelize.query('SELECT * FROM c_roles', { type: sequelize.QueryTypes.SELECT });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await sequelize.query('SELECT * FROM c_roles WHERE id_rol = :id', {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
        });

        if (category.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.status(200).json(category[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        await sequelize.query('UPDATE c_roles SET nombre_rol = :nombre WHERE id_rol = :id', {
            replacements: { id, nombre },
        });

        res.status(200).json({ message: 'Categoría actualizada existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        await sequelize.query('DELETE FROM c_roles WHERE id_rol = :id', {
            replacements: { id },
        });

        res.status(200).json({ message: 'Categoría eliminada existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

