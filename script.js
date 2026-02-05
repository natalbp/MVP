// Estado global de la aplicación
let fichas = [];
let favoritos = [];
let notificaciones = [];
let actividades = [];
let userSettings = {
    theme: 'dark',
    notifications: true
};
let currentEditingId = null;
let currentDeletingId = null;

// Funciones de localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('fichas', JSON.stringify(fichas));
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
        localStorage.setItem('actividades', JSON.stringify(actividades));
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedFichas = localStorage.getItem('fichas');
        const savedFavoritos = localStorage.getItem('favoritos');
        const savedNotificaciones = localStorage.getItem('notificaciones');
        const savedActividades = localStorage.getItem('actividades');
        const savedUserSettings = localStorage.getItem('userSettings');
        
        if (savedFichas) {
            fichas = JSON.parse(savedFichas);
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
    } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
    }
}

// Elementos del DOM
const elements = {
    // Estadísticas
    fichasActivas: document.getElementById('fichas-activas'),
    fichasInactivas: document.getElementById('fichas-inactivas'),
    totalInstructores: document.getElementById('total-instructores'),
    
    // Tabla
    fichasTbody: document.getElementById('fichas-tbody'),
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
    
    // Modal añadir ficha
    addFichaBtn: document.getElementById('add-ficha-btn'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalClose: document.getElementById('modal-close'),
    cancelBtn: document.getElementById('cancel-btn'),
    fichaForm: document.getElementById('ficha-form'),
    
    // Modal cambiar estado
    statusModalOverlay: document.getElementById('status-modal-overlay'),
    statusModalClose: document.getElementById('status-modal-close'),
    statusCancelBtn: document.getElementById('status-cancel-btn'),
    statusConfirmBtn: document.getElementById('status-confirm-btn'),
    statusMessage: document.getElementById('status-message'),
    
    // Modal eliminar ficha
    deleteModalOverlay: document.getElementById('delete-modal-overlay'),
    deleteModalClose: document.getElementById('delete-modal-close'),
    deleteCancelBtn: document.getElementById('delete-cancel-btn'),
    deleteConfirmBtn: document.getElementById('delete-confirm-btn'),
    deleteMessage: document.getElementById('delete-message'),
    
    // Menú de usuario
    userProfileBtn: document.getElementById('user-profile-btn'),
    userSettingsBtn: document.getElementById('user-settings-btn'),
    userActivityBtn: document.getElementById('user-activity-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Modales de usuario
    profileModalOverlay: document.getElementById('profile-modal-overlay'),
    profileModalClose: document.getElementById('profile-modal-close'),
    settingsModalOverlay: document.getElementById('settings-modal-overlay'),
    settingsModalClose: document.getElementById('settings-modal-close'),
    activityModalOverlay: document.getElementById('activity-modal-overlay'),
    activityModalClose: document.getElementById('activity-modal-close'),
    
    // Configuración de tema
    darkThemeBtn: document.getElementById('dark-theme-btn'),
    lightThemeBtn: document.getElementById('light-theme-btn'),
    themeDark: document.getElementById('theme-dark'),
    themeLight: document.getElementById('theme-light'),
    notificationsToggle: document.getElementById('notifications-toggle'),
    
    // Menú lateral
    sidebarToggle: document.getElementById('sidebar-toggle'),
    sidebar: document.querySelector('.sidebar'),
    menuItems: document.querySelectorAll('.menu-item'),
    
    // Notificaciones
    notifications: document.getElementById('notifications')
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando aplicación de Fichas...');
    
    loadFromLocalStorage();
    initializeApp();
    setupEventListeners();
    
    // Solo cargar datos de ejemplo si no hay datos guardados
    if (fichas.length === 0) {
        console.log('📝 Cargando datos de ejemplo...');
        loadSampleData();
    }
    
    console.log('✅ Aplicación inicializada correctamente');
    console.log(`📊 Fichas cargadas: ${fichas.length}`);
});

// Función de inicialización consolidada
function initializeApp() {
    initializeTheme();
    initializeSidebar();
    updateStats();
    renderTable();
    renderNotifications();
    initializeCounters();
}

function setupEventListeners() {
    console.log('🔧 Configurando event listeners específicos de Fichas...');
    
    // Verificar que los elementos existan antes de agregar listeners
    if (!elements.addFichaBtn) {
        console.error('❌ Elemento add-ficha-btn no encontrado');
        return;
    }
    
    if (!elements.fichaForm) {
        console.error('❌ Elemento ficha-form no encontrado');
        return;
    }
    
    // Modal añadir ficha
    elements.addFichaBtn.addEventListener('click', openAddModal);
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', closeAddModal);
    }
    if (elements.cancelBtn) {
        elements.cancelBtn.addEventListener('click', closeAddModal);
    }
    if (elements.modalOverlay) {
        elements.modalOverlay.addEventListener('click', function(e) {
            if (e.target === elements.modalOverlay) {
                closeAddModal();
            }
        });
    }
    
    // Modal cambiar estado
    if (elements.statusModalClose) {
        elements.statusModalClose.addEventListener('click', closeStatusModal);
    }
    if (elements.statusCancelBtn) {
        elements.statusCancelBtn.addEventListener('click', closeStatusModal);
    }
    if (elements.statusModalOverlay) {
        elements.statusModalOverlay.addEventListener('click', function(e) {
            if (e.target === elements.statusModalOverlay) {
                closeStatusModal();
            }
        });
    }
    if (elements.statusConfirmBtn) {
        elements.statusConfirmBtn.addEventListener('click', confirmStatusChange);
    }
    
    // Modal eliminar ficha
    if (elements.deleteModalClose) {
        elements.deleteModalClose.addEventListener('click', closeDeleteModal);
    }
    if (elements.deleteCancelBtn) {
        elements.deleteCancelBtn.addEventListener('click', closeDeleteModal);
    }
    if (elements.deleteModalOverlay) {
        elements.deleteModalOverlay.addEventListener('click', function(e) {
            if (e.target === elements.deleteModalOverlay) {
                closeDeleteModal();
            }
        });
    }
    if (elements.deleteConfirmBtn) {
        elements.deleteConfirmBtn.addEventListener('click', confirmDeleteFicha);
    }
    
    // Formulario
    elements.fichaForm.addEventListener('submit', handleFormSubmit);
    
    // Búsqueda
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
    }
    
    // Grid view button (específico de fichas)
    if (elements.gridViewBtn) {
        elements.gridViewBtn.addEventListener('click', toggleGridView);
    }
    
    console.log('✅ Event listeners específicos de Fichas configurados correctamente');
}
// Función para panel de usuario - Usar funcionalidad compartida
function toggleUserPanel() {
    if (typeof toggleSharedUserPanel === 'function') {
        toggleSharedUserPanel();
    }
}

