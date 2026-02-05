// ===== SISTEMA DE PAPELERA - GESTIÓN DE FICHAS =====

// Estado global de la aplicación de papelera
let elementosEliminados = [];
let favoritos = [];
let notificaciones = [];
let actividades = [];
let userSettings = {
    theme: 'dark',
    notifications: true
};
let currentActionId = null;
let filtrosActivos = {
    tipo: '',
    usuario: '',
    origen: '',
    fechaInicio: '',
    fechaFin: ''
};

// Elementos del DOM
const elements = {
    // Estadísticas
    totalEliminados: document.getElementById('total-eliminados'),
    fichasEliminadas: document.getElementById('fichas-eliminadas'),
    reportesEliminados: document.getElementById('reportes-eliminados'),
    comentariosEliminados: document.getElementById('comentarios-eliminados'),
    
    // Tabla
    papeleraTbody: document.getElementById('papelera-tbody'),
    searchInput: document.getElementById('search-input'),
    
    // Header
    notificationBtn: document.getElementById('notification-btn'),
    favoritesBtn: document.getElementById('favorites-btn'),
    gridViewBtn: document.getElementById('grid-view-btn'),
    userBtn: document.getElementById('user-btn'),
    emptyTrashBtn: document.getElementById('empty-trash-btn'),
    
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
    tipoFilter: document.getElementById('tipo-filter'),
    usuarioFilter: document.getElementById('usuario-filter'),
    origenFilter: document.getElementById('origen-filter'),
    fechaInicio: document.getElementById('fecha-inicio'),
    fechaFin: document.getElementById('fecha-fin'),
    clearFilters: document.getElementById('clear-filters'),
    applyFilters: document.getElementById('apply-filters'),
    
    // Modales
    restoreModal: document.getElementById('restore-modal'),
    restoreClose: document.getElementById('restore-close'),
    cancelRestoreBtn: document.getElementById('cancel-restore-btn'),
    confirmRestoreBtn: document.getElementById('confirm-restore-btn'),
    restoreMessage: document.getElementById('restore-message'),
    restorePreview: document.getElementById('restore-preview'),
    
    deletePermanentModal: document.getElementById('delete-permanent-modal'),
    deletePermanentClose: document.getElementById('delete-permanent-close'),
    cancelDeletePermanentBtn: document.getElementById('cancel-delete-permanent-btn'),
    confirmDeletePermanentBtn: document.getElementById('confirm-delete-permanent-btn'),
    deletePermanentMessage: document.getElementById('delete-permanent-message'),
    deletePermanentPreview: document.getElementById('delete-permanent-preview'),
    
    viewDetailsModal: document.getElementById('view-details-modal'),
    viewDetailsClose: document.getElementById('view-details-close'),
    elementDetails: document.getElementById('element-details'),
    
    emptyTrashModal: document.getElementById('empty-trash-modal'),
    emptyTrashClose: document.getElementById('empty-trash-close'),
    cancelEmptyTrashBtn: document.getElementById('cancel-empty-trash-btn'),
    confirmEmptyTrashBtn: document.getElementById('confirm-empty-trash-btn'),
    trashSummary: document.getElementById('trash-summary'),
    
    // Menú lateral
    sidebarToggle: document.getElementById('sidebar-toggle'),
    sidebar: document.querySelector('.sidebar'),
    
    // Notificaciones
    notifications: document.getElementById('notifications')
};

