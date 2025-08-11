//LLama extensiones y la pool para la base de datos.
const express = require('express');
const pool = require('./db');
const app = express();
const port = 3000;

// Middleware para servir archivos estaticos desde la carpeta "public"
app.use(express.static('public'));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para crear un nuevo ticket despues lo usa el main
app.post('/api/tickets', async (req, res) => {
  const {
    cliente,
    telefono,
    email,
    modelo,
    problema,
    diagnostico
  } = req.body;

  // Generar la fecha actual en formato YYYY-MM-DD para mayor prolijidad
  const fechaHoy = new Date().toISOString().slice(0, 10);

  try {
    const [result] = await pool.execute(
      `INSERT INTO Tickets 
       (cliente, telefono, email, modelo, problema, diagnostico, fecha, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pendiente')`,
      [cliente, telefono, email, modelo, problema, diagnostico, fechaHoy]
    );

    res.status(201).json({ message: 'Ticket creado exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al crear el ticket:', error);
    res.status(500).json({ error: 'Error al crear el ticket' });
  }
});

// Ruta para obtener tickets activos (los no entregados)
app.get('/api/tickets/activos', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, cliente, telefono, email, modelo, problema, diagnostico, estado, 
         DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha 
       FROM Tickets 
       WHERE estado != 'Entregado' 
       ORDER BY id ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tickets activos:', error);
    res.status(500).json({ error: 'Error al obtener tickets activos' });
  }
});

// Ruta para obtener tickets entregados (historial)
app.get('/api/tickets/historial', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM Tickets WHERE estado = 'Entregado' ORDER BY fecha DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
});
// Ruta para marcar un ticket como entregado
app.put('/api/tickets/:id/entregar', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      `UPDATE Tickets SET estado = 'Entregado' WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    res.json({ message: 'Ticket marcado como entregado' });
  } catch (error) {
    console.error('Error al marcar ticket como entregado:', error);
    res.status(500).json({ error: 'Error al actualizar el ticket' });
  }
});
// Iniciar el servidor Se inicia en el puerto 3000
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
