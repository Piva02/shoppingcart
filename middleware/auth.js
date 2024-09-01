const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ error: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token inválido.' });
    }
};
exports.verifyAdmin = (req, res, next) => {
    const { id_rol } = req.user; 

    if (id_rol !== 1) { 
        return res.status(403).json({ error: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    }

    next();
};
