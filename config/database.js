const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('shoppingcart', 'sa', 'Marcela2020', {  
    host: 'localhost\\MSSQLSERVER', 
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});


sequelize.authenticate()
    .then(() => {
        console.log('Conexión establecida exitosamente.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

module.exports = sequelize;

