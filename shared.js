// ===== FUNCIONALIDAD COMPARTIDA PARA TODAS LAS PÁGINAS =====

// Estado global compartido
let sharedState = {
    userSettings: {
        theme: 'dark',
        notifications: true
    },
    notifications: [],
    favoritos: [],
    actividades: []
};

// Elementos del DOM compartidos
let sharedElements = {};

// Inicializar elementos compartidos
function initializeSharedElements() {
    sharedElements = {
        // Header icons
        notificationBtn: document.getElementById('notification-btn'),
        favoritesBtn: document.getElementById('favorites-btn'),
        userBtn: document.getElementById('user-btn'),
        
        // Paneles
        notificationPanel: document.getElementById('notification-panel'),
        favoritesPanel: document.getElementById('favorites-panel'),
        userPanel: document.getElementById('user-panel'),
        
        // Listas
        notificationList: document.getElementById('notification-list'),
        favoritesList: document.getElementById('favorites-list'),
        
        // Contadores
        notificationCount: document.querySelector('.notification-count'),
        favoritesCount: document.querySelector('.favorites-count'),
        
        // Sidebar
        sidebar: document.querySelector('.sidebar'),
        sidebarToggle: document.getElementById('sidebar-toggle'),
        
        // Notificaciones toast
        notifications: document.getElementById('notifications')
    };
}

// Funciones de localStorage compartidas
function saveSharedToLocalStorage() {
    try {
        localStorage.setItem('sharedUserSettings', JSON.stringify(sharedState.userSettings));
        localStorage.setItem('sharedNotifications', JSON.stringify(sharedState.notifications));
        localStorage.setItem('sharedFavoritos', JSON.stringify(sharedState.favoritos));
        localStorage.setItem('sharedActividades', JSON.stringify(sharedState.actividades));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

function loadSharedFromLocalStorage() {
    try {
        const savedUserSettings = localStorage.getItem('sharedUserSettings');
        const savedNotifications = localStorage.getItem('sharedNotifications');
        const savedFavoritos = localStorage.getItem('sharedFavoritos');
        const savedActividades = localStorage.getItem('sharedActividades');
        
        if (savedUserSettings) {
            sharedState.userSettings = JSON.parse(savedUserSettings);
        }
        if (savedNotifications) {
            sharedState.notifications = JSON.parse(savedNotifications);
        }
        if (savedFavoritos) {
            sharedState.favoritos = JSON.parse(savedFavoritos);
        }
        if (savedActividades) {
            sharedState.actividades = JSON.parse(savedActividades);
        }
    } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
    }
}

// Inicializar funcionalidad compartida
function initializeSharedFunctionality() {
    loadSharedFromLocalStorage();
    initializeSharedElements();
    initializeSharedTheme();
    initializeSharedSidebar();
    setupSharedEventListeners();
    renderSharedNotifications();
    renderSharedFavorites();
    initializeSharedCounters();
    
    // Registrar actividad de acceso a la página
    const currentPage = getCurrentPageName();
    addSharedActivity(`Accedió a ${currentPage}`, 'navigation');
    
    // Cargar datos de ejemplo si no existen
    if (sharedState.notifications.length === 0) {
        loadSharedSampleData();
    }
}

// Obtener nombre de la página actual
function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    const pageNames = {
        'index.html': 'Fichas',
        'inicio.html': 'Inicio',
        'reportes.html': 'Reportes',
        'comentarios.html': 'Comentarios',
        'papelera.html': 'Papelera'
    };
    
    return pageNames[page] || 'Página desconocida';
}

// Configurar event listeners compartidos
function setupSharedEventListeners() {
    // Solo configurar si los elementos existen
    if (sharedElements.notificationBtn) {
        sharedElements.notificationBtn.addEventListener('click', toggleSharedNotificationPanel);
    }
    if (sharedElements.favoritesBtn) {
        sharedElements.favoritesBtn.addEventListener('click', toggleSharedFavoritesPanel);
    }
    if (sharedElements.userBtn) {
        sharedElements.userBtn.addEventListener('click', toggleSharedUserPanel);
    }
    if (sharedElements.sidebarToggle) {
        sharedElements.sidebarToggle.addEventListener('click', toggleSharedSidebar);
    }
    
    // Cerrar paneles al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (sharedElements.notificationPanel && !sharedElements.notificationPanel.contains(e.target) && 
            sharedElements.notificationBtn && !sharedElements.notificationBtn.contains(e.target)) {
            closeSharedNotificationPanel();
        }
        if (sharedElements.favoritesPanel && !sharedElements.favoritesPanel.contains(e.target) && 
            sharedElements.favoritesBtn && !sharedElements.favoritesBtn.contains(e.target)) {
            closeSharedFavoritesPanel();
        }
        if (sharedElements.userPanel && !sharedElements.userPanel.contains(e.target) && 
            sharedElements.userBtn && !sharedElements.userBtn.contains(e.target)) {
            closeSharedUserPanel();
        }
    });
    
    // Cerrar paneles con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSharedNotificationPanel();
            closeSharedFavoritesPanel();
            closeSharedUserPanel();
        }
    });
    
    // Event listeners para botones dentro de los paneles
    setupPanelEventListeners();
}

