// ===== SISTEMA DE COMENTARIOS - GESTIÓN DE FICHAS =====

// Estado global de la aplicación de comentarios
let comentarios = [];
let favoritos = [];
let notificaciones = [];
let actividades = [];
let userSettings = {
    theme: 'dark',
    notifications: true
};
let currentViewingId = null;
let filtrosActivos = {
    rol: '',
    estado: '',
    ficha: '',
    fechaInicio: '',
    fechaFin: ''
};

// Elementos del DOM
const elements = {
    // Estadísticas
    totalComentarios: document.getElementById('total-comentarios'),
    comentariosInstructores: document.getElementById('comentarios-instructores'),
    comentariosAprendices: document.getElementById('comentarios-aprendices'),
    pendientesRevision: document.getElementById('pendientes-revision'),
    
    // Tabla
    comentariosTbody: document.getElementById('comentarios-tbody'),
    searchInput: document.getElementById('search-input'),
    
    // Header
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
    rolFilter: document.getElementById('rol-filter'),
    estadoFilter: document.getElementById('estado-filter'),
    fichaFilter: document.getElementById('ficha-filter'),
    fechaInicio: document.getElementById('fecha-inicio'),
    fechaFin: document.getElementById('fecha-fin'),
    clearFilters: document.getElementById('clear-filters'),
    applyFilters: document.getElementById('apply-filters'),
    
    // Modales
    newCommentBtn: document.getElementById('new-comment-btn'),
    newCommentModal: document.getElementById('new-comment-modal'),
    newCommentClose: document.getElementById('new-comment-close'),
    cancelCommentBtn: document.getElementById('cancel-comment-btn'),
    commentForm: document.getElementById('comment-form'),
    
    viewCommentModal: document.getElementById('view-comment-modal'),
    viewCommentClose: document.getElementById('view-comment-close'),
    commentDetails: document.getElementById('comment-details'),
    
    // Menú lateral
    sidebarToggle: document.getElementById('sidebar-toggle'),
    sidebar: document.querySelector('.sidebar'),
    
    // Notificaciones
    notifications: document.getElementById('notifications')
};

// Funciones de localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('comentarios', JSON.stringify(comentarios));
        localStorage.setItem('comentariosFavoritos', JSON.stringify(favoritos));
        localStorage.setItem('comentariosNotificaciones', JSON.stringify(notificaciones));
        localStorage.setItem('comentariosActividades', JSON.stringify(actividades));
        localStorage.setItem('comentariosUserSettings', JSON.stringify(userSettings));
        localStorage.setItem('comentariosFiltros', JSON.stringify(filtrosActivos));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedComentarios = localStorage.getItem('comentarios');
        const savedFavoritos = localStorage.getItem('comentariosFavoritos');
        const savedNotificaciones = localStorage.getItem('comentariosNotificaciones');
        const savedActividades = localStorage.getItem('comentariosActividades');
        const savedUserSettings = localStorage.getItem('comentariosUserSettings');
        const savedFiltros = localStorage.getItem('comentariosFiltros');
        
        if (savedComentarios) {
            comentarios = JSON.parse(savedComentarios);
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
    
    // Solo cargar datos de ejemplo si no hay comentarios guardados
    if (comentarios.length === 0) {
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
    const savedViewMode = localStorage.getItem('comentariosViewMode');
    if (savedViewMode === 'grid') {
        toggleGridView();
    }
}

function setupEventListeners() {
    // Formulario nuevo comentario
    elements.newCommentBtn.addEventListener('click', openNewCommentModal);
    elements.newCommentClose.addEventListener('click', closeNewCommentModal);
    elements.cancelCommentBtn.addEventListener('click', closeNewCommentModal);
    elements.newCommentModal.addEventListener('click', function(e) {
        if (e.target === elements.newCommentModal) {
            closeNewCommentModal();
        }
    });
    
    // Modal ver comentario
    elements.viewCommentClose.addEventListener('click', closeViewModal);
    elements.viewCommentModal.addEventListener('click', function(e) {
        if (e.target === elements.viewCommentModal) {
            closeViewModal();
        }
    });
    
    // Modal responder comentario
    const responseModal = document.getElementById('response-modal');
    const responseClose = document.getElementById('response-close');
    const cancelResponseBtn = document.getElementById('cancel-response-btn');
    const responseForm = document.getElementById('response-form');
    
    if (responseClose) {
        responseClose.addEventListener('click', closeResponseModal);
    }
    if (cancelResponseBtn) {
        cancelResponseBtn.addEventListener('click', closeResponseModal);
    }
    if (responseModal) {
        responseModal.addEventListener('click', function(e) {
            if (e.target === responseModal) {
                closeResponseModal();
            }
        });
    }
    if (responseForm) {
        responseForm.addEventListener('submit', handleResponseSubmit);
    }
    
    // Formulario
    elements.commentForm.addEventListener('submit', handleFormSubmit);
    
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
            closeNewCommentModal();
            closeViewModal();
            closeResponseModal();
            closeNotificationPanel();
            closeFavoritesPanel();
            closeUserPanel();
        }
    });
}

