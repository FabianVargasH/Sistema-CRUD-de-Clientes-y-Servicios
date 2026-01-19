const API_URL = 'http://localhost:3000/api';

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
    // Calcular días restantes para urgencia
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVencimiento = new Date(servicio.tiempo_cumplimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);
    const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));

    let urgenciaClass = '';
    let urgenciaTexto = '';
    if (diasRestantes < 0) {
        urgenciaClass = 'urgencia-vencido';
        urgenciaTexto = `⚠️ Vencido hace ${Math.abs(diasRestantes)} día${Math.abs(diasRestantes) !== 1 ? 's' : ''}`;
    } else if (diasRestantes <= 7) {
        urgenciaClass = 'urgencia-alta';
        urgenciaTexto = `🔴 Vence en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`;
    } else if (diasRestantes <= 30) {
        urgenciaClass = 'urgencia-media';
        urgenciaTexto = `🟡 Vence en ${diasRestantes} días`;
    } else {
        urgenciaClass = 'urgencia-baja';
        urgenciaTexto = `🟢 ${diasRestantes} días disponibles`;
    }

    return `
        <div class="service-card">
        <div class="service-header">
            <h3>Servicio #${servicio.id}</h3>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-edit" onclick="editarServicio(${servicio.id})">Editar</button>
                <button class="btn-bono" onclick="mostrarModalBono(${servicio.id}, '${servicio.nombre}', ${servicio.saldo_pendiente})">Agregar Bono</button>
                <button class="btn-delete" onclick="eliminarServicio(${servicio.id})">Eliminar</button>
            </div>
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
                    <div class="service-info urgencia ${urgenciaClass}"><strong>${urgenciaTexto}</strong></div>
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
                    <div class="service-info"><strong>Monto Total:</strong> $${formatearNumero(servicio.monto_servicio)}</div>
                    <div class="service-info"><strong>Bonos:</strong> $${formatearNumero(servicio.bonos)}</div>
                    <div class="service-info"><strong>Forma de Pago:</strong> ${servicio.forma_pago}</div>
                    <div class="saldo ${saldoClass}">
                        Saldo Pendiente: $${formatearNumero(servicio.saldo_pendiente)}
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
    
    timeoutBusqueda = setTimeout(async () => {
        aplicarFiltroTiempo(); // Usar la función de filtro que ya maneja búsqueda
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

// Aplicar filtro por tiempo de cumplimiento
async function aplicarFiltroTiempo() {
    const filtro = document.getElementById('filtroTiempo').value;
    const termino = document.getElementById('searchInput').value.trim();
    const container = document.getElementById('serviciosList');
    
    container.innerHTML = '<div class="loading">Filtrando servicios...</div>';

    try {
        // Obtener todos los servicios o buscar por término
        let url = termino ? `${API_URL}/servicios/buscar/${termino}` : `${API_URL}/servicios`;
        const response = await fetch(url);
        let servicios = await response.json();

        // Aplicar filtro de tiempo
        if (filtro) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            servicios = servicios.filter(servicio => {
                const fechaVencimiento = new Date(servicio.tiempo_cumplimiento);
                fechaVencimiento.setHours(0, 0, 0, 0);
                
                const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));

                switch(filtro) {
                    case 'vencidos':
                        return diasRestantes < 0;
                    case '1-semana':
                        return diasRestantes >= 0 && diasRestantes <= 7;
                    case '1-mes':
                        return diasRestantes >= 0 && diasRestantes <= 30;
                    case 'mas-1-mes':
                        return diasRestantes > 30;
                    default:
                        return true;
                }
            });
        }

        if (servicios.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay servicios que coincidan con el filtro</div>';
            return;
        }

        container.innerHTML = servicios.map(servicio => crearCardServicio(servicio)).join('');
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="empty-state">Error al filtrar servicios</div>';
    }
}

// Exportar servicios a PDF
async function exportarAPDF() {
    try {
        // Cargar las librerías
        const { jsPDF } = window.jspdf;
        
        // Obtener todos los servicios
        const response = await fetch(`${API_URL}/servicios`);
        const servicios = await response.json();

        if (servicios.length === 0) {
            alert('No hay servicios para exportar');
            return;
        }

        // Crear el documento PDF
        const doc = new jsPDF('landscape'); // Orientación horizontal
        
        // Título
        doc.setFontSize(18);
        doc.setTextColor(214, 203, 0); // Color amarillo
        doc.text('REPORTE DE SERVICIOS', 14, 15);
        
        // Fecha del reporte
        doc.setFontSize(10);
        doc.setTextColor(100);
        const fechaActual = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        doc.text(`Generado: ${fechaActual}`, 14, 22);
        
        // Estadísticas rápidas
        const totalServicios = servicios.length;
        const completados = servicios.filter(s => s.estado === 'completado').length;
        const pendientes = servicios.filter(s => s.estado === 'pendiente').length;
        const enProceso = servicios.filter(s => s.estado === 'en-proceso').length;
        const montoTotal = servicios.reduce((sum, s) => sum + parseFloat(s.monto_servicio), 0);
        const saldoTotal = servicios.reduce((sum, s) => sum + parseFloat(s.saldo_pendiente), 0);
        
        doc.setFontSize(9);
        doc.setTextColor(0);
        doc.text(`Total de servicios: ${totalServicios} | Completados: ${completados} | En Proceso: ${enProceso} | Pendientes: ${pendientes}`, 14, 28);

        // Preparar datos para la tabla
        const datos = servicios.map(servicio => [
            servicio.id,
            servicio.nombre,
            `${servicio.id_tipo.toUpperCase()}-${servicio.id_numero}`,
            servicio.nombre_servicio,
            servicio.responsable,
            servicio.estado.toUpperCase(),
            `$${parseFloat(servicio.monto_servicio).toFixed(2)}`,
            `$${parseFloat(servicio.saldo_pendiente).toFixed(2)}`,
            servicio.fecha_ingreso
        ]);

        // Crear tabla
        doc.autoTable({
            startY: 38,
            head: [['#', 'Cliente', 'ID', 'Servicio', 'Responsable', 'Estado', 'Monto', 'Saldo', 'Fecha']],
            body: datos,
            theme: 'grid',
            headStyles: {
                fillColor: [214, 203, 0], // Color amarillo
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                fontSize: 9
            },
            bodyStyles: {
                fontSize: 8
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            columnStyles: {
                0: { cellWidth: 12 },  // #
                1: { cellWidth: 40 },  // Cliente
                2: { cellWidth: 40 },  // ID
                3: { cellWidth: 35 },  // Servicio
                4: { cellWidth: 30 },  // Responsable
                5: { cellWidth: 25 },  // Estado
                6: { cellWidth: 22 },  // Monto
                7: { cellWidth: 22 },  // Saldo
                8: { cellWidth: 23 }   // Fecha
            },
            didDrawCell: function(data) {
                // Colorear estados
                if (data.column.index === 5 && data.cell.section === 'body') {
                    const estado = data.cell.raw;
                    if (estado === 'COMPLETADO') {
                        doc.setTextColor(16, 185, 129); // Verde
                    } else if (estado === 'EN-PROCESO') {
                        doc.setTextColor(59, 130, 246); // Azul
                    } else if (estado === 'PENDIENTE') {
                        doc.setTextColor(251, 191, 36); // Amarillo
                    }
                }
            }
        });

        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Página ${i} de ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Guardar el PDF
        const nombreArchivo = `Servicios_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(nombreArchivo);

        // Confirmación
        alert(`PDF generado exitosamente: ${nombreArchivo}`);

    } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Error al generar el PDF. Verifique la consola para más detalles.');
    }
}
// Editar servicio
async function editarServicio(id) {
    try {
        const response = await fetch(`${API_URL}/servicios/${id}`);
        const servicio = await response.json();

        // Llenar el formulario con los datos actuales
        document.getElementById('nombre').value = servicio.nombre;
        document.getElementById('idTipo').value = servicio.id_tipo;
        document.getElementById('idNumero').value = servicio.id_numero;
        document.getElementById('correo').value = servicio.correo;
        document.getElementById('telefono').value = servicio.telefono;
        document.getElementById('tipoServicio').value = servicio.tipo_servicio;
        document.getElementById('nombreServicio').value = servicio.nombre_servicio;
        document.getElementById('actividades').value = servicio.actividades;
        document.getElementById('tiempoCumplimiento').value = servicio.tiempo_cumplimiento;
        document.getElementById('responsable').value = servicio.responsable;
        document.getElementById('montoServicio').value = servicio.monto_servicio;
        document.getElementById('formaPago').value = servicio.forma_pago;
        document.getElementById('bonos').value = servicio.bonos;

        // Cambiar a la pestaña de ingreso
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('tab-ingreso').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');

        // Cambiar el botón de "Registrar" a "Actualizar"
        const btnGuardar = document.querySelector('.btn-primary');
        btnGuardar.textContent = 'Actualizar Servicio';
        btnGuardar.onclick = () => actualizarServicio(id);

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el servicio');
    }
}

