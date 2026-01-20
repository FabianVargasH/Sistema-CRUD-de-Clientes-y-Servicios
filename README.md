# Sistema de Gestión de Servicios 

Sistema de escritorio desarrollado en Electron para la gestión integral de servicios profesionales, clientes, pagos y seguimiento de actividades.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Propietario-red)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![Electron](https://img.shields.io/badge/Electron-33.4.11-47848F)
![Node](https://img.shields.io/badge/Node.js-22.16.0-339933)
![Status](https://img.shields.io/badge/status-Producción-green)

## Descripción

Aplicación de escritorio diseñada para un negocio de servicios profesionales (contables, tributarios, legales, notariales y criminológicos) que necesita gestionar clientes, servicios, pagos y seguimiento de tareas de manera eficiente y sin conexión a internet.

## Imagenes de la aplicación

### Imagen 1
<img width="1861" height="1038" alt="Screenshot 2026-01-19 131040" src="https://github.com/user-attachments/assets/2b7ad9d6-1d0c-477e-846d-c0819085beab" />

### Imagen 2
<img width="1846" height="955" alt="Screenshot 2026-01-19 131055" src="https://github.com/user-attachments/assets/b8d09c2e-ae96-4951-8848-43f4ebda411c" />

### Imagen 3
<img width="1898" height="953" alt="Screenshot 2026-01-19 131113" src="https://github.com/user-attachments/assets/1820797d-1138-420c-8ac3-2e2ae634169c" />

### Imagen 4
<img width="1858" height="968" alt="Screenshot 2026-01-19 131253" src="https://github.com/user-attachments/assets/cfdf4998-bfb5-47a3-beb6-acf5af340ca2" />

### Imagen 5
<img width="1828" height="976" alt="Screenshot 2026-01-19 131305" src="https://github.com/user-attachments/assets/f39ed823-327a-4fe1-b254-050e0a75c477" />


## Características Principales

### Gestión de Servicios
- Registro completo de servicios con información del cliente
- Seguimiento de estado (Pendiente, En Proceso, Completado)
- Control de tiempos de cumplimiento con alertas visuales
- Gestión de labores pendientes y realizadas

### Control Financiero
- Registro de montos y formas de pago (Efectivo, Tarjeta, Transferencia, SINPE)
- Sistema de abonos con cálculo automático de saldo pendiente
- Visualización clara de estado de cuenta
- Formato de números con separadores para fácil lectura

### Búsqueda y Filtros
- Búsqueda en tiempo real por nombre, ID, servicio o tipo
- Filtros por tiempo de vencimiento (vencidos, 1 semana, 1 mes, más de 1 mes)
- Indicadores visuales de urgencia por color

### Reportes
- Exportación completa a PDF con estadísticas
- Tablas detalladas con todos los servicios
- Información de estado y saldos

### Edición de Datos
- Edición completa de servicios registrados
- Actualización de estados en tiempo real
- Registro de nuevos abonos sobre servicios existentes

## Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura de la interfaz
- **CSS3** - Diseño moderno con degradados y animaciones
- **JavaScript (ES6+)** - Lógica de la aplicación

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Servidor HTTP y API REST
- **SQLite3** (better-sqlite3) - Base de datos local

### Desktop
- **Electron** - Framework para aplicación de escritorio
- **electron-builder** - Empaquetado e instalador

### Librerías Adicionales
- **jsPDF** - Generación de documentos PDF
- **jsPDF-AutoTable** - Creación de tablas en PDF
- **CORS** - Manejo de peticiones cross-origin
- **Body-parser** - Procesamiento de JSON
  
## Estructura del proyecto

<pre>
sistema-servicios/
|-- public/
|   |-- index.html
|   |-- styles.css
|   |-- script.js
|   |-- LTC logo.jpeg
|
|-- dist/
|   |-- win-unpacked/
|   |-- builder-effective-config.yaml
|   |-- Sistema de Servicios Setup 1.0.0.exe
|
|-- node_modules/
|
|-- main.js
|-- server.js
|-- database.js
|-- preload.js
|-- test-server.js
|
|-- package.json
|-- package-lock.json
|-- icon.ico
|-- .gitignore
|-- README.md
</pre>

## Instalación para Desarrollo

### Requisitos Previos
- Node.js v16 o superior
- npm v7 o superior

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/FabianVargasH/Sistema-CRUD-de-Clientes-y-Servicios.git
cd sistema-servicios
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Recompilar módulos nativos**
```bash
npx electron-rebuild
```

4. **Ejecutar en modo desarrollo**
```bash
npm start
```
## Generar Instalador

Para crear el instalador de Windows:

1. **Ejecutar como Administrador (PowerShell)**
```bash
npm run build
```
Tamaño aproximado: 100-120MB

2. **El instalador se generará en:**
```
dist/Sistema de Servicios Setup 1.0.0.exe
```

## Base de Datos

### Ubicación
- **Desarrollo:** `./database.sqlite`
- **Producción:** `C:\Users\[Usuario]\AppData\Roaming\sistema-servicios\database.sqlite`

### Estructura de la Tabla `servicios`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | ID único autoincremental |
| nombre | TEXT | Nombre del cliente |
| id_tipo | TEXT | Tipo de identificación (cédula/pasaporte/dimex) |
| id_numero | TEXT | Número de identificación |
| correo | TEXT | Correo electrónico |
| telefono | TEXT | Teléfono de contacto |
| tipo_servicio | TEXT | Tipo de servicio (contable/tributario/legal/etc) |
| nombre_servicio | TEXT | Nombre descriptivo del servicio |
| actividades | TEXT | Descripción de actividades |
| tiempo_cumplimiento | TEXT | Fecha límite de cumplimiento |
| responsable | TEXT | Persona responsable del servicio |
| monto_servicio | REAL | Monto total del servicio |
| forma_pago | TEXT | Método de pago |
| bonos | REAL | Abonos realizados |
| saldo_pendiente | REAL | Saldo por pagar (calculado) |
| estado | TEXT | Estado actual (pendiente/en-proceso/completado) |
| labores_pendientes | TEXT | Tareas por realizar |
| labores_realizadas | TEXT | Tareas completadas |
| fecha_ingreso | TEXT | Fecha de registro |
| created_at | DATETIME | Timestamp de creación |

## Paleta de Colores

- **Primario:** `#D6CB00` (Amarillo dorado)
- **Fondo:** `#000000` (Negro)
- **Secundario:** `#1a1a1a` (Negro suave)
- **Bordes:** `#333333` (Gris oscuro)
- **Texto:** `#ffffff` (Blanco)
- **Estados:**
  - Completado: `#10b981` (Verde)
  - En Proceso: `#3b82f6` (Azul)
  - Pendiente: `#fbbf24` (Amarillo)
  - Vencido: `#dc2626` (Rojo)

## API REST

### Endpoints Disponibles

#### Servicios
- `GET /api/servicios` - Obtener todos los servicios
- `GET /api/servicios/:id` - Obtener un servicio específico
- `POST /api/servicios` - Crear un nuevo servicio
- `PUT /api/servicios/:id` - Actualizar un servicio
- `DELETE /api/servicios/:id` - Eliminar un servicio
- `GET /api/servicios/buscar/:termino` - Buscar servicios

## Seguridad

- Base de datos local (no expuesta a internet)
- Sin almacenamiento en la nube
- Datos encriptados en el sistema de archivos del usuario
- Sin recolección de datos personales

## Solución de Problemas

### Error: "Cannot find module 'better-sqlite3'"
```bash
npx electron-rebuild
```

### Error al generar instalador (permisos)
- Ejecutar PowerShell como Administrador

### La aplicación no guarda datos
- Verificar permisos de escritura en `AppData\Roaming`

### Advertencia de Windows Defender
- Normal en aplicaciones no firmadas digitalmente
- Click en "Más información" → "Ejecutar de todas formas"

## **Correcciones Críticas Implementadas**

#### **1. Problema: Pantalla en blanco en el .exe generado**
**Causa:** Electron intentaba cargar desde `http://localhost:3000` pero el servidor Express no estaba disponible en producción.
**Solución:** 
- Configuración dual de carga: `file://` en producción, `localhost` en desarrollo
- Corrección de rutas estáticas con `path.join(__dirname, 'public')`
- Servidor Express iniciándose antes de cargar la ventana

#### **2. Problema: Error de compilación better-sqlite3**
**Causa:** Módulo nativo compilado para Node.js 22.16.0 (NODE_MODULE_VERSION 127) pero Electron requiere versión 130.
**Solución:**
- Recompilación con `npx electron-rebuild`
- Inclusión de script `postinstall` en package.json
- Uso de `electron-builder install-app-deps` para dependencias nativas

#### **3. Problema: Rutas API no accesibles en producción**
**Causa:** Frontend intentando conectar a `http://localhost:3000/api` sin servidor.
**Solución:**
- Servidor Express corriendo en segundo plano en modo producción
- Middleware CORS correctamente configurado
- Rutas catch-all para SPA: `app.get('*', ...)`

#### **4. Problema: Archivos estáticos (CSS/JS) no cargaban**
**Causa:** `express.static('public')` usando ruta relativa incorrecta.
**Solución:** 
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

#### **5. Problema: Errores de sintaxis JavaScript**
**Causa:** Funciones duplicadas y llaves faltantes en `script.js`.
**Solución:**
- Unificación de función `formatearNumero()`
- Corrección de cierre de funciones `buscarServicios()` y `actualizarContador()`
- Validación completa del código

#### **6. Problema: Servidor se cierra inmediatamente**
**Causa:** Falta de manejo de proceso para mantener el servidor activo.
**Solución:**
- Creación de `test-server.js` para pruebas independientes
- Implementación de manejo de señales SIGINT
- Uso de Promises para inicio/cierre controlado

#### **7. Problema: Icono no aparece en el instalador**
**Causa:** Electron-builder no detectaba el archivo `icon.ico`.
**Solución:**
- Inclusión explícita en `files` del build
- Configuración de `extraResources`
- Especificación de ruta en `win.icon`
  
```
```
## Uso de la Aplicación

### Para el Usuario Final

1. **Instalación**
   - Doble clic en el instalador
   - Seguir el asistente de instalación
   - Ejecutar desde el ícono del escritorio

2. **Registro de Servicios**
   - Tab "Ingreso de Datos"
   - Completar información del cliente
   - Descripción del servicio
   - Información de pago
   - Click en "Registrar Servicio"

3. **Consulta y Gestión**
   - Tab "Consultas"
   - Buscar por nombre, ID o servicio
   - Filtrar por tiempo de vencimiento
   - Editar servicios existentes
   - Agregar abonos
   - Exportar a PDF
  
## Conclusión Técnica
### Logros Implementados:
- Arquitectura híbrida Electron + Express funcional
- Base de datos local SQLite con alta performance
- Build automático con electron-builder
- Instalador profesional con icono personalizado
- Aplicación offline completa sin dependencias externas
- Seguridad robusta en todos los niveles
- Rendimiento optimizado para datos moderados

### Puntos Fuertes:
- Portabilidad: Solo requiere el .exe para instalación
- Performance: Respuesta en milisegundos
- Confiabilidad: Sin dependencias de internet
- Mantenibilidad: Código modular y documentado
- Seguridad: Múltiples capas de protección


## Contribuciones
Este es un proyecto privado desarrollado para uso interno.

## Licencia

**GNU GPL v3.0**

## Autor
Desarrollador: Fabián Vargas Hidalgo

Correo: fabianvh2506@gmail.com

Desarrollado para el negocio LTC asesoría

**Última actualización:** Enero 2026
