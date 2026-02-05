// Estado global de la aplicación de reportes
let reportes = [];
let favoritos = [];
let notificaciones = [];
let actividades = [];
let mensajesAdmin = [];
let userSettings = {
    theme: 'dark',
    notifications: true
};
let currentViewingId = null;
let filtrosActivos = {
    jornada: '',
    ficha: '',
    fechaInicio: '',
    fechaFin: '',
    estado: ''
};

// Elementos del DOM
const elements = {
    // Estadísticas
    reportesHoy: document.getElementById('reportes-hoy'),
    fichasReportes: document.getElementById('fichas-reportes'),
    aprendicesReportados: document.getElementById('aprendices-reportados'),
    jornadasActivas: document.getElementById('jornadas-activas'),
    
    // Tabla
    reportesTbody: document.getElementById('reportes-tbody'),
    searchInput: document.getElementById('search-input'),
    
    // Header
    headerSearch: null, // Removido
    notificationBtn: document.getElementById('notification-btn'),
    favoritesBtn: document.getElementById('favorites-btn'),
    gridViewBtn: document.getElementById('grid-view-btn'),
    userBtn: document.getElementById('user-btn'),
    
    // Paneles
    notificationPanel: document.getElementById('notification-panel'),
    favoritesPanel: document.getElementById('favorites-panel'),
    userPanel: document.getElementById('user-panel'),
    notificationList: document.getElementById('notification-list'),
    favoritesList: document.getElementById('favorites-list'),
    
    // Contadores
    notificationCount: document.querySelector('.notification-count'),
    favoritesCount: document.querySelector('.favorites-count'),
    
    // Filtros
    jornadaFilter: document.getElementById('jornada-filter'),
    fichaFilter: document.getElementById('ficha-filter'),
    fechaInicio: document.getElementById('fecha-inicio'),
    fechaFin: document.getElementById('fecha-fin'),
    estadoFilter: document.getElementById('estado-filter'),
    clearFilters: document.getElementById('clear-filters'),
    applyFilters: document.getElementById('apply-filters'),
    
    // Modales
    generateReportBtn: document.getElementById('generate-report-btn'),
    generateReportModal: document.getElementById('generate-report-modal'),
    generateReportClose: document.getElementById('generate-report-close'),
    cancelReportBtn: document.getElementById('cancel-report-btn'),
    reportForm: document.getElementById('report-form'),
    
    viewReportModal: document.getElementById('view-report-modal'),
    viewReportClose: document.getElementById('view-report-close'),
    reportDetails: document.getElementById('report-details'),
    
    // Menú lateral
    sidebarToggle: document.getElementById('sidebar-toggle'),
    sidebar: document.querySelector('.sidebar'),
    
    // Estadísticas por jornada
    mañanaCount: document.getElementById('mañana-count'),
    tardeCount: document.getElementById('tarde-count'),
    nocheCount: document.getElementById('noche-count'),
    mañanaProgress: document.getElementById('mañana-progress'),
    tardeProgress: document.getElementById('tarde-progress'),
    nocheProgress: document.getElementById('noche-progress'),
    mañanaPercentage: document.getElementById('mañana-percentage'),
    tardePercentage: document.getElementById('tarde-percentage'),
    nochePercentage: document.getElementById('noche-percentage'),
    
    // Mensajes admin
    messagesList: document.getElementById('messages-list'),
    
    // Notificaciones
    notifications: document.getElementById('notifications')
};

// Funciones de localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('reportes', JSON.stringify(reportes));
        localStorage.setItem('reportesFavoritos', JSON.stringify(favoritos));
        localStorage.setItem('reportesNotificaciones', JSON.stringify(notificaciones));
        localStorage.setItem('reportesActividades', JSON.stringify(actividades));
        localStorage.setItem('mensajesAdmin', JSON.stringify(mensajesAdmin));
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
        localStorage.setItem('reportesFiltros', JSON.stringify(filtrosActivos));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedReportes = localStorage.getItem('reportes');
        const savedFavoritos = localStorage.getItem('reportesFavoritos');
        const savedNotificaciones = localStorage.getItem('reportesNotificaciones');
        const savedActividades = localStorage.getItem('reportesActividades');
        const savedMensajes = localStorage.getItem('mensajesAdmin');
        const savedUserSettings = localStorage.getItem('userSettings');
        const savedFiltros = localStorage.getItem('reportesFiltros');
        
        if (savedReportes) {
            reportes = JSON.parse(savedReportes);
        }
        if (savedFavoritos) {
            favoritos = JSON.parse(savedFavoritos);
        }
        if (savedNotificaciones) {
            notificaciones = JSON.parse(savedNotificaciones);
        }
        if (savedActividades) {
            actividades = JSON.parse(savedActividades);
        }
        if (savedMensajes) {
            mensajesAdmin = JSON.parse(savedMensajes);
        }
        if (savedUserSettings) {
            userSettings = JSON.parse(savedUserSettings);
        }
        if (savedFiltros) {
            filtrosActivos = JSON.parse(savedFiltros);
        }
    } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    initializeApp();
    setupEventListeners();
    
    // Solo cargar datos de ejemplo si no hay reportes guardados
    if (reportes.length === 0) {
        loadSampleData();
    }
});