// Configurar event listeners para botones dentro de los paneles
function setupPanelEventListeners() {
    // Botón limpiar notificaciones
    const clearNotificationsBtn = document.getElementById('clear-notifications');
    if (clearNotificationsBtn) {
        clearNotificationsBtn.addEventListener('click', clearAllSharedNotifications);
    }
    
    // Botón limpiar favoritos
    const clearFavoritesBtn = document.getElementById('clear-favorites');
    if (clearFavoritesBtn) {
        clearFavoritesBtn.addEventListener('click', clearAllSharedFavorites);
    }
    
    // Botones del menú de usuario
    const userProfileBtn = document.getElementById('user-profile-btn');
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', showUserProfile);
    }
    
    const userActivityBtn = document.getElementById('user-activity-btn');
    if (userActivityBtn) {
        userActivityBtn.addEventListener('click', showUserActivity);
    }
}

// Funciones de tema
function initializeSharedTheme() {
    document.documentElement.setAttribute('data-theme', sharedState.userSettings.theme);
}

function toggleSharedTheme() {
    sharedState.userSettings.theme = sharedState.userSettings.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', sharedState.userSettings.theme);
    saveSharedToLocalStorage();
    addSharedNotification('settings', 'Tema cambiado', `Tema ${sharedState.userSettings.theme === 'dark' ? 'oscuro' : 'claro'} activado`);
}

// Funciones de sidebar
function initializeSharedSidebar() {
    if (!sharedElements.sidebar) return;
    
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sharedElements.sidebar.classList.add('collapsed');
    }
}