function closeUserPanel() {
    if (typeof closeSharedUserPanel === 'function') {
        closeSharedUserPanel();
    }
}

function loadSampleData() {
    const sampleFichas = [
        {
            id: 1,
            codigo: 'ADSI-001',
            formacion: 'Análisis y Desarrollo de Sistemas de Información',
            jornada: 'Mañana',
            instructor: 'Carlos Rodríguez',
            estado: 'Activo'
        },
        {
            id: 2,
            codigo: 'CONT-002',
            formacion: 'Contabilización de Operaciones Comerciales',
            jornada: 'Tarde',
            instructor: 'María González',
            estado: 'Activo'
        },
        {
            id: 3,
            codigo: 'GEST-003',
            formacion: 'Gestión Administrativa',
            jornada: 'Noche',
            instructor: 'Juan Pérez',
            estado: 'Inactivo'
        },
        {
            id: 4,
            codigo: 'PROG-004',
            formacion: 'Programación de Software',
            jornada: 'Mañana',
            instructor: 'Ana Martínez',
            estado: 'Activo'
        }
    ];
    
    // Agregar notificaciones iniciales
    const sampleNotifications = [
        {
            id: Date.now() - 3,
            type: 'add',
            title: 'Nueva ficha agregada',
            message: 'Se agregó la ficha PROG-004 al sistema',
            time: 'Hace 2 horas',
            unread: true
        },
        {
            id: Date.now() - 2,
            type: 'status',
            title: 'Estado actualizado',
            message: 'La ficha GEST-003 cambió a estado Inactivo',
            time: 'Hace 4 horas',
            unread: true
        },
        {
            id: Date.now() - 1,
            type: 'favorite',
            title: 'Recordatorio',
            message: 'Revisar fichas pendientes de esta semana',
            time: 'Hace 1 día',
            unread: false
        }
    ];
    
    fichas = sampleFichas;
    notificaciones = sampleNotifications;
    saveToLocalStorage();
    updateStats();
    renderTable();
    renderNotifications();
}

