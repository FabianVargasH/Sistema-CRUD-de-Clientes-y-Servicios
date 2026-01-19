// test-server.js - Para probar el servidor independientemente
const { startServer, stopServer } = require('./server');

console.log('=== PRUEBA DEL SERVIDOR ===');

// Iniciar el servidor
startServer()
  .then(() => {
    console.log('✅ Servidor iniciado correctamente');
    console.log('✅ Accede a: http://localhost:3000');
    console.log('✅ Health check: http://localhost:3000/health');
    console.log('✅ Presiona Ctrl+C para detener');
  })
  .catch((error) => {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  });

// Manejar Ctrl+C para detener limpiamente
process.on('SIGINT', () => {
  console.log('\nDeteniendo servidor...');
  stopServer().then(() => {
    console.log('Servidor detenido');
    process.exit(0);
  });
});