// Funciones de localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('elementosEliminados', JSON.stringify(elementosEliminados));
        localStorage.setItem('papeleraFavoritos', JSON.stringify(favoritos));
        localStorage.setItem('papeleraNotificaciones', JSON.stringify(notificaciones));
        localStorage.setItem('papeleraActividades', JSON.stringify(actividades));
        localStorage.setItem('papeleraUserSettings', JSON.stringify(userSettings));
        localStorage.setItem('papeleraFiltros', JSON.stringify(filtrosActivos));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedElementos = localStorage.getItem('elementosEliminados');
        const savedFavoritos = localStorage.getItem('papeleraFavoritos');
        const savedNotificaciones = localStorage.getItem('papeleraNotificaciones');
        const savedActividades = localStorage.getItem('papeleraActividades');
        const savedUserSettings = localStorage.getItem('papeleraUserSettings');
        const savedFiltros = localStorage.getItem('papeleraFiltros');
        
        if (savedElementos) {
            elementosEliminados = JSON.parse(savedElementos);
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
    
    // Solo cargar datos de ejemplo si no hay elementos eliminados guardados
    if (elementosEliminados.length === 0) {
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
    initializeCounters();
    loadFilters();
    
    // Verificar si hay un estado de vista guardado
    const savedViewMode = localStorage.getItem('papeleraViewMode');
    if (savedViewMode === 'grid') {
        toggleGridView();
    }
}

function setupEventListeners() {
    // Modales
    elements.restoreClose.addEventListener('click', closeRestoreModal);
    elements.cancelRestoreBtn.addEventListener('click', closeRestoreModal);
    elements.confirmRestoreBtn.addEventListener('click', confirmRestore);
    elements.restoreModal.addEventListener('click', function(e) {
        if (e.target === elements.restoreModal) {
            closeRestoreModal();
        }
    });
    
    elements.deletePermanentClose.addEventListener('click', closeDeletePermanentModal);
    elements.cancelDeletePermanentBtn.addEventListener('click', closeDeletePermanentModal);
    elements.confirmDeletePermanentBtn.addEventListener('click', confirmDeletePermanent);
    elements.deletePermanentModal.addEventListener('click', function(e) {
        if (e.target === elements.deletePermanentModal) {
            closeDeletePermanentModal();
        }
    });
    
    elements.viewDetailsClose.addEventListener('click', closeViewDetailsModal);
    elements.viewDetailsModal.addEventListener('click', function(e) {
        if (e.target === elements.viewDetailsModal) {
            closeViewDetailsModal();
        }
    });
    
    elements.emptyTrashBtn.addEventListener('click', openEmptyTrashModal);
    elements.emptyTrashClose.addEventListener('click', closeEmptyTrashModal);
    elements.cancelEmptyTrashBtn.addEventListener('click', closeEmptyTrashModal);
    elements.confirmEmptyTrashBtn.addEventListener('click', confirmEmptyTrash);
    elements.emptyTrashModal.addEventListener('click', function(e) {
        if (e.target === elements.emptyTrashModal) {
            closeEmptyTrashModal();
        }
    });
    
    // Búsqueda
    elements.searchInput.addEventListener('input', handleSearch);
    
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
    
    // Header buttons - usar funciones compartidas
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
            closeRestoreModal();
            closeDeletePermanentModal();
            closeViewDetailsModal();
            closeEmptyTrashModal();
            closeNotificationPanel();
            closeFavoritesPanel();
            closeUserPanel();
        }
    });
}