function initializeApp() {
    initializeTheme();
    initializeSidebar();
    updateStats();
    renderTable();
    renderNotifications();
    renderFavorites();
    renderJornadaStats();
    renderAdminMessages();
    initializeCounters();
    loadFilters();
    
    // Verificar si hay un estado de vista guardado
    const savedViewMode = localStorage.getItem('reportesViewMode');
    if (savedViewMode === 'grid') {
        toggleGridView();
    }
}

function setupEventListeners() {
    // Formulario generar reporte
    elements.generateReportBtn.addEventListener('click', openGenerateModal);
    elements.generateReportClose.addEventListener('click', closeGenerateModal);
    elements.cancelReportBtn.addEventListener('click', closeGenerateModal);
    elements.generateReportModal.addEventListener('click', function(e) {
        if (e.target === elements.generateReportModal) {
            closeGenerateModal();
        }
    });
    
    // Modal ver reporte
    elements.viewReportClose.addEventListener('click', closeViewModal);
    elements.viewReportModal.addEventListener('click', function(e) {
        if (e.target === elements.viewReportModal) {
            closeViewModal();
        }
    });
    
    // Formulario
    elements.reportForm.addEventListener('submit', handleFormSubmit);
    
    // Búsqueda
    elements.searchInput.addEventListener('input', handleSearch);
    // elements.headerSearch.addEventListener('input', handleHeaderSearch); // Removido
    
    // Filtros
    if (elements.clearFilters) {
        elements.clearFilters.addEventListener('click', clearAllFilters);
    }
    if (elements.applyFilters) {
        elements.applyFilters.addEventListener('click', applyFilters);
    }
    
    // Botones de paneles
    const clearNotificationsBtn = document.getElementById('clear-notifications');
    if (clearNotificationsBtn) {
        clearNotificationsBtn.addEventListener('click', clearAllNotifications);
    }
    
    const clearFavoritesBtn = document.getElementById('clear-favorites');
    if (clearFavoritesBtn) {
        clearFavoritesBtn.addEventListener('click', clearAllFavorites);
    }
    
    // Header buttons
    if (elements.notificationBtn) {
        elements.notificationBtn.addEventListener('click', toggleSharedNotificationPanel);
    }
    if (elements.favoritesBtn) {
        elements.favoritesBtn.addEventListener('click', toggleSharedFavoritesPanel);
    }
    if (elements.gridViewBtn) {
        elements.gridViewBtn.addEventListener('click', toggleGridView);
    }
    if (elements.userBtn) {
        elements.userBtn.addEventListener('click', toggleSharedUserPanel);
    }
    
    // Menú lateral
    elements.sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Cerrar paneles al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!elements.notificationPanel.contains(e.target) && !elements.notificationBtn.contains(e.target)) {
            closeNotificationPanel();
        }
        if (!elements.favoritesPanel.contains(e.target) && !elements.favoritesBtn.contains(e.target)) {
            closeFavoritesPanel();
        }
        if (!elements.userPanel.contains(e.target) && !elements.userBtn.contains(e.target)) {
            closeUserPanel();
        }
    });
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeGenerateModal();
            closeViewModal();
            closeNotificationPanel();
            closeFavoritesPanel();
            closeUserPanel();
        }
    });
}

