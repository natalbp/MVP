# Sistema de Gestión de Fichas

## 📋 ¿Qué hace este proyecto?

Este es un **sistema web completo para la gestión de fichas de aprendices** diseñado para instituciones educativas. Permite administrar de manera eficiente la información de estudiantes, generar reportes detallados y mantener un seguimiento completo de las actividades académicas.

### Funcionalidades Principales

**🎯 Gestión de Fichas de Aprendices**
- Crear, editar y eliminar fichas de estudiantes
- Asignar fichas a diferentes jornadas (Mañana, Tarde, Noche)
- Cambiar estados (Activo, Inactivo, Suspendido, Graduado)
- Sistema de favoritos para fichas importantes
- Búsqueda y filtrado avanzado

**📊 Sistema de Reportes**
- Generar reportes por aprendiz, PC, jornada y fecha
- Estadísticas visuales con gráficos animados
- Filtros por rango de fechas y estado
- Descarga de reportes en diferentes formatos
- Dashboard con métricas en tiempo real

**� Gestión de Comentarios**
- Sistema completo de comentarios y feedback
- Comunicación entre instructores y administradores
- Historial de interacciones por ficha

**🗑 Papelera de Reciclaje**
- Recuperación de fichas eliminadas accidentalmente
- Eliminación permanente con confirmación
- Gestión de elementos archivados

**⚙️ Características Técnicas**
- Interfaz responsive (móvil, tablet, desktop)
- Temas personalizables (oscuro/claro)
- Almacenamiento local automático
- Navegación fluida tipo SPA
- Sin necesidad de base de datos externa

## 🚀 Instalación y Ejecución

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de software adicional
- No necesita base de datos ni servidor backend

### Pasos de Instalación

1. **Descargar el proyecto**
   ```bash
   # Clonar repositorio
   git clone [URL_DEL_REPOSITORIO]
   cd sistema-gestion-fichas
   
   # O descargar ZIP y extraer archivos
   ```

2. **Ejecutar la aplicación**

   **Opción A: Abrir directamente (más simple)**
   - Navegar a la carpeta del proyecto
   - Hacer doble clic en `login.html`
   - La aplicación se abrirá en tu navegador predeterminado

   **Opción B: Servidor local (recomendado)**
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```
   Luego abrir `http://localhost:8000/login.html`

3. **Acceso inicial**
   - Usuario: cualquier texto (es una demo)
   - Contraseña: cualquier texto
   - Hacer clic en "Iniciar Sesión"

## 🧪 Cómo Probar el MVP

### Flujo de Prueba Completo

**1. Acceso al Sistema**
- Abrir `login.html` en el navegador
- Ingresar cualquier usuario/contraseña
- Verificar redirección al dashboard

**2. Explorar el Dashboard (Inicio)**
- Revisar las tarjetas de resumen
- Verificar que muestren datos de ejemplo
- Probar el menú lateral (colapsar/expandir)
- Cambiar entre tema oscuro y claro

**3. Gestión de Fichas (Página Principal)**
- Ir a la sección "Fichas" desde el menú lateral
- **Crear nueva ficha**: Botón "Nueva Ficha"
  - Llenar formulario completo
  - Verificar que se guarde automáticamente
- **Editar ficha existente**: Hacer clic en ícono de editar
  - Modificar datos y guardar
- **Cambiar estado**: Usar dropdown de estado
- **Agregar a favoritos**: Hacer clic en estrella
- **Eliminar ficha**: Botón de eliminar (va a papelera)
- **Filtros**: Probar filtros por jornada, estado, favoritos
- **Búsqueda**: Buscar por nombre o número de ficha
- **Vista**: Alternar entre tabla y cuadrícula

**4. Sistema de Reportes**
- Ir a sección "Reportes"
- Verificar tarjetas de estadísticas
- **Generar reporte**: Llenar formulario de nuevo reporte
- **Filtrar reportes**: Usar filtros de fecha, jornada, estado
- **Acciones**: Ver, descargar, eliminar reportes
- Verificar gráficos de estadísticas animados