function loadSampleData() {
    const sampleComentarios = [
        {
            id: 1,
            usuario: 'Juan Pérez',
            rol: 'Aprendiz',
            ficha: 'ADSI-001',
            comentario: 'Instructor, tengo dificultades con la implementación de la base de datos. ¿Podría ayudarme con las relaciones entre tablas?',
            fecha: '2024-02-04',
            estado: 'Pendiente',
            importante: true,
            respuesta: null
        },
        {
            id: 2,
            usuario: 'María González',
            rol: 'Aprendiz',
            ficha: 'ADSI-001',
            comentario: 'He completado el módulo de programación web. ¿Cuándo podemos revisar mi proyecto?',
            fecha: '2024-02-04',
            estado: 'Publicado',
            importante: false,
            respuesta: {
                texto: 'Excelente trabajo María. Revisaremos tu proyecto el viernes en la tarde.',
                fecha: '2024-02-04',
                instructor: 'Carlos Rodríguez'
            }
        },
        {
            id: 3,
            usuario: 'Carlos López',
            rol: 'Aprendiz',
            ficha: 'PROG-004',
            comentario: 'Instructor, no entiendo bien el concepto de programación orientada a objetos. ¿Podría explicarlo nuevamente?',
            fecha: '2024-02-03',
            estado: 'Pendiente',
            importante: true,
            respuesta: null
        },
        {
            id: 4,
            usuario: 'Ana Martínez',
            rol: 'Aprendiz',
            ficha: 'CONT-002',
            comentario: 'He terminado los ejercicios de contabilidad básica. ¿Hay material adicional para practicar?',
            fecha: '2024-02-03',
            estado: 'Publicado',
            importante: false,
            respuesta: {
                texto: 'Muy bien Ana. Te enviaré ejercicios adicionales por correo electrónico.',
                fecha: '2024-02-03',
                instructor: 'Carlos Rodríguez'
            }
        },
        {
            id: 5,
            usuario: 'Luis Torres',
            rol: 'Aprendiz',
            ficha: 'GEST-003',
            comentario: 'Instructor, necesito orientación sobre el proyecto final de gestión administrativa.',
            fecha: '2024-02-02',
            estado: 'Pendiente',
            importante: true,
            respuesta: null
        }
    ];
    
    // Agregar notificaciones iniciales
    const sampleNotifications = [
        {
            id: Date.now() - 3,
            type: 'add',
            title: 'Nuevo comentario',
            message: 'Juan Pérez agregó un comentario en ADSI-001',
            time: 'Hace 1 hora',
            unread: true
        },
        {
            id: Date.now() - 2,
            type: 'status',
            title: 'Estado actualizado',
            message: 'Comentario de María Rodríguez marcado como Publicado',
            time: 'Hace 2 horas',
            unread: true
        }
    ];
    
    comentarios = sampleComentarios;
    notificaciones = sampleNotifications;
    saveToLocalStorage();
    updateStats();
    renderTable();
    renderNotifications();
}

function updateStats() {
    const total = comentarios.length;
    const instructores = comentarios.filter(c => c.rol === 'Instructor').length;
    const aprendices = comentarios.filter(c => c.rol === 'Aprendiz').length;
    const pendientes = comentarios.filter(c => c.estado === 'Pendiente').length;
    
    elements.totalComentarios.textContent = total;
    elements.comentariosInstructores.textContent = instructores;
    elements.comentariosAprendices.textContent = aprendices;
    elements.pendientesRevision.textContent = pendientes;
}

