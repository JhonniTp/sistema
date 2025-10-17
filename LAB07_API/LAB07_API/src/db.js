const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pruebasbd'
});

connection.connect(
    (error) => {
        if(error) {
            console.error('Error conectando a MySQL:', error);
            return;
        }
        console.log('Conexión exitosa a MySQL');
    }
);

module.exports = connection;