// Actualizar servicio editado
async function actualizarServicio(id) {
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
        labores_realizadas: ''
    };

    // Validación
    if (!data.nombre || !data.id_numero || !data.correo || !data.telefono || 
        !data.tipo_servicio || !data.nombre_servicio || !data.actividades || 
        !data.tiempo_cumplimiento || !data.responsable || !data.monto_servicio) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/servicios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Servicio actualizado exitosamente');
            limpiarFormulario();
            restaurarBotonGuardar();
            actualizarContador();
            
            // Volver a consultas
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('tab-consultas').classList.add('active');
            document.querySelectorAll('.tab-btn')[1].classList.add('active');
            cargarServicios();
        } else {
            alert('Error al actualizar el servicio');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
}

// Restaurar botón de guardar al estado original
function restaurarBotonGuardar() {
    const btnGuardar = document.querySelector('.btn-primary');
    btnGuardar.textContent = 'Registrar Servicio';
    btnGuardar.onclick = guardarServicio;
}
// Variables globales para el modal de bono=========================================================
let servicioIdActual = null;
let saldoPendienteActual = 0;

// Mostrar modal para agregar bono
function mostrarModalBono(id, nombreCliente, saldoPendiente) {
    servicioIdActual = id;
    saldoPendienteActual = saldoPendiente;
    
    // Actualizar información en el modal
    document.getElementById('bonoNombreCliente').textContent = nombreCliente;
    document.getElementById('bonoSaldoActual').textContent = `$${formatearNumero(saldoPendiente)}`;
    
    // Limpiar y mostrar modal
    document.getElementById('montoBono').value = '';
    document.getElementById('modalBono').classList.add('active');
    
    // Enfocar el input
    setTimeout(() => {
        document.getElementById('montoBono').focus();
    }, 100);
}

