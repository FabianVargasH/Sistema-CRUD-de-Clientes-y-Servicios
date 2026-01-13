API_URL = 'http://localhost:3000/api';

// Cambiar entre tabs
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const btns = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    btns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'consultas') {
        cargarServicios();
    }
}

// Guardar nuevo servicio
async function guardarServicio() {
    const data = {
        nombre: document.getElementById('nombre').value,
        id_tipo: document.getElementById('idTipo').value,
        id_numero: document.getElementById('idNumero').value,
        correo: document.getElementById('correo').value,
        telefono: document.getElementById('telefono').value,
        tipo_servicio: document.getElementById('tipoServicio').value,
        nombre_servicio: document.getElementById('nombreServicio').value,
        actividades: document.getElementById('actividades').value,
        tiempo_cumplimiento: document.getElementById('tiempoCumplimiento').value,
        responsable: document.getElementById('responsable').value,
        monto_servicio: document.getElementById('montoServicio').value,
        forma_pago: document.getElementById('formaPago').value,
        bonos: document.getElementById('bonos').value || 0,
        estado: 'pendiente',
        labores_pendientes: '',
        labores_realizadas: '',
        fecha_ingreso: new Date().toISOString().split('T')[0]
    };

    // Validación
    if (!data.nombre || !data.id_numero || !data.correo || !data.telefono || 
        !data.tipo_servicio || !data.nombre_servicio || !data.actividades || 
        !data.tiempo_cumplimiento || !data.responsable || !data.monto_servicio) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/servicios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Servicio registrado exitosamente');
            limpiarFormulario();
            actualizarContador();
        } else {
            alert('Error al registrar el servicio');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('idTipo').value = 'cedula';
    document.getElementById('idNumero').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('tipoServicio').value = '';
    document.getElementById('nombreServicio').value = '';
    document.getElementById('actividades').value = '';
    document.getElementById('tiempoCumplimiento').value = '';
    document.getElementById('responsable').value = '';
    document.getElementById('montoServicio').value = '';
    document.getElementById('formaPago').value = 'efectivo';
    document.getElementById('bonos').value = '';
}

// Cargar servicios
async function cargarServicios() {
    const container = document.getElementById('serviciosList');
    container.innerHTML = '<div class="loading">Cargando servicios...</div>';

    try {
        const response = await fetch(`${API_URL}/servicios`);
        const servicios = await response.json();

        if (servicios.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay servicios registrados</div>';
            return;
        }

        container.innerHTML = servicios.map(servicio => crearCardServicio(servicio)).join('');
        actualizarContador();
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="empty-state">Error al cargar servicios</div>';
    }
}