function loadSampleData() {
    const sampleElementos = [
        {
            id: 1,
            tipo: 'Ficha',
            nombre: 'ADSI-001 - Análisis y Desarrollo de Sistemas',
            descripcion: 'Ficha de formación en desarrollo de software',
            usuario: 'Carlos Rodríguez',
            fechaEliminacion: '2024-02-03',
            origen: 'Fichas',
            estado: 'Eliminado',
            datosOriginales: {
                codigo: 'ADSI-001',
                programa: 'Análisis y Desarrollo de Sistemas de Información',
                instructor: 'Ana García López',
                estado: 'Activo'
            }
        },
        {
            id: 2,
            tipo: 'Reporte',
            nombre: 'Reporte de Juan Pérez - ADSI-001',
            descripcion: 'Reporte de actividades del aprendiz Juan Pérez',
            usuario: 'Ana García',
            fechaEliminacion: '2024-02-02',
            origen: 'Reportes',
            estado: 'Eliminado',
            datosOriginales: {
                aprendiz: 'Juan Pérez',
                pc: 'PC-001',
                jornada: 'Mañana',
                ficha: 'ADSI-001',
                fecha: '2024-02-01',
                estado: 'Completado'
            }
        },
        {
            id: 3,
            tipo: 'Comentario',
            nombre: 'Comentario de María González',
            descripcion: 'Comentario sobre el progreso en CONT-002',
            usuario: 'María González',
            fechaEliminacion: '2024-02-01',
            origen: 'Comentarios',
            estado: 'Eliminado',
            datosOriginales: {
                usuario: 'María González',
                rol: 'Instructor',
                ficha: 'CONT-002',
                comentario: 'Excelente progreso en contabilidad básica',
                fecha: '2024-01-30',
                estado: 'Publicado'
            }
        },
        {
            id: 4,
            tipo: 'Ficha',
            nombre: 'PROG-004 - Programación Web',
            descripcion: 'Ficha de formación en programación web',
            usuario: 'Carlos Rodríguez',
            fechaEliminacion: '2024-01-31',
            origen: 'Fichas',
            estado: 'Eliminado',
            datosOriginales: {
                codigo: 'PROG-004',
                programa: 'Programación de Aplicaciones Web',
                instructor: 'Luis Martínez',
                estado: 'Inactivo'
            }
        },
        {
            id: 5,
            tipo: 'Comentario',
            nombre: 'Comentario de Juan Pérez',
            descripcion: 'Solicitud de ayuda en programación',
            usuario: 'Juan Pérez',
            fechaEliminacion: '2024-01-30',
            origen: 'Comentarios',
            estado: 'Eliminado',
            datosOriginales: {
                usuario: 'Juan Pérez',
                rol: 'Aprendiz',
                ficha: 'PROG-004',
                comentario: 'Necesito ayuda con JavaScript avanzado',
                fecha: '2024-01-28',
                estado: 'Pendiente'
            }
        }
    ];
    
    // Agregar notificaciones iniciales
    const sampleNotifications = [
        {
            id: Date.now() - 3,
            type: 'delete',
            title: 'Elemento eliminado',
            message: 'Ficha ADSI-001 movida a la papelera',
            time: 'Hace 1 día',
            unread: true
        },
        {
            id: Date.now() - 2,
            type: 'delete',
            title: 'Elemento eliminado',
            message: 'Reporte de Juan Pérez movido a la papelera',
            time: 'Hace 2 días',
            unread: true
        }
    ];
    
    elementosEliminados = sampleElementos;
    notificaciones = sampleNotifications;
    saveToLocalStorage();
    updateStats();
    renderTable();
    renderNotifications();
}

function updateStats() {
    const total = elementosEliminados.length;
    const fichas = elementosEliminados.filter(e => e.tipo === 'Ficha').length;
    const reportes = elementosEliminados.filter(e => e.tipo === 'Reporte').length;
    const comentarios = elementosEliminados.filter(e => e.tipo === 'Comentario').length;
    
    elements.totalEliminados.textContent = total;
    elements.fichasEliminadas.textContent = fichas;
    elements.reportesEliminados.textContent = reportes;
    elements.comentariosEliminados.textContent = comentarios;
}

function renderTable(filteredElementos = null) {
    const dataToRender = filteredElementos || elementosEliminados;
    
    elements.papeleraTbody.innerHTML = '';
    
    if (dataToRender.length === 0) {
        elements.papeleraTbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-trash-alt" style="font-size: 48px; margin-bottom: 15px; display: block; opacity: 0.5;"></i>
                    ${filteredElementos ? 'No se encontraron elementos' : 'La papelera está vacía'}
                </td>
            </tr>
        `;
        return;
    }
    
    dataToRender.forEach(elemento => {
        const isFavorite = favoritos.some(f => f.id === elemento.id);
        const truncatedDesc = elemento.descripcion.length > 60 
            ? elemento.descripcion.substring(0, 60) + '...' 
            : elemento.descripcion;
            
        const row = document.createElement('tr');
        row.className = 'trash-row';
        row.innerHTML = `
            <td>
                <span class="type-badge type-${elemento.tipo.toLowerCase()}">
                    <i class="fas fa-${getTypeIcon(elemento.tipo)}"></i>
                    ${elemento.tipo}
                </span>
            </td>
            <td>
                <div class="element-info">
                    <h4 class="element-name">${elemento.nombre}</h4>
                    <p class="element-desc" title="${elemento.descripcion}">${truncatedDesc}</p>
                </div>
            </td>
            <td>${elemento.usuario}</td>
            <td>${formatDate(elemento.fechaEliminacion)}</td>
            <td>
                <span class="status-badge status-eliminado">
                    <i class="fas fa-trash-alt"></i>
                    Eliminado
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="toggleFavorite(${elemento.id})" 
                            title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="restore-btn" onclick="openRestoreModal(${elemento.id})" title="Restaurar elemento">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="edit-btn" onclick="viewElementDetails(${elemento.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="delete-btn" onclick="openDeletePermanentModal(${elemento.id})" title="Eliminar permanentemente">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        // Animación de entrada
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        elements.papeleraTbody.appendChild(row);
        
        // Trigger animation
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 50);
    });
}

