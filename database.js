const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS servicios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    id_tipo TEXT NOT NULL,
    id_numero TEXT NOT NULL,
    correo TEXT NOT NULL,
    telefono TEXT NOT NULL,
    tipo_servicio TEXT NOT NULL,
    nombre_servicio TEXT NOT NULL,
    actividades TEXT NOT NULL,
    tiempo_cumplimiento TEXT NOT NULL,
    responsable TEXT NOT NULL,
    monto_servicio REAL NOT NULL,
    forma_pago TEXT NOT NULL,
    bonos REAL DEFAULT 0,
    saldo_pendiente REAL NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    labores_pendientes TEXT,
    labores_realizadas TEXT,
    fecha_ingreso TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Base de datos inicializada');

module.exports = db;