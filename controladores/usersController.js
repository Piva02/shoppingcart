const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const SECRET_KEY = 'secret_key'; 

// Create User
exports.createUser = async (req, res) => {
    try {
        const { correo, password_usuario, id_rol } = req.body;

      
        const hashedPassword = await bcrypt.hash(password_usuario, 10);

        await sequelize.query('EXEC sp_registrarusuario @correo=:correo, @password_usuario=:password_usuario, @id_rol=:id_rol', {
            replacements: { correo, password_usuario: hashedPassword, id_rol },
        });

        res.status(201).json({ message: 'Usuario creado existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { correo, password_usuario } = req.body;

        
        const [user] = await sequelize.query('SELECT * FROM usuarios WHERE correo = :correo', {
            replacements: { correo },
            type: sequelize.QueryTypes.SELECT,
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

       
        const isMatch = await bcrypt.compare(password_usuario, user.password_usuario);
        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        
        const token = jwt.sign(
            { id_usuario: user.id_usuario, correo: user.correo, id_rol: user.id_rol },
            SECRET_KEY,
            { expiresIn: '24h' } 
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Users
exports.getUsers = async (req, res) => {
    try {
        const users = await sequelize.query('SELECT * FROM usuarios', { type: sequelize.QueryTypes.SELECT });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await sequelize.query('SELECT * FROM usuarios WHERE id_usuario = :id', {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
        });

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { correo, password_usuario, id_rol } = req.body;

       
        let hashedPassword = password_usuario;
        if (password_usuario) {
            hashedPassword = await bcrypt.hash(password_usuario, 10);
        }

        await sequelize.query(
            'UPDATE usuarios SET correo = :correo, password_usuario = :password_usuario, id_rol = :id_rol WHERE id_usuario = :id',
            {
                replacements: { id, correo, password_usuario: hashedPassword, id_rol },
            }
        );

        res.status(200).json({ message: 'Usuario actualizado existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await sequelize.query('DELETE FROM usuarios WHERE id_usuario = :id', {
            replacements: { id },
        });

        res.status(200).json({ message: 'Usuario eliminado existosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