function getTypeIcon(tipo) {
    const icons = {
        'Ficha': 'folder',
        'Reporte': 'chart-bar',
        'Comentario': 'comments'
    };
    return icons[tipo] || 'file';
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
    
    const filteredElementos = elementosEliminados.filter(elemento => 
        elemento.tipo.toLowerCase().includes(searchTerm) ||
        elemento.nombre.toLowerCase().includes(searchTerm) ||
        elemento.descripcion.toLowerCase().includes(searchTerm) ||
        elemento.usuario.toLowerCase().includes(searchTerm) ||
        elemento.origen.toLowerCase().includes(searchTerm)
    );
    
    // Si está en vista de cuadrícula, renderizar grid con datos filtrados
    if (document.querySelector('.table-section').classList.contains('grid-view')) {
        renderGridView(filteredElementos);
    } else {
        renderTable(filteredElementos);
    }
    
    if (searchBox) {
        setTimeout(() => {
            searchBox.classList.remove('searching');
        }, 1000);
    }
    
    // Registrar actividad de búsqueda
    if (searchTerm.length > 2) { // Solo registrar búsquedas significativas
        addSharedActivity(`Buscó "${searchTerm}" en papelera (${filteredElementos.length} resultados)`, 'search');
    }
}

// Funciones de modales
function openRestoreModal(elementId) {
    const elemento = elementosEliminados.find(e => e.id === elementId);
    if (!elemento) return;
    
    currentActionId = elementId;
    
    elements.restoreMessage.textContent = `¿Estás seguro de que quieres restaurar "${elemento.nombre}"? Se devolverá a su ubicación original en ${elemento.origen}.`;
    
    elements.restorePreview.innerHTML = `
        <div class="preview-item">
            <span class="type-badge type-${elemento.tipo.toLowerCase()}">
                <i class="fas fa-${getTypeIcon(elemento.tipo)}"></i>
                ${elemento.tipo}
            </span>
            <div class="preview-info">
                <h5>${elemento.nombre}</h5>
                <p>${elemento.descripcion}</p>
                <small>Eliminado por ${elemento.usuario} el ${formatDate(elemento.fechaEliminacion)}</small>
            </div>
        </div>
    `;
    
    elements.restoreModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Registrar actividad
    addSharedActivity(`Abrió modal para restaurar ${elemento.tipo.toLowerCase()}: ${elemento.nombre}`, 'modal');
}

function closeRestoreModal() {
    elements.restoreModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentActionId = null;
}