function loadSampleData() {
    const sampleReportes = [
        {
            id: 1,
            aprendiz: 'Juan Carlos Pérez',
            pc: 'PC-001',
            jornada: 'Mañana',
            ficha: 'ADSI-001',
            fecha: '2024-02-04',
            estado: 'Completado',
            observaciones: 'Reporte de actividades completado satisfactoriamente'
        },
        {
            id: 2,
            aprendiz: 'María González López',
            pc: 'PC-015',
            jornada: 'Tarde',
            ficha: 'CONT-002',
            fecha: '2024-02-04',
            estado: 'Revisado',
            observaciones: 'Pendiente revisión de documentos adicionales'
        },
        {
            id: 3,
            aprendiz: 'Carlos Rodríguez',
            pc: 'PC-008',
            jornada: 'Mañana',
            ficha: 'PROG-004',
            fecha: '2024-02-03',
            estado: 'Pendiente',
            observaciones: 'Falta completar módulo de programación'
        },
        {
            id: 4,
            aprendiz: 'Ana Martínez Silva',
            pc: 'PC-022',
            jornada: 'Noche',
            ficha: 'GEST-003',
            fecha: '2024-02-03',
            estado: 'Completado',
            observaciones: 'Excelente desempeño en gestión administrativa'
        },
        {
            id: 5,
            aprendiz: 'Luis Fernando Torres',
            pc: 'PC-012',
            jornada: 'Mañana',
            ficha: 'ADSI-001',
            fecha: '2024-02-04',
            estado: 'Revisado',
            observaciones: 'Proyecto de desarrollo web en progreso'
        }
    ];
    
    // Agregar notificaciones iniciales
    const sampleNotifications = [
        {
            id: Date.now() - 3,
            type: 'add',
            title: 'Nuevo reporte generado',
            message: 'Se generó el reporte para Juan Carlos Pérez',
            time: 'Hace 1 hora',
            unread: true
        },
        {
            id: Date.now() - 2,
            type: 'status',
            title: 'Estado actualizado',
            message: 'El reporte de María González cambió a Revisado',
            time: 'Hace 3 horas',
            unread: true
        }
    ];
    
    reportes = sampleReportes;
    notificaciones = sampleNotifications;
    saveToLocalStorage();
    updateStats();
    renderTable();
    renderNotifications();
    renderJornadaStats();
}

function updateStats() {
    const hoy = new Date().toISOString().split('T')[0];
    const reportesHoy = reportes.filter(r => r.fecha === hoy).length;
    const fichasConReportes = new Set(reportes.map(r => r.ficha)).size;
    const aprendicesReportados = new Set(reportes.map(r => r.aprendiz)).size;
    const jornadasActivas = new Set(reportes.map(r => r.jornada)).size;
    
    elements.reportesHoy.textContent = reportesHoy;
    elements.fichasReportes.textContent = fichasConReportes;
    elements.aprendicesReportados.textContent = aprendicesReportados;
    elements.jornadasActivas.textContent = jornadasActivas;
}