// Crear card de servicio
function crearCardServicio(servicio) {
    const estadoClass = servicio.estado.replace('-', '');
    const saldoClass = servicio.saldo_pendiente > 0 ? 'positivo' : 'cero';

    return `
        <div class="service-card">
            <div class="service-header">
                <h3>Servicio #${servicio.id}</h3>
                <button class="btn-delete" onclick="eliminarServicio(${servicio.id})">Eliminar</button>
            </div>
            
            <div class="service-grid">
                <div class="service-section">
                    <h4>👤 Datos del Cliente</h4>
                    <div class="service-info"><strong>Nombre:</strong> ${servicio.nombre}</div>
                    <div class="service-info"><strong>ID:</strong> ${servicio.id_tipo.toUpperCase()} - ${servicio.id_numero}</div>
                    <div class="service-info"><strong>Correo:</strong> ${servicio.correo}</div>
                    <div class="service-info"><strong>Teléfono:</strong> ${servicio.telefono}</div>
                    <div class="service-info"><strong>Fecha:</strong> ${servicio.fecha_ingreso}</div>
                </div>

                <div class="service-section">
                    <h4>📋 Estado del Servicio</h4>
                    <div class="service-info"><strong>Servicio:</strong> ${servicio.nombre_servicio}</div>
                    <div class="service-info"><strong>Tipo:</strong> ${servicio.tipo_servicio}</div>
                    <div class="service-info"><strong>Responsable:</strong> ${servicio.responsable}</div>
                    <div class="service-info"><strong>Tiempo:</strong> ${servicio.tiempo_cumplimiento}</div>
                    <div class="service-info">
                        <strong>Estado:</strong>
                        <select class="estado-select status-${estadoClass}" onchange="actualizarEstado(${servicio.id}, this.value)">
                            <option value="pendiente" ${servicio.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="en-proceso" ${servicio.estado === 'en-proceso' ? 'selected' : ''}>En Proceso</option>
                            <option value="completado" ${servicio.estado === 'completado' ? 'selected' : ''}>Completado</option>
                        </select>
                    </div>
                </div>

                <div class="service-section">
                    <h4>✅ Labores</h4>
                    <div>
                        <strong>Pendientes:</strong>
                        <textarea class="labor-input" rows="2" onblur="actualizarLabor(${servicio.id}, 'labores_pendientes', this.value)">${servicio.labores_pendientes || ''}</textarea>
                    </div>
                    <div style="margin-top: 0.5rem;">
                        <strong>Realizadas:</strong>
                        <textarea class="labor-input" rows="2" onblur="actualizarLabor(${servicio.id}, 'labores_realizadas', this.value)">${servicio.labores_realizadas || ''}</textarea>
                    </div>
                </div>

                <div class="service-section">
                    <h4>💰 Estado de Cuenta</h4>
                    <div class="service-info"><strong>Monto Total:</strong> $${parseFloat(servicio.monto_servicio).toFixed(2)}</div>
                    <div class="service-info"><strong>Bonos:</strong> $${parseFloat(servicio.bonos).toFixed(2)}</div>
                    <div class="service-info"><strong>Forma de Pago:</strong> ${servicio.forma_pago}</div>
                    <div class="saldo ${saldoClass}">
                        Saldo Pendiente: $${parseFloat(servicio.saldo_pendiente).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Actualizar estado
async function actualizarEstado(id, nuevoEstado) {
    try {
        const response = await fetch(`${API_URL}/servicios/${id}`);
        const servicio = await response.json();
        
        servicio.estado = nuevoEstado;

        await fetch(`${API_URL}/servicios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(servicio)
        });

        cargarServicios();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar el estado');
    }
}

// Actualizar labor
async function actualizarLabor(id, campo, valor) {
    try {
        const response = await fetch(`${API_URL}/servicios/${id}`);
        const servicio = await response.json();
        
        servicio[campo] = valor;

        await fetch(`${API_URL}/servicios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(servicio)
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar');
    }
}

// Eliminar servicio
async function eliminarServicio(id) {
    if (!confirm('¿Está seguro de eliminar este servicio?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/servicios/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Servicio eliminado exitosamente');
            cargarServicios();
        } else {
            alert('Error al eliminar el servicio');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Buscar servicios
let timeoutBusqueda;
async function buscarServicios() {
    clearTimeout(timeoutBusqueda);
    
    const termino = document.getElementById('searchInput').value.trim();
    
    if (termino === '') {
        cargarServicios();
        return;
    }

    timeoutBusqueda = setTimeout(async () => {
        const container = document.getElementById('serviciosList');
        container.innerHTML = '<div class="loading">Buscando...</div>';

        try {
            const response = await fetch(`${API_URL}/servicios/buscar/${termino}`);
            const servicios = await response.json();

            if (servicios.length === 0) {
                container.innerHTML = '<div class="empty-state">No se encontraron resultados</div>';
                return;
            }

            container.innerHTML = servicios.map(servicio => crearCardServicio(servicio)).join('');
        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = '<div class="empty-state">Error en la búsqueda</div>';
        }
    }, 300);
}

// Actualizar contador
async function actualizarContador() {
    try {
        const response = await fetch(`${API_URL}/servicios`);
        const servicios = await response.json();
        const count = servicios.length;
        document.getElementById('serviceCount').textContent = 
            `${count} servicio${count !== 1 ? 's' : ''} registrado${count !== 1 ? 's' : ''}`;
    } catch (error) {
        console.error('Error:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
});