function confirmRestore() {
    if (!currentActionId) return;
    
    const elementIndex = elementosEliminados.findIndex(e => e.id === currentActionId);
    if (elementIndex === -1) return;
    
    const elemento = elementosEliminados[elementIndex];
    
    // Restaurar elemento a su ubicación original
    if (elemento.tipo === 'Ficha' && elemento.datosOriginales) {
        // Restaurar ficha
        let fichas = JSON.parse(localStorage.getItem('fichas') || '[]');
        const fichaRestaurada = {
            id: elemento.id,
            codigo: elemento.datosOriginales.codigo,
            formacion: elemento.datosOriginales.formacion,
            jornada: elemento.datosOriginales.jornada,
            instructor: elemento.datosOriginales.instructor,
            estado: elemento.datosOriginales.estado
        };
        fichas.push(fichaRestaurada);
        localStorage.setItem('fichas', JSON.stringify(fichas));
        
    } else if (elemento.tipo === 'Reporte' && elemento.datosOriginales) {
        // Restaurar reporte
        let reportes = JSON.parse(localStorage.getItem('reportes') || '[]');
        const reporteRestaurado = {
            id: elemento.id,
            aprendiz: elemento.datosOriginales.aprendiz,
            pc: elemento.datosOriginales.pc,
            jornada: elemento.datosOriginales.jornada,
            ficha: elemento.datosOriginales.ficha,
            fecha: elemento.datosOriginales.fecha,
            estado: elemento.datosOriginales.estado,
            observaciones: elemento.datosOriginales.observaciones
        };
        reportes.push(reporteRestaurado);
        localStorage.setItem('reportes', JSON.stringify(reportes));
        
    } else if (elemento.tipo === 'Comentario' && elemento.datosOriginales) {
        // Restaurar comentario
        let comentarios = JSON.parse(localStorage.getItem('comentarios') || '[]');
        const comentarioRestaurado = {
            id: elemento.id,
            usuario: elemento.datosOriginales.usuario,
            rol: elemento.datosOriginales.rol,
            ficha: elemento.datosOriginales.ficha,
            comentario: elemento.datosOriginales.comentario,
            fecha: elemento.datosOriginales.fecha,
            estado: elemento.datosOriginales.estado,
            importante: elemento.datosOriginales.importante,
            respuesta: elemento.datosOriginales.respuesta
        };
        comentarios.push(comentarioRestaurado);
        localStorage.setItem('comentarios', JSON.stringify(comentarios));
    }
    
    // Eliminar de papelera
    elementosEliminados.splice(elementIndex, 1);
    
    // Eliminar de favoritos si existe
    const favoriteIndex = favoritos.findIndex(f => f.id === currentActionId);
    if (favoriteIndex !== -1) {
        favoritos.splice(favoriteIndex, 1);
        updateFavoritesCount();
        removeSharedFavorite(currentActionId);
    }
    
    saveToLocalStorage();
    updateStats();
    renderTable();
    renderFavorites();
    closeRestoreModal();
    
    addNotification('restore', 'Elemento restaurado', `${elemento.nombre} ha sido restaurado a ${elemento.origen}`);
    
    if (userSettings.notifications) {
        showNotification(`${elemento.tipo} restaurado exitosamente`, 'success');
    }
    
    // Registrar actividad
    addSharedActivity(`Restauró ${elemento.tipo.toLowerCase()}: ${elemento.nombre}`, 'restore');
}

function openDeletePermanentModal(elementId) {
    const elemento = elementosEliminados.find(e => e.id === elementId);
    if (!elemento) return;
    
    currentActionId = elementId;
    
    elements.deletePermanentMessage.textContent = `El elemento "${elemento.nombre}" será eliminado permanentemente del sistema. Esta acción no se puede deshacer.`;
    
    elements.deletePermanentPreview.innerHTML = `
        <div class="preview-item">
            <span class="type-badge type-${elemento.tipo.toLowerCase()}">
                <i class="fas fa-${getTypeIcon(elemento.tipo)}"></i>
                ${elemento.tipo}
            </span>
            <div class="preview-info">
                <h5>${elemento.nombre}</h5>
                <p>${elemento.descripcion}</p>
                <small>Eliminado por ${elemento.usuario} el ${formatDate(elemento.fechaEliminacion)}</small>
            </div>
        </div>
    `;
    
    elements.deletePermanentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Registrar actividad
    addSharedActivity(`Abrió modal para eliminar permanentemente ${elemento.tipo.toLowerCase()}: ${elemento.nombre}`, 'modal');
}

function closeDeletePermanentModal() {
    elements.deletePermanentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentActionId = null;
}

function confirmDeletePermanent() {
    if (!currentActionId) return;
    
    const elementIndex = elementosEliminados.findIndex(e => e.id === currentActionId);
    if (elementIndex === -1) return;
    
    const elemento = elementosEliminados[elementIndex];
    
    // Eliminar permanentemente
    elementosEliminados.splice(elementIndex, 1);
    
    // Eliminar de favoritos si existe
    const favoriteIndex = favoritos.findIndex(f => f.id === currentActionId);
    if (favoriteIndex !== -1) {
        favoritos.splice(favoriteIndex, 1);
        updateFavoritesCount();
        removeSharedFavorite(currentActionId);
    }
    
    saveToLocalStorage();
    updateStats();
    renderTable();
    renderFavorites();
    closeDeletePermanentModal();
    
    addNotification('delete', 'Elemento eliminado permanentemente', `${elemento.nombre} ha sido eliminado definitivamente`);
    
    if (userSettings.notifications) {
        showNotification(`${elemento.tipo} eliminado permanentemente`, 'success');
    }
    
    // Registrar actividad
    addSharedActivity(`Eliminó permanentemente ${elemento.tipo.toLowerCase()}: ${elemento.nombre}`, 'delete');
}