function updateStats() {
    const activas = fichas.filter(f => f.estado === 'Activo').length;
    const inactivas = fichas.filter(f => f.estado === 'Inactivo').length;
    const instructores = new Set(fichas.map(f => f.instructor)).size;
    
    // Actualización directa sin animación
    elements.fichasActivas.textContent = activas;
    elements.fichasInactivas.textContent = inactivas;
    elements.totalInstructores.textContent = instructores;
}

function renderTable(filteredFichas = null) {
    console.log('🔄 Renderizando tabla...');
    
    if (!elements.fichasTbody) {
        console.error('❌ Elemento fichas-tbody no encontrado');
        return;
    }
    
    const dataToRender = filteredFichas || fichas;
    console.log(`📊 Renderizando ${dataToRender.length} fichas`);
    
    elements.fichasTbody.innerHTML = '';
    
    if (dataToRender.length === 0) {
        elements.fichasTbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                    No se encontraron fichas
                </td>
            </tr>
        `;
        return;
    }
    
    dataToRender.forEach((ficha, index) => {
        const isFavorite = favoritos.some(f => f.id === ficha.id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ficha.codigo}</td>
            <td>${ficha.formacion}</td>
            <td>${ficha.instructor}</td>
            <td>
                <span class="status-badge status-${ficha.estado.toLowerCase()}" 
                      onclick="openStatusModal(${ficha.id})">
                    ${ficha.estado}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="toggleFavorite(${ficha.id})" 
                            title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="edit-btn" onclick="editFicha(${ficha.id})" title="Editar ficha">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="openDeleteModal(${ficha.id})" title="Eliminar ficha">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // Animación de entrada
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        elements.fichasTbody.appendChild(row);
        
        // Trigger animation
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 50);
    });
    
    console.log('✅ Tabla renderizada correctamente');
}

function handleSearch() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderTable();
        return;
    }
    
    const filteredFichas = fichas.filter(ficha => 
        ficha.codigo.toLowerCase().includes(searchTerm) ||
        ficha.formacion.toLowerCase().includes(searchTerm) ||
        ficha.instructor.toLowerCase().includes(searchTerm) ||
        ficha.estado.toLowerCase().includes(searchTerm)
    );
    
    renderTable(filteredFichas);
}

function openAddModal() {
    elements.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus en el primer input
    setTimeout(() => {
        document.getElementById('codigo').focus();
    }, 300);
}

function closeAddModal() {
    elements.modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    elements.fichaForm.reset();
}

function openStatusModal(fichaId) {
    const ficha = fichas.find(f => f.id === fichaId);
    if (!ficha) return;
    
    currentEditingId = fichaId;
    const newStatus = ficha.estado === 'Activo' ? 'Inactivo' : 'Activo';
    
    elements.statusMessage.textContent = 
        `Esta ficha está ${ficha.estado.toLowerCase()}. ¿Desea cambiar su estado a ${newStatus}?`;
    
    elements.statusModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeStatusModal() {
    elements.statusModalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentEditingId = null;
}

// Función consolidada para confirmar cambio de estado
function confirmStatusChange() {
    if (!currentEditingId) return;
    
    const fichaIndex = fichas.findIndex(f => f.id === currentEditingId);
    if (fichaIndex === -1) return;
    
    const oldStatus = fichas[fichaIndex].estado;
    const newStatus = oldStatus === 'Activo' ? 'Inactivo' : 'Activo';
    
    fichas[fichaIndex].estado = newStatus;
    
    saveToLocalStorage();
    
    // Registrar actividad
    if (typeof addActivity === 'function') {
        addActivity('status', 'Estado cambiado', `Ficha ${fichas[fichaIndex].codigo}: ${oldStatus} → ${newStatus}`);
    }
    
    closeStatusModal();
    updateStats();
    renderTable();
    
    if (userSettings.notifications) {
        showNotification(`Estado cambiado exitosamente de ${oldStatus} a ${newStatus}`, 'success');
    }
}

// Primera definición removida - se consolidará más adelante

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    elements.notifications.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Funciones globales se definirán al final del archivo

// Efectos adicionales
document.addEventListener('mousemove', function(e) {
    // Efecto de cursor neón sutil
    const cursor = document.querySelector('.cursor-glow');
    if (!cursor) {
        const glowCursor = document.createElement('div');
        glowCursor.className = 'cursor-glow';
        glowCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(glowCursor);
    }
    
    const glowElement = document.querySelector('.cursor-glow');
    if (glowElement) {
        glowElement.style.left = (e.clientX - 10) + 'px';
        glowElement.style.top = (e.clientY - 10) + 'px';
    }
});

// Animaciones de carga
window.addEventListener('load', function() {
    // Animación de entrada para las tarjetas de estadísticas
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animación para la tabla
    const tableSection = document.querySelector('.table-section');
    if (tableSection) {
        tableSection.style.opacity = '0';
        tableSection.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            tableSection.style.transition = 'all 0.6s ease';
            tableSection.style.opacity = '1';
            tableSection.style.transform = 'translateY(0)';
        }, 800);
    }
});

// Funciones para notificaciones - Usar funcionalidad compartida
function toggleNotificationPanel() {
    if (typeof toggleSharedNotificationPanel === 'function') {
        toggleSharedNotificationPanel();
    }
}

function closeNotificationPanel() {
    if (typeof closeSharedNotificationPanel === 'function') {
        closeSharedNotificationPanel();
    }
}

function addNotification(type, title, message) {
    if (typeof addSharedNotification === 'function') {
        addSharedNotification(type, title, message);
    }
}

function renderNotifications() {
    if (typeof renderSharedNotifications === 'function') {
        renderSharedNotifications();
    }
}

// Funciones para favoritos - Usar funcionalidad compartida
function toggleFavoritesPanel() {
    if (typeof toggleSharedFavoritesPanel === 'function') {
        toggleSharedFavoritesPanel();
    }
}

function closeFavoritesPanel() {
    if (typeof closeSharedFavoritesPanel === 'function') {
        closeSharedFavoritesPanel();
    }
}

// Función consolidada para toggle de favoritos
function toggleFavorite(fichaId) {
    const ficha = fichas.find(f => f.id === fichaId);
    if (!ficha) return;
    
    const favoriteIndex = favoritos.findIndex(f => f.id === fichaId);
    
    if (favoriteIndex === -1) {
        // Agregar a favoritos
        favoritos.push(ficha);
        
        // Agregar también al sistema compartido
        if (typeof addSharedFavorite === 'function') {
            addSharedFavorite(ficha.id, ficha.codigo, `${ficha.instructor} - ${ficha.estado}`, 'ficha');
        }
        
        // Registrar actividad
        if (typeof addActivity === 'function') {
            addActivity('favorite', 'Agregado a favoritos', `Ficha ${ficha.codigo} marcada como favorita`);
        }
        
        addNotification('favorite', 'Agregado a favoritos', `La ficha ${ficha.codigo} se agregó a favoritos`);
        if (userSettings.notifications) {
            showNotification(`Ficha ${ficha.codigo} agregada a favoritos`, 'success');
        }
    } else {
        // Quitar de favoritos
        favoritos.splice(favoriteIndex, 1);
        
        // Quitar también del sistema compartido
        if (typeof removeSharedFavorite === 'function') {
            removeSharedFavorite(ficha.id);
        }
        
        // Registrar actividad
        if (typeof addActivity === 'function') {
            addActivity('favorite', 'Quitado de favoritos', `Ficha ${ficha.codigo} removida de favoritos`);
        }
        
        addNotification('favorite', 'Quitado de favoritos', `La ficha ${ficha.codigo} se quitó de favoritos`);
        if (userSettings.notifications) {
            showNotification(`Ficha ${ficha.codigo} quitada de favoritos`, 'success');
        }
    }
    
    saveToLocalStorage();
    updateFavoritesCount();
    renderTable();
    renderFavorites();
}

function updateFavoritesCount() {
    elements.favoritesCount.textContent = favoritos.length;
    if (favoritos.length === 0) {
        elements.favoritesCount.style.display = 'none';
    } else {
        elements.favoritesCount.style.display = 'block';
    }
}

function renderFavorites() {
    if (!elements.favoritesList) return;
    
    if (favoritos.length === 0) {
        elements.favoritesList.innerHTML = `
            <div class="empty-favorites">
                <i class="fas fa-heart"></i>
                <p>No tienes fichas favoritas aún</p>
                <small>Haz clic en el corazón de cualquier ficha para agregarla a favoritos</small>
            </div>
        `;
        return;
    }
    
    elements.favoritesList.innerHTML = '';
    
    favoritos.forEach(ficha => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.innerHTML = `
            <div class="favorite-info">
                <h4>${ficha.codigo}</h4>
                <p>${ficha.instructor} - ${ficha.estado}</p>
            </div>
            <button class="remove-favorite" onclick="toggleFavorite(${ficha.id})" title="Quitar de favoritos">
                <i class="fas fa-times"></i>
            </button>
        `;
        elements.favoritesList.appendChild(favoriteItem);
    });
}

function clearAllFavorites() {
    favoritos = [];
    saveToLocalStorage();
    updateFavoritesCount();
    renderFavorites();
    renderTable();
    addNotification('favorite', 'Favoritos limpiados', 'Se quitaron todas las fichas de favoritos');
    showNotification('Todos los favoritos han sido eliminados', 'success');
}

// Función para vista de cuadrícula (toggle)
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
    } else {
        // Cambiar a vista de cuadrícula
        tableSection.classList.add('grid-view');
        elements.gridViewBtn.innerHTML = '<i class="fas fa-list"></i>';
        elements.gridViewBtn.title = 'Vista de lista';
        
        // Ocultar tabla
        document.querySelector('.table-container').style.display = 'none';
        
        // Crear y mostrar grid
        renderGridView();
    }
}

function renderGridView() {
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
    
    fichas.forEach(ficha => {
        const isFavorite = favoritos.some(f => f.id === ficha.id);
        
        const card = document.createElement('div');
        card.className = 'ficha-card';
        card.innerHTML = `
            <div class="ficha-card-header">
                <h3 class="ficha-code">${ficha.codigo}</h3>
                <div class="ficha-card-actions">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="toggleFavorite(${ficha.id})" 
                            title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="edit-btn" onclick="editFicha(${ficha.id})" title="Editar ficha">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="openDeleteModal(${ficha.id})" title="Eliminar ficha">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="ficha-program">${ficha.formacion}</div>
            <div class="ficha-instructor">
                <i class="fas fa-user"></i>
                ${ficha.instructor}
            </div>
            <div class="ficha-card-footer">
                <span class="status-badge status-${ficha.estado.toLowerCase()}" 
                      onclick="openStatusModal(${ficha.id})">
                    ${ficha.estado}
                </span>
                <small style="color: var(--text-muted);">${ficha.jornada}</small>
            </div>
        `;
        
        gridContainer.appendChild(card);
    });
    
    gridOverlay.appendChild(gridContainer);
    tableSection.appendChild(gridOverlay);
}

// Función para editar ficha
function editFicha(fichaId) {
    const ficha = fichas.find(f => f.id === fichaId);
    if (!ficha) return;
    
    // Llenar el formulario con los datos existentes
    document.getElementById('codigo').value = ficha.codigo;
    document.getElementById('formacion').value = ficha.formacion;
    document.getElementById('jornada').value = ficha.jornada;
    document.getElementById('instructor').value = ficha.instructor;
    document.getElementById('estado').value = ficha.estado;
    
    // Cambiar el título del modal
    document.querySelector('.modal-header h3').textContent = 'Editar Ficha';
    
    // Cambiar el texto del botón
    document.querySelector('.btn-primary[type="submit"]').textContent = 'Actualizar';
    
    // Guardar el ID para la actualización
    currentEditingId = fichaId;
    
    openAddModal();
}

// Segunda definición removida - se consolidará más adelante

// Funciones globales removidas - ya consolidadas arriba

// Inicializar contadores
function initializeCounters() {
    updateFavoritesCount();
    
    // Contar notificaciones no leídas desde localStorage
    const unreadCount = notificaciones.filter(n => n.unread).length;
    elements.notificationCount.textContent = unreadCount;
    if (unreadCount === 0) {
        elements.notificationCount.style.display = 'none';
    } else {
        elements.notificationCount.style.display = 'block';
    }
}

// Función duplicada removida - ya consolidada arriba
// Funciones para eliminar fichas
function openDeleteModal(fichaId) {
    const ficha = fichas.find(f => f.id === fichaId);
    if (!ficha) return;
    
    currentDeletingId = fichaId;
    elements.deleteMessage.textContent = `¿Estás seguro de que quieres eliminar la ficha "${ficha.codigo}"?`;
    
    elements.deleteModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
    elements.deleteModalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentDeletingId = null;
}

// Función consolidada para confirmar eliminación de fichas
function confirmDeleteFicha() {
    if (!currentDeletingId) return;
    
    const fichaIndex = fichas.findIndex(f => f.id === currentDeletingId);
    if (fichaIndex === -1) return;
    
    const deletedFicha = fichas[fichaIndex];
    
    // Enviar a papelera en lugar de eliminar permanentemente
    const elementoEliminado = {
        id: deletedFicha.id,
        tipo: 'Ficha',
        nombre: `${deletedFicha.codigo} - ${deletedFicha.formacion}`,
        descripcion: `Ficha de formación: ${deletedFicha.formacion}`,
        usuario: 'Carlos Rodríguez', // Usuario actual (instructor)
        fechaEliminacion: new Date().toISOString().split('T')[0],
        origen: 'Fichas',
        estado: 'Eliminado',
        datosOriginales: {
            codigo: deletedFicha.codigo,
            formacion: deletedFicha.formacion,
            jornada: deletedFicha.jornada,
            instructor: deletedFicha.instructor,
            estado: deletedFicha.estado
        }
    };
    
    // Agregar a papelera
    let elementosEliminados = JSON.parse(localStorage.getItem('elementosEliminados') || '[]');
    elementosEliminados.unshift(elementoEliminado);
    localStorage.setItem('elementosEliminados', JSON.stringify(elementosEliminados));
    
    // Eliminar de fichas
    fichas.splice(fichaIndex, 1);
    
    // Eliminar de favoritos si existe
    const favoriteIndex = favoritos.findIndex(f => f.id === currentDeletingId);
    if (favoriteIndex !== -1) {
        favoritos.splice(favoriteIndex, 1);
        updateFavoritesCount();
        // También eliminar del sistema compartido
        if (typeof removeSharedFavorite === 'function') {
            removeSharedFavorite(currentDeletingId);
        }
    }
    
    saveToLocalStorage();
    closeDeleteModal();
    updateStats();
    renderTable();
    renderFavorites();
    
    // Registrar actividad
    if (typeof addActivity === 'function') {
        addActivity('delete', 'Ficha eliminada', `Ficha ${deletedFicha.codigo} enviada a papelera`);
    }
    
    // Agregar notificación
    addNotification('delete', 'Ficha enviada a papelera', `La ficha ${deletedFicha.codigo} fue enviada a la papelera`);
    if (userSettings.notifications) {
        showNotification(`Ficha ${deletedFicha.codigo} enviada a papelera`, 'success');
    }
    
    // Registrar actividad compartida
    if (typeof addSharedActivity === 'function') {
        addSharedActivity(`Envió ficha ${deletedFicha.codigo} a la papelera`, 'delete');
    }
}

// Funciones globales removidas - ya consolidadas arriba

// Función para registrar actividades - Usar funcionalidad compartida
function addActivity(type, description, details = '') {
    if (typeof addSharedActivity === 'function') {
        addSharedActivity(`${description}${details ? ': ' + details : ''}`, type);
    }
}

// Función principal consolidada para manejar formularios
function handleFormSubmit(e) {
    console.log('📝 Procesando formulario...');
    e.preventDefault();
    
    const fichaData = {
        codigo: document.getElementById('codigo').value.trim(),
        formacion: document.getElementById('formacion').value.trim(),
        jornada: document.getElementById('jornada').value,
        instructor: document.getElementById('instructor').value.trim(),
        estado: document.getElementById('estado').value
    };
    
    console.log('📊 Datos del formulario:', fichaData);
    
    if (currentEditingId) {
        console.log('✏️ Modo edición - ID:', currentEditingId);
        // Modo edición
        const fichaIndex = fichas.findIndex(f => f.id === currentEditingId);
        if (fichaIndex !== -1) {
            // Verificar código único (excluyendo la ficha actual)
            const codeExists = fichas.some(f => 
                f.id !== currentEditingId && 
                f.codigo.toLowerCase() === fichaData.codigo.toLowerCase()
            );
            
            if (codeExists) {
                console.warn('⚠️ Código duplicado:', fichaData.codigo);
                showNotification('El código de ficha ya existe', 'error');
                return;
            }
            
            const oldFicha = { ...fichas[fichaIndex] };
            fichas[fichaIndex] = { ...fichas[fichaIndex], ...fichaData };
            
            // Actualizar en favoritos si existe
            const favoriteIndex = favoritos.findIndex(f => f.id === currentEditingId);
            if (favoriteIndex !== -1) {
                favoritos[favoriteIndex] = { ...fichas[fichaIndex] };
            }
            
            // Registrar actividad
            if (typeof addActivity === 'function') {
                addActivity('edit', 'Ficha editada', `Ficha ${fichaData.codigo} actualizada`);
            }
            
            addNotification('edit', 'Ficha actualizada', `La ficha ${fichaData.codigo} fue actualizada`);
            if (userSettings.notifications) {
                showNotification(`Ficha ${fichaData.codigo} actualizada exitosamente`, 'success');
            }
            
            console.log('✅ Ficha actualizada:', fichaData.codigo);
        }
        
        saveToLocalStorage();
        
        // Resetear modo edición
        currentEditingId = null;
        const modalTitle = document.querySelector('.modal-header h3');
        const submitBtn = document.querySelector('.btn-primary[type="submit"]');
        if (modalTitle) modalTitle.textContent = 'Añadir Nueva Ficha';
        if (submitBtn) submitBtn.textContent = 'Agregar';
    } else {
        console.log('➕ Modo agregar nueva ficha');
        // Modo agregar
        const newFicha = {
            id: Date.now(),
            ...fichaData
        };
        
        // Validar código único
        if (fichas.some(f => f.codigo.toLowerCase() === newFicha.codigo.toLowerCase())) {
            console.warn('⚠️ Código duplicado:', fichaData.codigo);
            showNotification('El código de ficha ya existe', 'error');
            return;
        }
        
        fichas.push(newFicha);
        saveToLocalStorage();
        
        // Registrar actividad
        if (typeof addActivity === 'function') {
            addActivity('create', 'Nueva ficha creada', `Ficha ${newFicha.codigo} agregada al sistema`);
        }
        
        addNotification('add', 'Nueva ficha agregada', `La ficha ${newFicha.codigo} fue agregada exitosamente`);
        if (userSettings.notifications) {
            showNotification(`Ficha ${newFicha.codigo} agregada exitosamente`, 'success');
        }
        
        console.log('✅ Nueva ficha agregada:', newFicha.codigo);
    }
    
    closeAddModal();
    updateStats();
    renderTable();
    renderFavorites();
    
    console.log('✅ Formulario procesado correctamente');
}

// Función duplicada removida - ya consolidada arriba

// Función duplicada removida - ya consolidada arriba

// Función duplicada removida - ya consolidada arriba

// Función duplicada removida - ya consolidada arriba

// Funciones globales removidas - ya consolidadas arriba
// Inicialización - Usar funcionalidad compartida para tema y sidebar
function initializeTheme() {
    // La funcionalidad de tema está manejada por shared.js
    if (typeof initializeSharedTheme === 'function') {
        initializeSharedTheme();
    }
}

function initializeSidebar() {
    // La funcionalidad de sidebar está manejada por shared.js
    if (typeof initializeSharedSidebar === 'function') {
        initializeSharedSidebar();
    }
}

// ===== FUNCIONES GLOBALES PARA ONCLICK =====
// Estas funciones deben estar disponibles globalmente para los eventos onclick en HTML dinámico

window.openStatusModal = openStatusModal;
window.toggleFavorite = toggleFavorite;
window.editFicha = editFicha;
window.openDeleteModal = openDeleteModal;
window.handleFormSubmit = handleFormSubmit;
window.confirmDeleteFicha = confirmDeleteFicha;
window.confirmStatusChange = confirmStatusChange;

// Verificar que todas las funciones estén definidas
console.log('=== VERIFICACIÓN DE FUNCIONES GLOBALES ===');
const functionsToCheck = [
    'openStatusModal',
    'toggleFavorite', 
    'editFicha',
    'openDeleteModal',
    'handleFormSubmit',
    'confirmDeleteFicha',
    'confirmStatusChange'
];

functionsToCheck.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log(`✅ ${funcName} - DEFINIDA`);
    } else {
        console.error(`❌ ${funcName} - NO DEFINIDA`);
    }
});