function renderTable(filteredReportes = null) {
    const dataToRender = filteredReportes || reportes;
    
    elements.reportesTbody.innerHTML = '';
    
    if (dataToRender.length === 0) {
        elements.reportesTbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                    No se encontraron reportes
                </td>
            </tr>
        `;
        return;
    }
    
    dataToRender.forEach(reporte => {
        const isFavorite = favoritos.some(f => f.id === reporte.id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reporte.aprendiz}</td>
            <td>${reporte.pc}</td>
            <td>${reporte.jornada}</td>
            <td>${reporte.ficha}</td>
            <td>${formatDate(reporte.fecha)}</td>
            <td>
                <span class="status-badge status-${reporte.estado.toLowerCase().replace(' ', '-')}">
                    ${reporte.estado}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="toggleFavorite(${reporte.id})" 
                            title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="edit-btn" onclick="viewReport(${reporte.id})" title="Ver reporte">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn" onclick="downloadReport(${reporte.id})" title="Descargar reporte">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteReport(${reporte.id})" title="Eliminar reporte">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // Animación de entrada
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        elements.reportesTbody.appendChild(row);
        
        // Trigger animation
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 50);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function handleSearch() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const searchBox = elements.searchInput.closest('.search-box');
    
    if (searchTerm === '') {
        if (searchBox) searchBox.classList.remove('searching');
        renderTable();
        // Si está en vista de cuadrícula, actualizar también
        if (document.querySelector('.table-section').classList.contains('grid-view')) {
            renderGridView();
        }
        return;
    }
    
    if (searchBox) searchBox.classList.add('searching');
    
    const filteredReportes = reportes.filter(reporte => 
        reporte.aprendiz.toLowerCase().includes(searchTerm) ||
        reporte.pc.toLowerCase().includes(searchTerm) ||
        reporte.jornada.toLowerCase().includes(searchTerm) ||
        reporte.ficha.toLowerCase().includes(searchTerm) ||
        reporte.estado.toLowerCase().includes(searchTerm)
    );
    
    // Si está en vista de cuadrícula, renderizar grid con datos filtrados
    if (document.querySelector('.table-section').classList.contains('grid-view')) {
        renderGridView(filteredReportes);
    } else {
        renderTable(filteredReportes);
    }
    
    if (searchBox) {
        setTimeout(() => {
            searchBox.classList.remove('searching');
        }, 1000);
    }
    
    // Registrar actividad de búsqueda
    if (searchTerm.length > 2) { // Solo registrar búsquedas significativas
        addSharedActivity(`Buscó "${searchTerm}" en reportes (${filteredReportes.length} resultados)`, 'search');
    }
}

function openGenerateModal() {
    elements.generateReportModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus en el primer input
    setTimeout(() => {
        document.getElementById('aprendiz').focus();
    }, 300);
    
    // Registrar actividad
    addSharedActivity('Abrió modal para generar nuevo reporte', 'modal');
}

function closeGenerateModal() {
    elements.generateReportModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    elements.reportForm.reset();
    
    // Registrar actividad solo si no se generó un reporte
    addSharedActivity('Cerró modal de generar reporte', 'modal');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const newReport = {
        id: Date.now(),
        aprendiz: document.getElementById('aprendiz').value.trim(),
        pc: document.getElementById('pc').value.trim(),
        jornada: document.getElementById('jornada-report').value,
        ficha: document.getElementById('ficha-report').value,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Pendiente',
        observaciones: document.getElementById('observaciones').value.trim()
    };
    
    reportes.push(newReport);
    saveToLocalStorage();
    closeGenerateModal();
    updateStats();
    renderTable();
    renderJornadaStats();
    
    addNotification('add', 'Nuevo reporte generado', `Se generó el reporte para ${newReport.aprendiz}`);
    
    if (userSettings.notifications) {
        showNotification(`Reporte generado para ${newReport.aprendiz}`, 'success');
    }
    
    // Registrar actividad
    addSharedActivity(`Generó nuevo reporte para ${newReport.aprendiz}`, 'create');
}

// Funciones adicionales (continuación en siguiente mensaje debido a límite de caracteres)
function viewReport(reportId) {
    const reporte = reportes.find(r => r.id === reportId);
    if (!reporte) return;
    
    currentViewingId = reportId;
    
    elements.reportDetails.innerHTML = `
        <div class="report-info">
            <div class="report-field">
                <label>Aprendiz:</label>
                <p>${reporte.aprendiz}</p>
            </div>
            <div class="report-field">
                <label>PC:</label>
                <p>${reporte.pc}</p>
            </div>
            <div class="report-field">
                <label>Jornada:</label>
                <p>${reporte.jornada}</p>
            </div>
            <div class="report-field">
                <label>Ficha:</label>
                <p>${reporte.ficha}</p>
            </div>
            <div class="report-field">
                <label>Fecha:</label>
                <p>${formatDate(reporte.fecha)}</p>
            </div>
            <div class="report-field">
                <label>Estado:</label>
                <span class="status-badge status-${reporte.estado.toLowerCase().replace(' ', '-')}">${reporte.estado}</span>
            </div>
            <div class="report-field">
                <label>Observaciones:</label>
                <p>${reporte.observaciones || 'Sin observaciones'}</p>
            </div>
        </div>
    `;
    
    elements.viewReportModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Registrar actividad
    addSharedActivity(`Visualizó reporte de ${reporte.aprendiz}`, 'view');
}

function closeViewModal() {
    elements.viewReportModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentViewingId = null;
}

function downloadReport(reportId) {
    const reporte = reportes.find(r => r.id === reportId);
    if (!reporte) return;
    
    // Simulación de descarga
    if (userSettings.notifications) {
        showNotification(`Descargando reporte de ${reporte.aprendiz}`, 'success');
    }
    
    addNotification('download', 'Reporte descargado', `Se descargó el reporte de ${reporte.aprendiz}`);
    
    // Registrar actividad
    addSharedActivity(`Descargó reporte de ${reporte.aprendiz}`, 'download');
}

function deleteReport(reportId) {
    if (confirm('¿Estás seguro de que quieres enviar este reporte a la papelera?')) {
        const reportIndex = reportes.findIndex(r => r.id === reportId);
        if (reportIndex === -1) return;
        
        const deletedReport = reportes[reportIndex];
        
        // Enviar a papelera en lugar de eliminar permanentemente
        const elementoEliminado = {
            id: deletedReport.id,
            tipo: 'Reporte',
            nombre: `Reporte de ${deletedReport.aprendiz} - ${deletedReport.ficha}`,
            descripcion: `Reporte de actividades del aprendiz ${deletedReport.aprendiz}`,
            usuario: 'Carlos Rodríguez', // Usuario actual (instructor)
            fechaEliminacion: new Date().toISOString().split('T')[0],
            origen: 'Reportes',
            estado: 'Eliminado',
            datosOriginales: {
                aprendiz: deletedReport.aprendiz,
                pc: deletedReport.pc,
                jornada: deletedReport.jornada,
                ficha: deletedReport.ficha,
                fecha: deletedReport.fecha,
                estado: deletedReport.estado,
                observaciones: deletedReport.observaciones
            }
        };
        
        // Agregar a papelera
        let elementosEliminados = JSON.parse(localStorage.getItem('elementosEliminados') || '[]');
        elementosEliminados.unshift(elementoEliminado);
        localStorage.setItem('elementosEliminados', JSON.stringify(elementosEliminados));
        
        // Eliminar de reportes
        reportes.splice(reportIndex, 1);
        
        // Eliminar de favoritos si existe
        const favoriteIndex = favoritos.findIndex(f => f.id === reportId);
        if (favoriteIndex !== -1) {
            favoritos.splice(favoriteIndex, 1);
            updateFavoritesCount();
            // También eliminar del sistema compartido
            removeSharedFavorite(reportId);
        }
        
        saveToLocalStorage();
        updateStats();
        renderTable();
        renderFavorites();
        renderJornadaStats();
        
        addNotification('delete', 'Reporte enviado a papelera', `Se envió el reporte de ${deletedReport.aprendiz} a la papelera`);
        
        if (userSettings.notifications) {
            showNotification(`Reporte de ${deletedReport.aprendiz} enviado a papelera`, 'success');
        }
        
        // Registrar actividad
        addSharedActivity(`Envió reporte de ${deletedReport.aprendiz} a la papelera`, 'delete');
    }
}

function toggleFavorite(reportId) {
    const reporte = reportes.find(r => r.id === reportId);
    if (!reporte) return;
    
    const favoriteIndex = favoritos.findIndex(f => f.id === reportId);
    
    if (favoriteIndex === -1) {
        // Agregar a favoritos usando función compartida
        addSharedFavorite(reportId, `Reporte de ${reporte.aprendiz}`, `${reporte.ficha} - ${reporte.estado}`, 'reporte');
        
        // También agregar al sistema local de reportes
        favoritos.push(reporte);
        addNotification('favorite', 'Agregado a favoritos', `El reporte de ${reporte.aprendiz} se agregó a favoritos`);
        if (userSettings.notifications) {
            showNotification(`Reporte de ${reporte.aprendiz} agregado a favoritos`, 'success');
        }
    } else {
        // Quitar de favoritos usando función compartida
        removeSharedFavorite(reportId);
        
        // También quitar del sistema local de reportes
        favoritos.splice(favoriteIndex, 1);
        addNotification('favorite', 'Quitado de favoritos', `El reporte de ${reporte.aprendiz} se quitó de favoritos`);
        if (userSettings.notifications) {
            showNotification(`Reporte de ${reporte.aprendiz} quitado de favoritos`, 'success');
        }
    }
    
    saveToLocalStorage();
    updateFavoritesCount();
    renderTable();
    renderFavorites();
    
    // Registrar actividad
    addSharedActivity(`${favoriteIndex === -1 ? 'Agregó' : 'Quitó'} reporte de ${reporte.aprendiz} ${favoriteIndex === -1 ? 'a' : 'de'} favoritos`, 'favorite');
}

// Funciones de filtros
function clearAllFilters() {
    if (elements.jornadaFilter) elements.jornadaFilter.value = '';
    if (elements.fichaFilter) elements.fichaFilter.value = '';
    if (elements.fechaInicio) elements.fechaInicio.value = '';
    if (elements.fechaFin) elements.fechaFin.value = '';
    if (elements.estadoFilter) elements.estadoFilter.value = '';
    
    filtrosActivos = {
        jornada: '',
        ficha: '',
        fechaInicio: '',
        fechaFin: '',
        estado: ''
    };
    
    saveToLocalStorage();
    
    // Si está en vista de cuadrícula, renderizar grid sin filtros
    if (document.querySelector('.table-section').classList.contains('grid-view')) {
        renderGridView();
    } else {
        renderTable();
    }
    
    if (userSettings.notifications) {
        showNotification('Filtros limpiados', 'success');
    }
    
    // Registrar actividad
    addSharedActivity('Limpió todos los filtros en reportes', 'filter');
}

function applyFilters() {
    filtrosActivos = {
        jornada: elements.jornadaFilter ? elements.jornadaFilter.value : '',
        ficha: elements.fichaFilter ? elements.fichaFilter.value : '',
        fechaInicio: elements.fechaInicio ? elements.fechaInicio.value : '',
        fechaFin: elements.fechaFin ? elements.fechaFin.value : '',
        estado: elements.estadoFilter ? elements.estadoFilter.value : ''
    };
    
    let filteredReportes = reportes;
    
    if (filtrosActivos.jornada) {
        filteredReportes = filteredReportes.filter(r => r.jornada === filtrosActivos.jornada);
    }
    
    if (filtrosActivos.ficha) {
        filteredReportes = filteredReportes.filter(r => r.ficha === filtrosActivos.ficha);
    }
    
    if (filtrosActivos.fechaInicio) {
        filteredReportes = filteredReportes.filter(r => r.fecha >= filtrosActivos.fechaInicio);
    }
    
    if (filtrosActivos.fechaFin) {
        filteredReportes = filteredReportes.filter(r => r.fecha <= filtrosActivos.fechaFin);
    }
    
    if (filtrosActivos.estado) {
        filteredReportes = filteredReportes.filter(r => r.estado === filtrosActivos.estado);
    }
    
    saveToLocalStorage();
    
    // Si está en vista de cuadrícula, renderizar grid con datos filtrados
    if (document.querySelector('.table-section').classList.contains('grid-view')) {
        renderGridView(filteredReportes);
    } else {
        renderTable(filteredReportes);
    }
    
    if (userSettings.notifications) {
        showNotification(`Filtros aplicados: ${filteredReportes.length} reportes encontrados`, 'success');
    }
    
    // Registrar actividad
    const activeFilters = Object.entries(filtrosActivos).filter(([key, value]) => value !== '').length;
    addSharedActivity(`Aplicó ${activeFilters} filtros en reportes`, 'filter');
}

function loadFilters() {
    if (elements.jornadaFilter) elements.jornadaFilter.value = filtrosActivos.jornada;
    if (elements.fichaFilter) elements.fichaFilter.value = filtrosActivos.ficha;
    if (elements.fechaInicio) elements.fechaInicio.value = filtrosActivos.fechaInicio;
    if (elements.fechaFin) elements.fechaFin.value = filtrosActivos.fechaFin;
    if (elements.estadoFilter) elements.estadoFilter.value = filtrosActivos.estado;
}

function renderJornadaStats() {
    const jornadaCounts = {
        'Mañana': reportes.filter(r => r.jornada === 'Mañana').length,
        'Tarde': reportes.filter(r => r.jornada === 'Tarde').length,
        'Noche': reportes.filter(r => r.jornada === 'Noche').length
    };
    
    const total = Object.values(jornadaCounts).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
        elements.mañanaCount.textContent = '0';
        elements.tardeCount.textContent = '0';
        elements.nocheCount.textContent = '0';
        elements.mañanaProgress.style.width = '0%';
        elements.tardeProgress.style.width = '0%';
        elements.nocheProgress.style.width = '0%';
        elements.mañanaPercentage.textContent = '0%';
        elements.tardePercentage.textContent = '0%';
        elements.nochePercentage.textContent = '0%';
        return;
    }
    
    const mañanaPercent = Math.round((jornadaCounts['Mañana'] / total) * 100);
    const tardePercent = Math.round((jornadaCounts['Tarde'] / total) * 100);
    const nochePercent = Math.round((jornadaCounts['Noche'] / total) * 100);
    
    elements.mañanaCount.textContent = jornadaCounts['Mañana'];
    elements.tardeCount.textContent = jornadaCounts['Tarde'];
    elements.nocheCount.textContent = jornadaCounts['Noche'];
    
    elements.mañanaProgress.style.width = `${mañanaPercent}%`;
    elements.tardeProgress.style.width = `${tardePercent}%`;
    elements.nocheProgress.style.width = `${nochePercent}%`;
    
    elements.mañanaPercentage.textContent = `${mañanaPercent}%`;
    elements.tardePercentage.textContent = `${tardePercent}%`;
    elements.nochePercentage.textContent = `${nochePercent}%`;
}

function renderAdminMessages() {
    if (mensajesAdmin.length === 0) {
        elements.messagesList.innerHTML = `
            <div class="empty-messages">
                <i class="fas fa-envelope-open"></i>
                <p>Mensajes del Administrador — Vacío</p>
                <small>Los mensajes importantes aparecerán aquí</small>
            </div>
        `;
        return;
    }
    
    elements.messagesList.innerHTML = '';
    
    mensajesAdmin.forEach(mensaje => {
        const messageElement = document.createElement('div');
        messageElement.className = 'admin-message';
        messageElement.innerHTML = `
            <div class="message-header">
                <h4>${mensaje.titulo}</h4>
                <span class="message-date">${formatDate(mensaje.fecha)}</span>
            </div>
            <p>${mensaje.contenido}</p>
        `;
        elements.messagesList.appendChild(messageElement);
    });
}

// Funciones compartidas del sistema (copiadas del script.js original)
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', userSettings.theme);
}

function toggleSidebar() {
    elements.sidebar.classList.toggle('collapsed');
    const isCollapsed = elements.sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

function initializeSidebar() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        elements.sidebar.classList.add('collapsed');
    }
}

function toggleGridView() {
    const tableSection = document.querySelector('.table-section');
    const isGridView = tableSection.classList.contains('grid-view');
    
    if (isGridView) {
        // Cambiar a vista de tabla
        tableSection.classList.remove('grid-view');
        elements.gridViewBtn.innerHTML = '<i class="fas fa-th"></i>';
        elements.gridViewBtn.title = 'Vista de cuadrícula';
        
        // Remover grid container si existe
        const gridContainer = tableSection.querySelector('.grid-overlay');
        if (gridContainer) {
            gridContainer.remove();
        }
        
        // Mostrar tabla
        document.querySelector('.table-container').style.display = 'block';
        
        // Guardar preferencia
        localStorage.setItem('reportesViewMode', 'table');
    } else {
        // Cambiar a vista de cuadrícula
        tableSection.classList.add('grid-view');
        elements.gridViewBtn.innerHTML = '<i class="fas fa-list"></i>';
        elements.gridViewBtn.title = 'Vista de lista';
        
        // Ocultar tabla
        document.querySelector('.table-container').style.display = 'none';
        
        // Crear y mostrar grid
        renderGridView();
        
        // Guardar preferencia
        localStorage.setItem('reportesViewMode', 'grid');
    }
    
    // Registrar actividad
    addSharedActivity(`Cambió a vista de ${isGridView ? 'tabla' : 'cuadrícula'} en reportes`, 'view');
}

function renderGridView(filteredReportes = null) {
    const tableSection = document.querySelector('.table-section');
    
    // Remover grid existente
    const existingGrid = tableSection.querySelector('.grid-overlay');
    if (existingGrid) {
        existingGrid.remove();
    }
    
    // Crear nuevo grid container
    const gridOverlay = document.createElement('div');
    gridOverlay.className = 'grid-overlay';
    
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';
    
    // Usar datos filtrados si se proporcionan, sino usar todos los reportes
    const dataToRender = filteredReportes || reportes;
    
    if (dataToRender.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                No se encontraron reportes
            </div>
        `;
    } else {
        dataToRender.forEach(reporte => {
            const isFavorite = favoritos.some(f => f.id === reporte.id);
            
            const card = document.createElement('div');
            card.className = 'ficha-card';
            card.innerHTML = `
                <div class="ficha-card-header">
                    <h3 class="ficha-code">${reporte.aprendiz}</h3>
                    <div class="ficha-card-actions">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                                onclick="toggleFavorite(${reporte.id})" 
                                title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="edit-btn" onclick="viewReport(${reporte.id})" title="Ver reporte">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="edit-btn" onclick="downloadReport(${reporte.id})" title="Descargar">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="delete-btn" onclick="deleteReport(${reporte.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="report-card-info">
                    <div class="report-card-field">
                        <i class="fas fa-desktop"></i>
                        <span>${reporte.pc}</span>
                    </div>
                    <div class="report-card-field">
                        <i class="fas fa-clock"></i>
                        <span>${reporte.jornada}</span>
                    </div>
                    <div class="report-card-field">
                        <i class="fas fa-folder"></i>
                        <span>${reporte.ficha}</span>
                    </div>
                    <div class="report-card-field">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(reporte.fecha)}</span>
                    </div>
                </div>
                <div class="ficha-card-footer">
                    <span class="status-badge status-${reporte.estado.toLowerCase().replace(' ', '-')}">
                        ${reporte.estado}
                    </span>
                </div>
            `;
            
            gridContainer.appendChild(card);
        });
    }
    
    gridOverlay.appendChild(gridContainer);
    tableSection.appendChild(gridOverlay);
}