function viewElementDetails(elementId) {
    const elemento = elementosEliminados.find(e => e.id === elementId);
    if (!elemento) return;
    
    let detailsHTML = `
        <div class="element-details-info">
            <div class="detail-field">
                <label>Tipo:</label>
                <span class="type-badge type-${elemento.tipo.toLowerCase()}">
                    <i class="fas fa-${getTypeIcon(elemento.tipo)}"></i>
                    ${elemento.tipo}
                </span>
            </div>
            <div class="detail-field">
                <label>Nombre:</label>
                <p>${elemento.nombre}</p>
            </div>
            <div class="detail-field">
                <label>Descripción:</label>
                <p>${elemento.descripcion}</p>
            </div>
            <div class="detail-field">
                <label>Usuario que eliminó:</label>
                <p>${elemento.usuario}</p>
            </div>
            <div class="detail-field">
                <label>Fecha de eliminación:</label>
                <p>${formatDate(elemento.fechaEliminacion)}</p>
            </div>
            <div class="detail-field">
                <label>Origen:</label>
                <p>${elemento.origen}</p>
            </div>
            <div class="detail-field">
                <label>Estado:</label>
                <span class="status-badge status-eliminado">
                    <i class="fas fa-trash-alt"></i>
                    ${elemento.estado}
                </span>
            </div>
    `;
    
    // Agregar datos originales si existen
    if (elemento.datosOriginales) {
        detailsHTML += `
            <div class="detail-field full-width">
                <label>Datos Originales:</label>
                <div class="original-data">
        `;
        
        Object.entries(elemento.datosOriginales).forEach(([key, value]) => {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            detailsHTML += `
                <div class="original-field">
                    <span class="original-label">${label}:</span>
                    <span class="original-value">${value}</span>
                </div>
            `;
        });
        
        detailsHTML += `
                </div>
            </div>
        `;
    }
    
    detailsHTML += `</div>`;
    
    elements.elementDetails.innerHTML = detailsHTML;
    elements.viewDetailsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Registrar actividad
    addSharedActivity(`Visualizó detalles de ${elemento.tipo.toLowerCase()}: ${elemento.nombre}`, 'view');
}

