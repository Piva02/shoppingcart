const sequelize = require('../config/database');

// Crear un nuevo estado
exports.createEstado = async (req, res) => {
    try {
        const { nombre_estado } = req.body;
        await sequelize.query('EXEC sp_InsertEstado @nombre_estado=:nombre_estado', {
            replacements: { nombre_estado },
        });
        res.status(201).json({ message: 'Estado creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los estados
exports.getEstados = async (req, res) => {
    try {
        const estados = await sequelize.query('SELECT * FROM Estados', { type: sequelize.QueryTypes.SELECT });
        res.status(200).json(estados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un estado por ID
exports.getEstadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = await sequelize.query('SELECT * FROM Estados WHERE id_estado = :id', {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
        });

        if (estado.length === 0) {
            return res.status(404).json({ message: 'Estado no encontrado' });
        }

        res.status(200).json(estado[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un estado
exports.updateEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_estado } = req.body;

        await sequelize.query(
            'UPDATE Estados SET nombre_estado = :nombre_estado WHERE id_estado = :id',
            {
                replacements: { id, nombre_estado },
            }
        );

        res.status(200).json({ message: 'Estado actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un estado
exports.deleteEstado = async (req, res) => {
    try {
        const { id } = req.params;

        await sequelize.query('DELETE FROM Estados WHERE id_estado = :id', {
            replacements: { id },
        });

        res.status(200).json({ message: 'Estado eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
