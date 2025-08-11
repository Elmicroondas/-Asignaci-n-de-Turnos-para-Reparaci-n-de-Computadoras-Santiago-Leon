//Pool de credenciales para la conexion con la base de datos. Para poder conectar la base de datos crear usuario santiago,
//con contraseña santiago y con todos los permisos posibles sobre la base de datos.
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',    
  user: 'santiago',        
  password: 'santiago',
  database: 'sistematickets', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