function closeViewDetailsModal() {
    elements.viewDetailsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openEmptyTrashModal() {
    if (elementosEliminados.length === 0) {
        showNotification('La papelera ya está vacía', 'info');
        return;
    }
    
    const fichas = elementosEliminados.filter(e => e.tipo === 'Ficha').length;
    const reportes = elementosEliminados.filter(e => e.tipo === 'Reporte').length;
    const comentarios = elementosEliminados.filter(e => e.tipo === 'Comentario').length;
    
    elements.trashSummary.innerHTML = `
        <div class="summary-stats">
            <h5>Se eliminarán permanentemente:</h5>
            <div class="summary-grid">
                <div class="summary-item">
                    <i class="fas fa-folder"></i>
                    <span>${fichas} Fichas</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-chart-bar"></i>
                    <span>${reportes} Reportes</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-comments"></i>
                    <span>${comentarios} Comentarios</span>
                </div>
                <div class="summary-total">
                    <strong>Total: ${elementosEliminados.length} elementos</strong>
                </div>
            </div>
        </div>
    `;
    
    elements.emptyTrashModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Registrar actividad
    addSharedActivity('Abrió modal para vaciar papelera completa', 'modal');
}

function closeEmptyTrashModal() {
    elements.emptyTrashModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function confirmEmptyTrash() {
    const count = elementosEliminados.length;
    
    // Limpiar todos los elementos
    elementosEliminados = [];
    favoritos = [];
    
    saveToLocalStorage();
    updateStats();
    renderTable();
    renderFavorites();
    updateFavoritesCount();
    closeEmptyTrashModal();
    
    // También limpiar favoritos compartidos
    clearAllSharedFavorites();
    
    addNotification('delete', 'Papelera vaciada', `Se eliminaron permanentemente ${count} elementos`);
    
    if (userSettings.notifications) {
        showNotification(`Papelera vaciada: ${count} elementos eliminados permanentemente`, 'success');
    }
    
    // Registrar actividad
    addSharedActivity(`Vació la papelera completa (${count} elementos eliminados)`, 'delete');
}

function toggleFavorite(elementId) {
    const elemento = elementosEliminados.find(e => e.id === elementId);
    if (!elemento) return;
    
    const favoriteIndex = favoritos.findIndex(f => f.id === elementId);
    
    if (favoriteIndex === -1) {
        // Agregar a favoritos usando función compartida
        addSharedFavorite(elementId, elemento.nombre, `${elemento.tipo} - ${elemento.estado}`, 'papelera');
        
        // También agregar al sistema local de papelera
        favoritos.push(elemento);
        addNotification('favorite', 'Agregado a favoritos', `${elemento.nombre} se agregó a favoritos`);
        if (userSettings.notifications) {
            showNotification(`${elemento.nombre} agregado a favoritos`, 'success');
        }
    } else {
        // Quitar de favoritos usando función compartida
        removeSharedFavorite(elementId);
        
        // También quitar del sistema local de papelera
        favoritos.splice(favoriteIndex, 1);
        addNotification('favorite', 'Quitado de favoritos', `${elemento.nombre} se quitó de favoritos`);
        if (userSettings.notifications) {
            showNotification(`${elemento.nombre} quitado de favoritos`, 'success');
        }
    }
    
    saveToLocalStorage();
    updateFavoritesCount();
    renderTable();
    renderFavorites();
    
    // Registrar actividad
    addSharedActivity(`${favoriteIndex === -1 ? 'Agregó' : 'Quitó'} ${elemento.nombre} ${favoriteIndex === -1 ? 'a' : 'de'} favoritos`, 'favorite');
}

// Funciones de filtros
function clearAllFilters() {
    if (elements.tipoFilter) elements.tipoFilter.value = '';
    if (elements.usuarioFilter) elements.usuarioFilter.value = '';
    if (elements.origenFilter) elements.origenFilter.value = '';
    if (elements.fechaInicio) elements.fechaInicio.value = '';
    if (elements.fechaFin) elements.fechaFin.value = '';
    
    filtrosActivos = {
        tipo: '',
        usuario: '',
        origen: '',
        fechaInicio: '',
        fechaFin: ''
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
    addSharedActivity('Limpió todos los filtros en papelera', 'filter');
}

function applyFilters() {
    filtrosActivos = {
        tipo: elements.tipoFilter ? elements.tipoFilter.value : '',
        usuario: elements.usuarioFilter ? elements.usuarioFilter.value : '',
        origen: elements.origenFilter ? elements.origenFilter.value : '',
        fechaInicio: elements.fechaInicio ? elements.fechaInicio.value : '',
        fechaFin: elements.fechaFin ? elements.fechaFin.value : ''
    };
    
    let filteredElementos = elementosEliminados;
    
    if (filtrosActivos.tipo) {
        filteredElementos = filteredElementos.filter(e => e.tipo === filtrosActivos.tipo);
    }
    
    if (filtrosActivos.usuario) {
        filteredElementos = filteredElementos.filter(e => e.usuario === filtrosActivos.usuario);
    }
    
    if (filtrosActivos.origen) {
        filteredElementos = filteredElementos.filter(e => e.origen === filtrosActivos.origen);
    }
    
    if (filtrosActivos.fechaInicio) {
        filteredElementos = filteredElementos.filter(e => e.fechaEliminacion >= filtrosActivos.fechaInicio);
    }
    
    if (filtrosActivos.fechaFin) {
        filteredElementos = filteredElementos.filter(e => e.fechaEliminacion <= filtrosActivos.fechaFin);
    }
    
    saveToLocalStorage();
    
    // Si está en vista de cuadrícula, renderizar grid con datos filtrados
    if (document.querySelector('.table-section').classList.contains('grid-view')) {
        renderGridView(filteredElementos);
    } else {
        renderTable(filteredElementos);
    }
    
    if (userSettings.notifications) {
        showNotification(`Filtros aplicados: ${filteredElementos.length} elementos encontrados`, 'success');
    }
    
    // Registrar actividad
    const activeFilters = Object.entries(filtrosActivos).filter(([key, value]) => value !== '').length;
    addSharedActivity(`Aplicó ${activeFilters} filtros en papelera`, 'filter');
}

function loadFilters() {
    if (elements.tipoFilter) elements.tipoFilter.value = filtrosActivos.tipo;
    if (elements.usuarioFilter) elements.usuarioFilter.value = filtrosActivos.usuario;
    if (elements.origenFilter) elements.origenFilter.value = filtrosActivos.origen;
    if (elements.fechaInicio) elements.fechaInicio.value = filtrosActivos.fechaInicio;
    if (elements.fechaFin) elements.fechaFin.value = filtrosActivos.fechaFin;
}

// Funciones compartidas del sistema
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
        localStorage.setItem('papeleraViewMode', 'table');
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
        localStorage.setItem('papeleraViewMode', 'grid');
    }
    
    // Registrar actividad
    addSharedActivity(`Cambió a vista de ${isGridView ? 'tabla' : 'cuadrícula'} en papelera`, 'view');
}

function renderGridView(filteredElementos = null) {
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
    
    // Usar datos filtrados si se proporcionan, sino usar todos los elementos
    const dataToRender = filteredElementos || elementosEliminados;
    
    if (dataToRender.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-trash-alt" style="font-size: 48px; margin-bottom: 15px; display: block; opacity: 0.5;"></i>
                ${filteredElementos ? 'No se encontraron elementos' : 'La papelera está vacía'}
            </div>
        `;
    } else {
        dataToRender.forEach(elemento => {
            const isFavorite = favoritos.some(f => f.id === elemento.id);
            const truncatedDesc = elemento.descripcion.length > 120 
                ? elemento.descripcion.substring(0, 120) + '...' 
                : elemento.descripcion;
            
            const card = document.createElement('div');
            card.className = 'ficha-card trash-card';
            card.innerHTML = `
                <div class="ficha-card-header">
                    <h3 class="ficha-code">${elemento.nombre}</h3>
                    <div class="ficha-card-actions">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                                onclick="toggleFavorite(${elemento.id})" 
                                title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="restore-btn" onclick="openRestoreModal(${elemento.id})" title="Restaurar">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="edit-btn" onclick="viewElementDetails(${elemento.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="delete-btn" onclick="openDeletePermanentModal(${elemento.id})" title="Eliminar permanentemente">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="trash-card-info">
                    <div class="trash-card-field">
                        <span class="type-badge type-${elemento.tipo.toLowerCase()}">
                            <i class="fas fa-${getTypeIcon(elemento.tipo)}"></i>
                            ${elemento.tipo}
                        </span>
                    </div>
                    <div class="trash-card-field">
                        <i class="fas fa-user"></i>
                        <span>${elemento.usuario}</span>
                    </div>
                    <div class="trash-card-field">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(elemento.fechaEliminacion)}</span>
                    </div>
                    <div class="trash-card-field">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${elemento.origen}</span>
                    </div>
                    <div class="trash-text-preview">
                        ${truncatedDesc}
                    </div>
                </div>
                <div class="ficha-card-footer">
                    <span class="status-badge status-eliminado">
                        <i class="fas fa-trash-alt"></i>
                        Eliminado
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
        'restore': 'fas fa-undo',
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
                <p>No tienes elementos favoritos aún</p>
                <small>Haz clic en el corazón de cualquier elemento para agregarlo a favoritos</small>
            </div>
        `;
        return;
    }
    
    elements.favoritesList.innerHTML = '';
    
    favoritos.forEach(elemento => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.innerHTML = `
            <div class="favorite-info">
                <h4>${elemento.nombre}</h4>
                <p>${elemento.tipo} - ${elemento.estado}</p>
            </div>
            <button class="remove-favorite" onclick="toggleFavorite(${elemento.id})" title="Quitar de favoritos">
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

// Funciones para cerrar paneles (usar funciones compartidas cuando sea posible)
function closeNotificationPanel() {
    if (elements.notificationPanel) {
        elements.notificationPanel.classList.remove('active');
    }
}

function closeFavoritesPanel() {
    if (elements.favoritesPanel) {
        elements.favoritesPanel.classList.remove('active');
    }
}

function closeUserPanel() {
    if (elements.userPanel) {
        elements.userPanel.classList.remove('active');
    }
}

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
    addSharedActivity(`Limpió ${count} favoritos de papelera`, 'clear');
}

// Funciones globales para onclick
window.openRestoreModal = openRestoreModal;
window.openDeletePermanentModal = openDeletePermanentModal;
window.viewElementDetails = viewElementDetails;
window.toggleFavorite = toggleFavorite;