**5. Comentarios y Feedback**
- Ir a sección "Comentarios"
- **Crear comentario**: Agregar nuevo comentario
- **Responder**: Responder a comentarios existentes
- **Filtrar**: Por tipo, fecha, estado
- Verificar notificaciones de nuevos comentarios

**6. Papelera de Reciclaje**
- Ir a sección "Papelera"
- Verificar fichas eliminadas anteriormente
- **Recuperar**: Restaurar una ficha eliminada
- **Eliminar permanentemente**: Confirmar eliminación definitiva

**7. Configuración de Usuario**
- Hacer clic en avatar (esquina superior derecha)
- **Mi Perfil**: Verificar información del usuario
- **Configuración**: Cambiar tema, notificaciones
- **Actividad Reciente**: Ver historial de acciones
- **Cerrar Sesión**: Verificar redirección a login

### Casos de Prueba Específicos

**Persistencia de Datos**
- Crear varias fichas y reportes
- Cerrar el navegador completamente
- Reabrir la aplicación
- Verificar que todos los datos se mantienen

**Responsive Design**
- Probar en diferentes tamaños de pantalla
- Verificar menú hamburguesa en móviles
- Comprobar que todas las funciones trabajen en tablet/móvil

**Navegación**
- Usar el menú lateral para navegar entre secciones
- Verificar que la página activa se resalta correctamente
- Probar navegación con botones del navegador (atrás/adelante)

### Datos de Prueba Incluidos

El sistema incluye datos de ejemplo para facilitar las pruebas:
- 10+ fichas de aprendices con diferentes estados
- Reportes de ejemplo con fechas variadas
- Comentarios y feedback de muestra
- Configuración predeterminada funcional

### Verificación de Funcionalidades Core

✅ **CRUD Completo**: Crear, leer, actualizar, eliminar fichas
✅ **Filtros y Búsqueda**: Múltiples criterios de filtrado
✅ **Reportes**: Generación y gestión de reportes
✅ **Persistencia**: Datos guardados automáticamente
✅ **UI/UX**: Interfaz intuitiva y responsive
✅ **Temas**: Cambio entre modo oscuro y claro
✅ **Navegación**: Menú lateral funcional
✅ **Papelera**: Sistema de recuperación de datos

## 📁 Estructura del Proyecto

```
sistema-gestion-fichas/
├── login.html          # Página de acceso
├── inicio.html         # Dashboard principal
├── index.html          # Gestión de fichas (principal)
├── reportes.html       # Sistema de reportes
├── comentarios.html    # Gestión de comentarios
├── papelera.html       # Papelera de reciclaje
├── script.js           # Lógica principal
├── reportes.js         # Funcionalidad de reportes
├── comentarios.js      # Lógica de comentarios
├── papelera.js         # Funcionalidad de papelera
├── shared.js           # Funciones compartidas
├── styles.css          # Estilos y temas
└── README.md           # Este archivo
```

## 🛠️ Solución de Problemas

**La aplicación no carga:**
- Verificar que JavaScript esté habilitado
- Usar un servidor local en lugar de abrir archivos directamente
- Comprobar la consola del navegador (F12) para errores

**Los datos no se guardan:**
- No usar modo incógnito/privado del navegador
- Verificar que localStorage esté habilitado
- Limpiar caché si hay problemas

**Problemas en móviles:**
- Verificar que el viewport esté configurado correctamente
- Probar en diferentes navegadores móviles
- Usar las herramientas de desarrollador para simular dispositivos

## 📄 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Almacenamiento**: LocalStorage API
- **Diseño**: CSS Grid, Flexbox, Variables CSS
- **Compatibilidad**: Responsive Design
- **Sin dependencias externas**

---

**¿Listo para probar?** Abre `login.html` y comienza a explorar todas las funcionalidades del sistema.