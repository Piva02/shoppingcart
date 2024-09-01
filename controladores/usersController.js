const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const SECRET_KEY = 'your_secret_key';
const nodemailer = require('nodemailer');

exports.createUser = async (req, res) => {
    try {
        const { correo, password_usuario, id_rol } = req.body;

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password_usuario, 10);

        // Generar el token
        const token = jwt.sign({ correo }, SECRET_KEY, { expiresIn: '24h' });

        // Guardar el usuario en la base de datos con estado 'pendiente'
        await sequelize.query('EXEC sp_registrarusuario @correo=:correo, @password_usuario=:password_usuario, @id_rol=:id_rol', {
            replacements: { correo, password_usuario: hashedPassword, id_rol },
        });

        // Actualizar el usuario para guardar el token y establecer el estado en 'pendiente'
        await sequelize.query('UPDATE usuarios SET token = :token, estado = \'pendiente\' WHERE correo = :correo', {
            replacements: { token, correo },
        });

                // Responder con el token para pruebas (en un entorno de producción, envíalo por correo electrónico)
                res.status(201).json({ message: 'Usuario creado exitosamente. Por favor, confirma tu correo.', token: token });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
       
        // Configurar el transporte de correo
        // const transporter = nodemailer.createTransport({
        //    service: 'gmail',
        //    auth: {
        //        user: 'your_email@gmail.com', 
        //        pass: 'your_password', 
        //    },
        //});

        // Opciones de correo
        //const mailOptions = {
        //    from: 'your_email@gmail.com',
        //    to: correo,
        //    subject: 'Confirma tu registro',
        //    text: `Por favor confirma tu cuenta usando el siguiente token: ${token}`
        // };

        // Enviar el correo electrónico
        //await transporter.sendMail(mailOptions);

       
exports.confirmUser = async (req, res) => {
    try {
        const { token } = req.body;

        // Verificar el token
        const decoded = jwt.verify(token, SECRET_KEY);
        const { correo } = decoded;
 // Buscar al usuario con el token proporcionado y estado 'pendiente'
        const [user] = await sequelize.query('SELECT * FROM usuarios WHERE correo = :correo AND token = :token AND estado = \'pendiente\'', {
            replacements: { correo, token },
            type: sequelize.QueryTypes.SELECT,
    });

    if (!user) {
    return res.status(400).json({ error: 'Token inválido o expirado.' });
}

// Actualizar el estado del usuario a 'activo'
    await sequelize.query('UPDATE usuarios SET estado = \'activo\', token = NULL WHERE correo = :correo', {
    replacements: { correo },
});

    res.status(200).json({ message: 'Usuario confirmado exitosamente.' });
} catch (error) {
    res.status(400).json({ error: 'Token inválido o expirado.' });
}
};

exports.loginUser = async (req, res) => {
    try {
        const { correo, password_usuario } = req.body;

        // Verificar si el usuario existe
        const [user] = await sequelize.query('SELECT * FROM usuarios WHERE correo = :correo', {
            replacements: { correo },
            type: sequelize.QueryTypes.SELECT,
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Verificar si la contraseña es correcta
        const isPasswordValid = await bcrypt.compare(password_usuario, user.password_usuario);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }

        // Verificar si el usuario está activo
        if (user.estado !== 'activo') {
            return res.status(403).json({ error: 'El usuario no ha confirmado su cuenta.' });
        }

        // Generar un nuevo token JWT
        const token = jwt.sign({ id_usuario: user.id_usuario, correo: user.correo, id_rol: user.id_rol }, SECRET_KEY, { expiresIn: '24h' });

        res.status(200).json({ message: 'Inicio de sesión exitoso.', token: token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