function toggleSharedSidebar() {
    if (!sharedElements.sidebar) return;
    
    sharedElements.sidebar.classList.toggle('collapsed');
    const isCollapsed = sharedElements.sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// Funciones de notificaciones
function toggleSharedNotificationPanel() {
    if (!sharedElements.notificationPanel) return;
    
    const isActive = sharedElements.notificationPanel.classList.contains('active');
    
    if (isActive) {
        closeSharedNotificationPanel();
    } else {
        closeSharedFavoritesPanel();
        closeSharedUserPanel();
        sharedElements.notificationPanel.classList.add('active');
        markSharedNotificationsAsRead();
    }
}

function closeSharedNotificationPanel() {
    if (sharedElements.notificationPanel) {
        sharedElements.notificationPanel.classList.remove('active');
    }
}

function markSharedNotificationsAsRead() {
    sharedState.notifications.forEach(notification => {
        notification.unread = false;
    });
    
    saveSharedToLocalStorage();
    renderSharedNotifications();
    
    setTimeout(() => {
        if (sharedElements.notificationCount) {
            sharedElements.notificationCount.textContent = '0';
            sharedElements.notificationCount.style.display = 'none';
        }
    }, 300);
}

function renderSharedNotifications() {
    if (!sharedElements.notificationList) return;
    
    if (sharedState.notifications.length === 0) {
        sharedElements.notificationList.innerHTML = `
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
        'download': 'fas fa-download',
        'settings': 'fas fa-cog',
        'system': 'fas fa-info-circle'
    };
    
    sharedElements.notificationList.innerHTML = '';
    
    sharedState.notifications.forEach(notification => {
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
        sharedElements.notificationList.appendChild(notificationElement);
    });
}

function addSharedNotification(type, title, message) {
    const notification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        time: 'Ahora',
        unread: true
    };
    
    sharedState.notifications.unshift(notification);
    
    if (sharedState.notifications.length > 50) {
        sharedState.notifications = sharedState.notifications.slice(0, 50);
    }
    
    saveSharedToLocalStorage();
    renderSharedNotifications();
    
    if (sharedElements.notificationCount) {
        const currentCount = parseInt(sharedElements.notificationCount.textContent) || 0;
        sharedElements.notificationCount.textContent = currentCount + 1;
        sharedElements.notificationCount.style.display = 'block';
    }
}

// Limpiar todas las notificaciones
function clearAllSharedNotifications() {
    sharedState.notifications = [];
    saveSharedToLocalStorage();
    renderSharedNotifications();
    
    if (sharedElements.notificationCount) {
        sharedElements.notificationCount.textContent = '0';
        sharedElements.notificationCount.style.display = 'none';
    }
    
    showSharedNotification('Todas las notificaciones han sido eliminadas', 'success');
}

// Funciones de favoritos
function toggleSharedFavoritesPanel() {
    if (!sharedElements.favoritesPanel) return;
    
    const isActive = sharedElements.favoritesPanel.classList.contains('active');
    
    if (isActive) {
        closeSharedFavoritesPanel();
    } else {
        closeSharedNotificationPanel();
        closeSharedUserPanel();
        sharedElements.favoritesPanel.classList.add('active');
        renderSharedFavorites();
    }
}

function closeSharedFavoritesPanel() {
    if (sharedElements.favoritesPanel) {
        sharedElements.favoritesPanel.classList.remove('active');
    }
}

function renderSharedFavorites() {
    if (!sharedElements.favoritesList) return;
    
    if (sharedState.favoritos.length === 0) {
        sharedElements.favoritesList.innerHTML = `
            <div class="empty-favorites">
                <i class="fas fa-heart"></i>
                <p>No tienes elementos favoritos aún</p>
                <small>Los elementos marcados como favoritos aparecerán aquí</small>
            </div>
        `;
        return;
    }
    
    sharedElements.favoritesList.innerHTML = '';
    
    sharedState.favoritos.forEach(favorito => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.innerHTML = `
            <div class="favorite-info">
                <h4>${favorito.title}</h4>
                <p>${favorito.description}</p>
            </div>
            <button class="remove-favorite" onclick="removeSharedFavorite(${favorito.id})" title="Quitar de favoritos">
                <i class="fas fa-times"></i>
            </button>
        `;
        sharedElements.favoritesList.appendChild(favoriteItem);
    });
}

function addSharedFavorite(id, title, description, type = 'general') {
    const existingIndex = sharedState.favoritos.findIndex(f => f.id === id && f.type === type);
    
    if (existingIndex === -1) {
        sharedState.favoritos.push({
            id: id,
            title: title,
            description: description,
            type: type,
            dateAdded: new Date().toISOString()
        });
        
        saveSharedToLocalStorage();
        updateSharedFavoritesCount();
        renderSharedFavorites();
        
        addSharedNotification('favorite', 'Agregado a favoritos', `${title} se agregó a favoritos`);
        showSharedNotification(`${title} agregado a favoritos`, 'success');
    }
}

function removeSharedFavorite(id) {
    const favoriteIndex = sharedState.favoritos.findIndex(f => f.id === id);
    if (favoriteIndex !== -1) {
        const removedFavorite = sharedState.favoritos[favoriteIndex];
        sharedState.favoritos.splice(favoriteIndex, 1);
        
        saveSharedToLocalStorage();
        updateSharedFavoritesCount();
        renderSharedFavorites();
        
        addSharedNotification('favorite', 'Quitado de favoritos', `${removedFavorite.title} se quitó de favoritos`);
        showSharedNotification(`${removedFavorite.title} quitado de favoritos`, 'success');
    }
}

// Limpiar todos los favoritos
function clearAllSharedFavorites() {
    const count = sharedState.favoritos.length;
    sharedState.favoritos = [];
    saveSharedToLocalStorage();
    updateSharedFavoritesCount();
    renderSharedFavorites();
    
    addSharedNotification('favorite', 'Favoritos limpiados', `Se eliminaron ${count} elementos de favoritos`);
    showSharedNotification(`${count} favoritos eliminados`, 'success');
}

// Funciones de usuario
function toggleSharedUserPanel() {
    if (!sharedElements.userPanel) return;
    
    const isActive = sharedElements.userPanel.classList.contains('active');
    
    if (isActive) {
        closeSharedUserPanel();
    } else {
        closeSharedNotificationPanel();
        closeSharedFavoritesPanel();
        sharedElements.userPanel.classList.add('active');
        if (sharedElements.userBtn) {
            sharedElements.userBtn.classList.add('active');
        }
    }
}

function closeSharedUserPanel() {
    if (sharedElements.userPanel) {
        sharedElements.userPanel.classList.remove('active');
    }
    if (sharedElements.userBtn) {
        sharedElements.userBtn.classList.remove('active');
    }
}

// Mostrar perfil de usuario
function showUserProfile() {
    closeSharedUserPanel();
    showSharedNotification('Perfil de usuario: Carlos Rodríguez - Administrador', 'info');
    addSharedNotification('system', 'Perfil consultado', 'Has consultado tu información de perfil');
    addSharedActivity('Consultó perfil de usuario', 'profile');
}

// Mostrar actividad reciente
function showUserActivity() {
    closeSharedUserPanel();
    
    // Crear modal de actividad o mostrar en notificación
    const recentActivities = sharedState.actividades.slice(0, 5);
    let activityMessage = 'Actividad reciente consultada';
    
    if (recentActivities.length === 0) {
        activityMessage = 'No hay actividades recientes registradas';
    }
    
    showSharedNotification(activityMessage, 'info');
    addSharedNotification('system', 'Actividad consultada', 'Has consultado tu actividad reciente');
    addSharedActivity('Consultó actividad reciente', 'system');
}

// Agregar actividad al historial
function addSharedActivity(description, type = 'general') {
    const activity = {
        id: Date.now(),
        description: description,
        type: type,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES')
    };
    
    sharedState.actividades.unshift(activity);
    
    // Mantener solo las últimas 100 actividades
    if (sharedState.actividades.length > 100) {
        sharedState.actividades = sharedState.actividades.slice(0, 100);
    }
    
    saveSharedToLocalStorage();
}

// Funciones de contadores
function initializeSharedCounters() {
    updateSharedFavoritesCount();
    
    const unreadCount = sharedState.notifications.filter(n => n.unread).length;
    if (sharedElements.notificationCount) {
        sharedElements.notificationCount.textContent = unreadCount;
        if (unreadCount === 0) {
            sharedElements.notificationCount.style.display = 'none';
        } else {
            sharedElements.notificationCount.style.display = 'block';
        }
    }
}

function updateSharedFavoritesCount() {
    if (sharedElements.favoritesCount) {
        sharedElements.favoritesCount.textContent = sharedState.favoritos.length;
        if (sharedState.favoritos.length === 0) {
            sharedElements.favoritesCount.style.display = 'none';
        } else {
            sharedElements.favoritesCount.style.display = 'block';
        }
    }
}

// Notificaciones toast
function showSharedNotification(message, type = 'success') {
    if (!sharedElements.notifications) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    sharedElements.notifications.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Datos de ejemplo
function loadSharedSampleData() {
    const sampleNotifications = [
        {
            id: Date.now() - 1,
            type: 'system',
            title: 'Bienvenido al sistema',
            message: 'Sistema de gestión de fichas iniciado correctamente',
            time: 'Hace 1 hora',
            unread: true
        },
        {
            id: Date.now() - 2,
            type: 'settings',
            title: 'Configuración guardada',
            message: 'Tus preferencias han sido guardadas',
            time: 'Hace 2 horas',
            unread: false
        }
    ];
    
    const sampleActivities = [
        {
            id: Date.now() - 1,
            description: 'Inició sesión en el sistema',
            type: 'login',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            date: new Date(Date.now() - 3600000).toLocaleDateString('es-ES'),
            time: new Date(Date.now() - 3600000).toLocaleTimeString('es-ES')
        },
        {
            id: Date.now() - 2,
            description: 'Consultó lista de fichas',
            type: 'navigation',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            date: new Date(Date.now() - 7200000).toLocaleDateString('es-ES'),
            time: new Date(Date.now() - 7200000).toLocaleTimeString('es-ES')
        }
    ];
    
    sharedState.notifications = sampleNotifications;
    sharedState.actividades = sampleActivities;
    saveSharedToLocalStorage();
    renderSharedNotifications();
    initializeSharedCounters();
}

// Funciones globales
window.removeSharedFavorite = removeSharedFavorite;
window.toggleSharedTheme = toggleSharedTheme;
window.addSharedFavorite = addSharedFavorite;
window.showSharedNotification = showSharedNotification;
window.addSharedNotification = addSharedNotification;
window.clearAllSharedNotifications = clearAllSharedNotifications;
window.clearAllSharedFavorites = clearAllSharedFavorites;
window.showUserProfile = showUserProfile;
window.showUserActivity = showUserActivity;
window.addSharedActivity = addSharedActivity;

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que otros scripts se carguen primero
    setTimeout(initializeSharedFunctionality, 100);
});