function renderNotifications() {
    if (!elements.notificationList) return;
    
    if (notificaciones.length === 0) {
        elements.notificationList.innerHTML = `
            <div class="empty-favorites">
                <i class="fas fa-bell"></i>
                <p>No tienes notificaciones</p>
                <small>Las nuevas notificaciones aparecerán aquí</small>
            </div>
        `;
        return;
    }
    
    const iconMap = {
        'add': 'fas fa-plus',
        'edit': 'fas fa-edit',
        'delete': 'fas fa-trash',
        'status': 'fas fa-exchange-alt',
        'favorite': 'fas fa-heart',
        'download': 'fas fa-download'
    };
    
    elements.notificationList.innerHTML = '';
    
    notificaciones.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.unread ? 'unread' : ''}`;
        notificationElement.innerHTML = `
            <div class="notification-icon">
                <i class="${iconMap[notification.type] || 'fas fa-info'}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
        `;
        elements.notificationList.appendChild(notificationElement);
    });
}

function renderFavorites() {
    if (!elements.favoritesList) return;
    
    if (favoritos.length === 0) {
        elements.favoritesList.innerHTML = `
            <div class="empty-favorites">
                <i class="fas fa-heart"></i>
                <p>No tienes reportes favoritos aún</p>
                <small>Haz clic en el corazón de cualquier reporte para agregarlo a favoritos</small>
            </div>
        `;
        return;
    }
    
    elements.favoritesList.innerHTML = '';
    
    favoritos.forEach(reporte => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.innerHTML = `
            <div class="favorite-info">
                <h4>${reporte.aprendiz}</h4>
                <p>${reporte.ficha} - ${reporte.estado}</p>
            </div>
            <button class="remove-favorite" onclick="toggleFavorite(${reporte.id})" title="Quitar de favoritos">
                <i class="fas fa-times"></i>
            </button>
        `;
        elements.favoritesList.appendChild(favoriteItem);
    });
}

function initializeCounters() {
    updateFavoritesCount();
    
    if (elements.notificationCount) {
        const unreadCount = notificaciones.filter(n => n.unread).length;
        elements.notificationCount.textContent = unreadCount;
        if (unreadCount === 0) {
            elements.notificationCount.style.display = 'none';
        } else {
            elements.notificationCount.style.display = 'block';
        }
    }
}

function updateFavoritesCount() {
    if (elements.favoritesCount) {
        elements.favoritesCount.textContent = favoritos.length;
        if (favoritos.length === 0) {
            elements.favoritesCount.style.display = 'none';
        } else {
            elements.favoritesCount.style.display = 'block';
        }
    }
}

function markNotificationsAsRead() {
    notificaciones.forEach(notification => {
        notification.unread = false;
    });
    
    saveToLocalStorage();
    renderNotifications();
    
    setTimeout(() => {
        if (elements.notificationCount) {
            elements.notificationCount.textContent = '0';
            elements.notificationCount.style.display = 'none';
        }
    }, 300);
}

function addNotification(type, title, message) {
    // Usar función compartida además de la local
    addSharedNotification(type, title, message);
    
    // Mantener funcionalidad local para compatibilidad
    const notification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        time: 'Ahora',
        unread: true
    };
    
    notificaciones.unshift(notification);
    
    if (notificaciones.length > 50) {
        notificaciones = notificaciones.slice(0, 50);
    }
    
    saveToLocalStorage();
    renderNotifications();
    
    const currentCount = parseInt(elements.notificationCount.textContent) || 0;
    elements.notificationCount.textContent = currentCount + 1;
    elements.notificationCount.style.display = 'block';
}

function showNotification(message, type = 'success') {
    // Usar función compartida además de la local
    showSharedNotification(message, type);
    
    // Mantener funcionalidad local para compatibilidad
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    if (elements.notifications) {
        elements.notifications.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Funciones globales para onclick
window.viewReport = viewReport;
window.downloadReport = downloadReport;
window.deleteReport = deleteReport;
window.toggleFavorite = toggleFavorite;

// Funciones para limpiar paneles
function clearAllNotifications() {
    // Limpiar notificaciones locales
    notificaciones = [];
    saveToLocalStorage();
    renderNotifications();
    
    if (elements.notificationCount) {
        elements.notificationCount.textContent = '0';
        elements.notificationCount.style.display = 'none';
    }
    
    // También limpiar notificaciones compartidas
    clearAllSharedNotifications();
    
    showNotification('Todas las notificaciones han sido eliminadas', 'success');
    addSharedActivity('Limpió todas las notificaciones', 'clear');
}

function clearAllFavorites() {
    const count = favoritos.length;
    
    // Limpiar favoritos locales
    favoritos = [];
    saveToLocalStorage();
    updateFavoritesCount();
    renderFavorites();
    renderTable(); // Re-renderizar tabla para actualizar iconos de favoritos
    
    // También limpiar favoritos compartidos
    clearAllSharedFavorites();
    
    showNotification(`${count} favoritos eliminados`, 'success');
    addSharedActivity(`Limpió ${count} favoritos de reportes`, 'clear');
}