function renderTable(filteredComentarios = null) {
    const dataToRender = filteredComentarios || comentarios;
    
    elements.comentariosTbody.innerHTML = '';
    
    if (dataToRender.length === 0) {
        elements.comentariosTbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                    No se encontraron comentarios
                </td>
            </tr>
        `;
        return;
    }
    
    dataToRender.forEach(comentario => {
        const isFavorite = favoritos.some(f => f.id === comentario.id);
        const truncatedComment = comentario.comentario.length > 50 
            ? comentario.comentario.substring(0, 50) + '...' 
            : comentario.comentario;
            
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${comentario.usuario}</td>
            <td>
                <span class="role-badge role-${comentario.rol.toLowerCase()}">
                    <i class="fas fa-${comentario.rol === 'Instructor' ? 'chalkboard-teacher' : 'user-graduate'}"></i>
                    ${comentario.rol}
                </span>
            </td>
            <td>${comentario.ficha}</td>
            <td>
                <div class="comment-content">
                    <span class="comment-preview" title="${comentario.comentario}">
                        ${truncatedComment}
                    </span>
                    ${comentario.respuesta ? `
                        <div class="instructor-response">
                            <i class="fas fa-reply"></i>
                            <small>Respondido por instructor</small>
                        </div>
                    ` : ''}
                </div>
            </td>
            <td>${formatDate(comentario.fecha)}</td>
            <td>
                <span class="status-badge status-${comentario.estado.toLowerCase().replace(' ', '-')}">
                    ${comentario.estado}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="toggleFavorite(${comentario.id})" 
                            title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                        <i class="fas fa-heart"></i>
                    </button>
                    ${comentario.rol === 'Aprendiz' && !comentario.respuesta ? `
                        <button class="edit-btn respond-btn" onclick="openResponseModal(${comentario.id})" title="Responder comentario">
                            <i class="fas fa-reply"></i>
                        </button>
                    ` : ''}
                    <button class="edit-btn" onclick="viewComment(${comentario.id})" title="Ver comentario">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn ${comentario.importante ? 'active' : ''}" 
                            onclick="toggleImportant(${comentario.id})" 
                            title="${comentario.importante ? 'Quitar importancia' : 'Marcar como importante'}">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteComment(${comentario.id})" title="Eliminar comentario">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // Animación de entrada
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        elements.comentariosTbody.appendChild(row);
        
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
    
    const filteredComentarios = comentarios.filter(comentario => 
        comentario.usuario.toLowerCase().includes(searchTerm) ||
        comentario.rol.toLowerCase().includes(searchTerm) ||
        comentario.ficha.toLowerCase().includes(searchTerm) ||
        comentario.comentario.toLowerCase().includes(searchTerm) ||
        comentario.estado.toLowerCase().includes(searchTerm)
    );
    
    // Si está en vista de cuadrícula, renderizar grid con datos filtrados
    if (document.querySelector('.table-section').classList.contains('grid-view')) {
        renderGridView(filteredComentarios);
    } else {
        renderTable(filteredComentarios);
    }
    
    if (searchBox) {
        setTimeout(() => {
            searchBox.classList.remove('searching');
        }, 1000);
    }
    
    // Registrar actividad de búsqueda
    if (searchTerm.length > 2) { // Solo registrar búsquedas significativas
        addSharedActivity(`Buscó "${searchTerm}" en comentarios (${filteredComentarios.length} resultados)`, 'search');
    }
}

function openNewCommentModal() {
    elements.newCommentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus en el primer input
    setTimeout(() => {
        document.getElementById('comment-rol').focus();
    }, 300);
    
    // Registrar actividad
    addSharedActivity('Abrió modal para crear nuevo comentario', 'modal');
}

function closeNewCommentModal() {
    elements.newCommentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    elements.commentForm.reset();
    
    // Registrar actividad solo si no se creó un comentario
    addSharedActivity('Cerró modal de crear comentario', 'modal');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const newComment = {
        id: Date.now(),
        usuario: document.getElementById('comment-usuario').value.trim(),
        rol: document.getElementById('comment-rol').value,
        ficha: document.getElementById('comment-ficha').value,
        comentario: document.getElementById('comment-texto').value.trim(),
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Pendiente',
        importante: false
    };
    
    comentarios.unshift(newComment); // Agregar al inicio
    saveToLocalStorage();
    closeNewCommentModal();
    updateStats();
    renderTable();
    
    addNotification('add', 'Nuevo comentario', `Comentario creado para ${newComment.ficha}`);
    
    if (userSettings.notifications) {
        showNotification(`Comentario creado para ${newComment.ficha}`, 'success');
    }
    
    // Registrar actividad
    addSharedActivity(`Creó nuevo comentario en ${newComment.ficha}`, 'create');
}

function viewComment(commentId) {
    const comentario = comentarios.find(c => c.id === commentId);
    if (!comentario) return;
    
    currentViewingId = commentId;
    
    let detailsHTML = `
        <div class="comment-info">
            <div class="comment-field">
                <label>Usuario:</label>
                <p>${comentario.usuario}</p>
            </div>
            <div class="comment-field">
                <label>Rol:</label>
                <span class="role-badge role-${comentario.rol.toLowerCase()}">
                    <i class="fas fa-${comentario.rol === 'Instructor' ? 'chalkboard-teacher' : 'user-graduate'}"></i>
                    ${comentario.rol}
                </span>
            </div>
            <div class="comment-field">
                <label>Ficha:</label>
                <p>${comentario.ficha}</p>
            </div>
            <div class="comment-field">
                <label>Fecha:</label>
                <p>${formatDate(comentario.fecha)}</p>
            </div>
            <div class="comment-field">
                <label>Estado:</label>
                <span class="status-badge status-${comentario.estado.toLowerCase().replace(' ', '-')}">${comentario.estado}</span>
            </div>
            <div class="comment-field">
                <label>Importante:</label>
                <span class="importance-badge ${comentario.importante ? 'important' : 'normal'}">
                    <i class="fas fa-${comentario.importante ? 'star' : 'star-o'}"></i>
                    ${comentario.importante ? 'Sí' : 'No'}
                </span>
            </div>
            <div class="comment-field full-width">
                <label>Comentario:</label>
                <div class="comment-text">${comentario.comentario}</div>
            </div>
    `;
    
    // Agregar respuesta si existe
    if (comentario.respuesta) {
        detailsHTML += `
            <div class="comment-field full-width">
                <label>Respuesta del Instructor:</label>
                <div class="instructor-response-detail">
                    <div class="response-header">
                        <span class="instructor-name">${comentario.respuesta.instructor}</span>
                        <span class="response-date">${formatDate(comentario.respuesta.fecha)}</span>
                    </div>
                    <div class="response-text">${comentario.respuesta.texto}</div>
                </div>
            </div>
        `;
    }
    
    detailsHTML += `</div>`;
    
    elements.commentDetails.innerHTML = detailsHTML;
    elements.viewCommentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Registrar actividad
    addSharedActivity(`Visualizó comentario de ${comentario.usuario}`, 'view');
}

function closeViewModal() {
    elements.viewCommentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentViewingId = null;
}

function deleteComment(commentId) {
    if (confirm('¿Estás seguro de que quieres enviar este comentario a la papelera?')) {
        const commentIndex = comentarios.findIndex(c => c.id === commentId);
        if (commentIndex === -1) return;
        
        const deletedComment = comentarios[commentIndex];
        
        // Enviar a papelera en lugar de eliminar permanentemente
        const elementoEliminado = {
            id: deletedComment.id,
            tipo: 'Comentario',
            nombre: `Comentario de ${deletedComment.usuario}`,
            descripcion: `Comentario sobre ${deletedComment.ficha}: ${deletedComment.comentario.substring(0, 100)}${deletedComment.comentario.length > 100 ? '...' : ''}`,
            usuario: 'Carlos Rodríguez', // Usuario actual (instructor)
            fechaEliminacion: new Date().toISOString().split('T')[0],
            origen: 'Comentarios',
            estado: 'Eliminado',
            datosOriginales: {
                usuario: deletedComment.usuario,
                rol: deletedComment.rol,
                ficha: deletedComment.ficha,
                comentario: deletedComment.comentario,
                fecha: deletedComment.fecha,
                estado: deletedComment.estado,
                importante: deletedComment.importante,
                respuesta: deletedComment.respuesta
            }
        };
        
        // Agregar a papelera
        let elementosEliminados = JSON.parse(localStorage.getItem('elementosEliminados') || '[]');
        elementosEliminados.unshift(elementoEliminado);
        localStorage.setItem('elementosEliminados', JSON.stringify(elementosEliminados));
        
        // Eliminar de comentarios
        comentarios.splice(commentIndex, 1);
        
        // Eliminar de favoritos si existe
        const favoriteIndex = favoritos.findIndex(f => f.id === commentId);
        if (favoriteIndex !== -1) {
            favoritos.splice(favoriteIndex, 1);
            updateFavoritesCount();
            // También eliminar del sistema compartido
            removeSharedFavorite(commentId);
        }
        
        saveToLocalStorage();
        updateStats();
        renderTable();
        renderFavorites();
        
        addNotification('delete', 'Comentario enviado a papelera', `Se envió el comentario de ${deletedComment.usuario} a la papelera`);
        
        if (userSettings.notifications) {
            showNotification(`Comentario de ${deletedComment.usuario} enviado a papelera`, 'success');
        }
        
        // Registrar actividad
        addSharedActivity(`Envió comentario de ${deletedComment.usuario} a la papelera`, 'delete');
    }
}

function toggleFavorite(commentId) {
    const comentario = comentarios.find(c => c.id === commentId);
    if (!comentario) return;
    
    const favoriteIndex = favoritos.findIndex(f => f.id === commentId);
    
    if (favoriteIndex === -1) {
        // Agregar a favoritos usando función compartida
        addSharedFavorite(commentId, `Comentario de ${comentario.usuario}`, `${comentario.ficha} - ${comentario.estado}`, 'comentario');
        
        // También agregar al sistema local de comentarios
        favoritos.push(comentario);
        addNotification('favorite', 'Agregado a favoritos', `El comentario de ${comentario.usuario} se agregó a favoritos`);
        if (userSettings.notifications) {
            showNotification(`Comentario de ${comentario.usuario} agregado a favoritos`, 'success');
        }
    } else {
        // Quitar de favoritos usando función compartida
        removeSharedFavorite(commentId);
        
        // También quitar del sistema local de comentarios
        favoritos.splice(favoriteIndex, 1);
        addNotification('favorite', 'Quitado de favoritos', `El comentario de ${comentario.usuario} se quitó de favoritos`);
        if (userSettings.notifications) {
            showNotification(`Comentario de ${comentario.usuario} quitado de favoritos`, 'success');
        }
    }
    
    saveToLocalStorage();
    updateFavoritesCount();
    renderTable();
    renderFavorites();
    
    // Registrar actividad
    addSharedActivity(`${favoriteIndex === -1 ? 'Agregó' : 'Quitó'} comentario de ${comentario.usuario} ${favoriteIndex === -1 ? 'a' : 'de'} favoritos`, 'favorite');
}

function toggleImportant(commentId) {
    const comentario = comentarios.find(c => c.id === commentId);
    if (!comentario) return;
    
    comentario.importante = !comentario.importante;
    
    saveToLocalStorage();
    renderTable();
    
    const action = comentario.importante ? 'marcó como importante' : 'quitó importancia de';
    addNotification('status', 'Importancia actualizada', `Se ${action} el comentario de ${comentario.usuario}`);
    
    if (userSettings.notifications) {
        showNotification(`Comentario ${comentario.importante ? 'marcado como importante' : 'importancia removida'}`, 'success');
    }
    
    // Registrar actividad
    addSharedActivity(`${comentario.importante ? 'Marcó como importante' : 'Quitó importancia de'} comentario de ${comentario.usuario}`, 'status');
}

// Funciones de filtros
function clearAllFilters() {
    if (elements.rolFilter) elements.rolFilter.value = '';
    if (elements.estadoFilter) elements.estadoFilter.value = '';
    if (elements.fichaFilter) elements.fichaFilter.value = '';
    if (elements.fechaInicio) elements.fechaInicio.value = '';
    if (elements.fechaFin) elements.fechaFin.value = '';
    
    filtrosActivos = {
        rol: '',
        estado: '',
        ficha: '',
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
    addSharedActivity('Limpió todos los filtros en comentarios', 'filter');
}

function applyFilters() {
    filtrosActivos = {
        rol: elements.rolFilter ? elements.rolFilter.value : '',
        estado: elements.estadoFilter ? elements.estadoFilter.value : '',
        ficha: elements.fichaFilter ? elements.fichaFilter.value : '',
        fechaInicio: elements.fechaInicio ? elements.fechaInicio.value : '',
        fechaFin: elements.fechaFin ? elements.fechaFin.value : ''
    };
    
    let filteredComentarios = comentarios;
    
    if (filtrosActivos.rol) {
        filteredComentarios = filteredComentarios.filter(c => c.rol === filtrosActivos.rol);
    }
    
    if (filtrosActivos.estado) {
        filteredComentarios = filteredComentarios.filter(c => c.estado === filtrosActivos.estado);
    }
    
    if (filtrosActivos.ficha) {
        filteredComentarios = filteredComentarios.filter(c => c.ficha === filtrosActivos.ficha);
    }
    
    if (filtrosActivos.fechaInicio) {
        filteredComentarios = filteredComentarios.filter(c => c.fecha >= filtrosActivos.fechaInicio);
    }
    
    if (filtrosActivos.fechaFin) {
        filteredComentarios = filteredComentarios.filter(c => c.fecha <= filtrosActivos.fechaFin);
    }
    
    saveToLocalStorage();
    
    // Si está en vista de cuadrícula, renderizar grid con datos filtrados
    if (document.querySelector('.table-section').classList.contains('grid-view')) {
        renderGridView(filteredComentarios);
    } else {
        renderTable(filteredComentarios);
    }
    
    if (userSettings.notifications) {
        showNotification(`Filtros aplicados: ${filteredComentarios.length} comentarios encontrados`, 'success');
    }
    
    // Registrar actividad
    const activeFilters = Object.entries(filtrosActivos).filter(([key, value]) => value !== '').length;
    addSharedActivity(`Aplicó ${activeFilters} filtros en comentarios`, 'filter');
}

function loadFilters() {
    if (elements.rolFilter) elements.rolFilter.value = filtrosActivos.rol;
    if (elements.estadoFilter) elements.estadoFilter.value = filtrosActivos.estado;
    if (elements.fichaFilter) elements.fichaFilter.value = filtrosActivos.ficha;
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
        localStorage.setItem('comentariosViewMode', 'table');
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
        localStorage.setItem('comentariosViewMode', 'grid');
    }
    
    // Registrar actividad
    addSharedActivity(`Cambió a vista de ${isGridView ? 'tabla' : 'cuadrícula'} en comentarios`, 'view');
}

function renderGridView(filteredComentarios = null) {
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
    
    // Usar datos filtrados si se proporcionan, sino usar todos los comentarios
    const dataToRender = filteredComentarios || comentarios;
    
    if (dataToRender.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                No se encontraron comentarios
            </div>
        `;
    } else {
        dataToRender.forEach(comentario => {
            const isFavorite = favoritos.some(f => f.id === comentario.id);
            const truncatedComment = comentario.comentario.length > 100 
                ? comentario.comentario.substring(0, 100) + '...' 
                : comentario.comentario;
            
            const card = document.createElement('div');
            card.className = 'ficha-card';
            card.innerHTML = `
                <div class="ficha-card-header">
                    <h3 class="ficha-code">${comentario.usuario}</h3>
                    <div class="ficha-card-actions">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                                onclick="toggleFavorite(${comentario.id})" 
                                title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="edit-btn" onclick="viewComment(${comentario.id})" title="Ver comentario">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="edit-btn ${comentario.importante ? 'active' : ''}" 
                                onclick="toggleImportant(${comentario.id})" 
                                title="${comentario.importante ? 'Quitar importancia' : 'Marcar como importante'}">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="delete-btn" onclick="deleteComment(${comentario.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="comment-card-info">
                    <div class="comment-card-field">
                        <span class="role-badge role-${comentario.rol.toLowerCase()}">
                            <i class="fas fa-${comentario.rol === 'Instructor' ? 'chalkboard-teacher' : 'user-graduate'}"></i>
                            ${comentario.rol}
                        </span>
                    </div>
                    <div class="comment-card-field">
                        <i class="fas fa-folder"></i>
                        <span>${comentario.ficha}</span>
                    </div>
                    <div class="comment-card-field">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(comentario.fecha)}</span>
                    </div>
                    <div class="comment-text-preview">
                        ${truncatedComment}
                    </div>
                </div>
                <div class="ficha-card-footer">
                    <span class="status-badge status-${comentario.estado.toLowerCase().replace(' ', '-')}">
                        ${comentario.estado}
                    </span>
                    ${comentario.importante ? '<i class="fas fa-star important-indicator" title="Importante"></i>' : ''}
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
                <p>No tienes comentarios favoritos aún</p>
                <small>Haz clic en el corazón de cualquier comentario para agregarlo a favoritos</small>
            </div>
        `;
        return;
    }
    
    elements.favoritesList.innerHTML = '';
    
    favoritos.forEach(comentario => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.innerHTML = `
            <div class="favorite-info">
                <h4>${comentario.usuario}</h4>
                <p>${comentario.ficha} - ${comentario.estado}</p>
            </div>
            <button class="remove-favorite" onclick="toggleFavorite(${comentario.id})" title="Quitar de favoritos">
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
    addSharedActivity(`Limpió ${count} favoritos de comentarios`, 'clear');
}

// Funciones globales para onclick
window.viewComment = viewComment;
window.deleteComment = deleteComment;
window.toggleFavorite = toggleFavorite;
window.toggleImportant = toggleImportant;
window.openResponseModal = openResponseModal;

// Funciones de respuesta a comentarios
function openResponseModal(commentId) {
    const comentario = comentarios.find(c => c.id === commentId);
    if (!comentario) return;
    
    currentViewingId = commentId;
    
    const originalCommentDiv = document.getElementById('original-comment');
    if (originalCommentDiv) {
        originalCommentDiv.innerHTML = `
            <div class="original-comment-content">
                <h4>Comentario Original</h4>
                <div class="comment-info">
                    <div class="comment-header">
                        <span class="role-badge role-aprendiz">
                            <i class="fas fa-user-graduate"></i>
                            ${comentario.usuario}
                        </span>
                        <span class="comment-date">${formatDate(comentario.fecha)}</span>
                    </div>
                    <div class="comment-text">
                        ${comentario.comentario}
                    </div>
                </div>
            </div>
        `;
    }
    
    const responseModal = document.getElementById('response-modal');
    if (responseModal) {
        responseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus en el textarea
        setTimeout(() => {
            const responseText = document.getElementById('response-text');
            if (responseText) responseText.focus();
        }, 300);
    }
    
    // Registrar actividad
    addSharedActivity(`Abrió modal para responder comentario de ${comentario.usuario}`, 'modal');
}

function closeResponseModal() {
    const responseModal = document.getElementById('response-modal');
    if (responseModal) {
        responseModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    const responseForm = document.getElementById('response-form');
    if (responseForm) {
        responseForm.reset();
    }
    
    currentViewingId = null;
}

function handleResponseSubmit(e) {
    e.preventDefault();
    
    if (!currentViewingId) return;
    
    const responseText = document.getElementById('response-text');
    if (!responseText || !responseText.value.trim()) return;
    
    const comentarioIndex = comentarios.findIndex(c => c.id === currentViewingId);
    if (comentarioIndex === -1) return;
    
    // Agregar respuesta al comentario
    comentarios[comentarioIndex].respuesta = {
        texto: responseText.value.trim(),
        fecha: new Date().toISOString().split('T')[0],
        instructor: 'Carlos Rodríguez'
    };
    
    // Cambiar estado a Publicado si estaba Pendiente
    if (comentarios[comentarioIndex].estado === 'Pendiente') {
        comentarios[comentarioIndex].estado = 'Publicado';
    }
    
    saveToLocalStorage();
    closeResponseModal();
    updateStats();
    renderTable();
    
    addNotification('add', 'Respuesta enviada', `Respuesta enviada a ${comentarios[comentarioIndex].usuario}`);
    
    if (userSettings.notifications) {
        showNotification(`Respuesta enviada a ${comentarios[comentarioIndex].usuario}`, 'success');
    }
    
    // Registrar actividad
    addSharedActivity(`Respondió comentario de ${comentarios[comentarioIndex].usuario}`, 'response');
}