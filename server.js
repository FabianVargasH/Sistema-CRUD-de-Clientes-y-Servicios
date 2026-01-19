const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Obtencion de todos los servicios
app.get('/api/servicios', (req, res) => {
  try {
    const servicios = db.prepare('SELECT * FROM servicios ORDER BY created_at DESC').all();
    res.json(servicios);
  } catch (err) {
    console.error('Error al obtener servicios:', err);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

// Obtener un servicio específico
app.get('/api/servicios/:id', (req, res) => {
  try {
    const servicio = db.prepare('SELECT * FROM servicios WHERE id = ?').get(req.params.id);
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (err) {
    console.error('Error al obtener servicio:', err);
    res.status(500).json({ error: 'Error al obtener servicio' });
  }
});

// Crear nuevo servicio
app.post('/api/servicios', (req, res) => {
  try {
    const {
      nombre, id_tipo, id_numero, correo, telefono, tipo_servicio,
      nombre_servicio, actividades, tiempo_cumplimiento, responsable,
      monto_servicio, forma_pago, bonos, estado, labores_pendientes,
      labores_realizadas, fecha_ingreso
    } = req.body;

    const saldo_pendiente = parseFloat(monto_servicio) - parseFloat(bonos || 0);

    const stmt = db.prepare(`
      INSERT INTO servicios (
        nombre, id_tipo, id_numero, correo, telefono, tipo_servicio,
        nombre_servicio, actividades, tiempo_cumplimiento, responsable,
        monto_servicio, forma_pago, bonos, saldo_pendiente, estado,
        labores_pendientes, labores_realizadas, fecha_ingreso
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      nombre, id_tipo, id_numero, correo, telefono, tipo_servicio,
      nombre_servicio, actividades, tiempo_cumplimiento, responsable,
      monto_servicio, forma_pago, bonos || 0, saldo_pendiente, estado || 'pendiente',
      labores_pendientes || '', labores_realizadas || '', fecha_ingreso
    );

    res.status(201).json({ 
      message: 'Servicio creado exitosamente', 
      id: result.lastInsertRowid 
    });
  } catch (err) {
    console.error('Error al crear servicio:', err);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
});

// Actualizar servicio
app.put('/api/servicios/:id', (req, res) => {
  try {
    const {
      nombre, id_tipo, id_numero, correo, telefono, tipo_servicio,
      nombre_servicio, actividades, tiempo_cumplimiento, responsable,
      monto_servicio, forma_pago, bonos, estado, labores_pendientes,
      labores_realizadas
    } = req.body;

    const saldo_pendiente = parseFloat(monto_servicio) - parseFloat(bonos || 0);

    const stmt = db.prepare(`
      UPDATE servicios SET
        nombre = ?, id_tipo = ?, id_numero = ?, correo = ?, telefono = ?,
        tipo_servicio = ?, nombre_servicio = ?, actividades = ?,
        tiempo_cumplimiento = ?, responsable = ?, monto_servicio = ?,
        forma_pago = ?, bonos = ?, saldo_pendiente = ?, estado = ?,
        labores_pendientes = ?, labores_realizadas = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      nombre, id_tipo, id_numero, correo, telefono, tipo_servicio,
      nombre_servicio, actividades, tiempo_cumplimiento, responsable,
      monto_servicio, forma_pago, bonos || 0, saldo_pendiente, estado || 'pendiente',
      labores_pendientes || '', labores_realizadas || '', req.params.id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json({ message: 'Servicio actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar servicio:', err);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
});

// Eliminar servicio
app.delete('/api/servicios/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM servicios WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json({ message: 'Servicio eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar servicio:', err);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
});

// Buscar servicios
app.get('/api/servicios/buscar/:termino', (req, res) => {
  try {
    const termino = `%${req.params.termino}%`;
    const servicios = db.prepare(`
      SELECT * FROM servicios 
      WHERE nombre LIKE ? 
         OR id_numero LIKE ? 
         OR nombre_servicio LIKE ?
         OR tipo_servicio LIKE ?
      ORDER BY created_at DESC
    `).all(termino, termino, termino, termino);
    
    res.json(servicios);
  } catch (err) {
    console.error('Error en búsqueda:', err);
    res.status(500).json({ error: 'Error en búsqueda' });
  }
});
// Ruta de salud para verificar que el servidor funciona
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Ruta catch-all para servir la aplicación SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let server;

function startServer() {
  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      resolve();
    });
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        console.log('Servidor detenido');
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = { startServer, stopServer };