// Cerrar modal
function cerrarModalBono() {
    document.getElementById('modalBono').classList.remove('active');
    servicioIdActual = null;
}

// Procesar el bono
async function procesarBono() {
    const montoBonoInput = document.getElementById('montoBono');
    const montoBono = parseFloat(montoBonoInput.value);
    
    // Validaciones
    if (!montoBono || isNaN(montoBono) || montoBono <= 0) {
        alert('Por favor ingrese un monto válido mayor a 0');
        montoBonoInput.focus();
        return;
    }
    
    if (montoBono > saldoPendienteActual) {
        const confirmar = confirm(`⚠️ El abono ($${formatearNumero(montoBono)}) es mayor que el saldo pendiente ($${formatearNumero(saldoPendienteActual)}).\n¿Desea continuar?`);
        if (!confirmar) {
            return;
        }
    }

    try {
        // Obtener el servicio actual
        const response = await fetch(`${API_URL}/servicios/${servicioIdActual}`);
        const servicio = await response.json();
        
        // Calcular nuevos valores
        const bonosActual = parseFloat(servicio.bonos) || 0;
        const nuevosBonos = bonosActual + montoBono;
        const nuevoSaldo = parseFloat(servicio.monto_servicio) - nuevosBonos;
        
        // Actualizar el servicio
        const servicioActualizado = {
            ...servicio,
            bonos: nuevosBonos,
            saldo_pendiente: nuevoSaldo
        };

        const updateResponse = await fetch(`${API_URL}/servicios/${servicioIdActual}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(servicioActualizado)
        });

        if (updateResponse.ok) {
            // Cerrar modal y mostrar confirmación
            cerrarModalBono();
            
            // Mostrar mensaje de éxito con animación
            const mensaje = `✓ Abono de $${formatearNumero(montoBono)} agregado exitosamente.\nNuevo saldo: $${formatearNumero(nuevoSaldo)}`;
            alert(mensaje);
            
            // Actualizar la lista de servicios
            cargarServicios();
        } else {
            const errorData = await updateResponse.json();
            console.error('Error del servidor:', errorData);
            alert('Error al agregar el abono');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión: ' + error.message);
    }
}

// Permitir Enter para procesar bono
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('montoBono').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            procesarBono();
        }
    });
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('modalBono').addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarModalBono();
        }
    });
});
//----------------------------------------
function formatearNumero(numero) {
    const num = parseFloat(numero);
    if (isNaN(num)) return "0.00";
    
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
});