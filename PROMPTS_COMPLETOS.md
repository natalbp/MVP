# PROMPTS COMPLETOS - Sistema de Gestión de Fichas

## 📋 ÍNDICE DE PROMPTS

1. [Prompt Inicial - Estructura Base](#1-prompt-inicial---estructura-base)
2. [Prompt Sistema de Fichas](#2-prompt-sistema-de-fichas)
3. [Prompt Sistema de Reportes](#3-prompt-sistema-de-reportes)
4. [Prompt Sistema de Comentarios](#4-prompt-sistema-de-comentarios)
5. [Prompt Sistema de Papelera](#5-prompt-sistema-de-papelera)
6. [Prompt Funcionalidad Compartida](#6-prompt-funcionalidad-compartida)
7. [Prompt Diseño y Estilos](#7-prompt-diseño-y-estilos)
8. [Prompt Integración y Debug](#8-prompt-integración-y-debug)

---

## 1. PROMPT INICIAL - ESTRUCTURA BASE

```
Crea un sistema web completo de "Gestión de Fichas" para un instructor del SENA con las siguientes especificaciones:

🎯 OBJETIVO PRINCIPAL
Sistema web moderno para gestionar fichas de formación con interfaz intuitiva y funcionalidad completa.

👤 ROL DEL USUARIO
- Instructor del SENA
- Permisos: Consultar, Agregar, Editar, Eliminar (enviar a papelera), Restaurar

📁 ESTRUCTURA DEL PROYECTO
Crear los siguientes archivos:
- index.html (Fichas - página principal)
- inicio.html (Dashboard/Inicio)
- reportes.html (Reportes y estadísticas)
- comentarios.html (Sistema de comentarios)
- papelera.html (Elementos eliminados)
- login.html (Página de login básica)
- styles.css (Estilos globales)
- script.js (JavaScript principal)
- shared.js (Funcionalidad compartida)
- README.md (Documentación)

🎨 DISEÑO REQUERIDO
- Tema oscuro moderno con efectos neón
- Colores: Morados, azules, rosas con gradientes
- Sidebar colapsible con navegación
- Header con iconos de notificaciones, favoritos y usuario
- Diseño responsive
- Animaciones suaves y efectos visuales

🔧 FUNCIONALIDADES CORE
- CRUD completo de fichas
- Sistema de favoritos
- Notificaciones en tiempo real
- Búsqueda y filtros
- Cambio de tema (claro/oscuro)
- LocalStorage para persistencia
- Sistema de actividades/historial

📊 DATOS DE FICHAS
Cada ficha debe contener:
- ID único
- Código de ficha
- Programa de formación
- Jornada (Mañana/Tarde/Noche)
- Instructor asignado
- Estado (Activo/Inactivo)

Comienza creando la estructura HTML básica del index.html con sidebar, header y área principal.
```

---

## 2. PROMPT SISTEMA DE FICHAS

```
Desarrolla el sistema completo de gestión de fichas (index.html y script.js) con estas especificaciones:

🔧 FUNCIONALIDADES REQUERIDAS

📋 CRUD DE FICHAS
- Agregar nueva ficha (modal con formulario)
- Editar ficha existente (reutilizar modal)
- Cambiar estado (Activo/Inactivo) con confirmación
- Eliminar ficha (enviar a papelera, NO eliminación permanente)
- Visualizar lista completa en tabla

🔍 BÚSQUEDA Y FILTROS
- Búsqueda en tiempo real por código, programa, instructor, estado
- Filtros por jornada y estado
- Resultados dinámicos sin recargar página

📊 ESTADÍSTICAS
- Contador de fichas activas
- Contador de fichas inactivas
- Total de instructores únicos
- Actualización automática de contadores

❤️ SISTEMA DE FAVORITOS
- Marcar/desmarcar fichas como favoritas
- Panel lateral de favoritos
- Contador de favoritos en header
- Persistencia en localStorage

🔔 NOTIFICACIONES
- Notificaciones toast para acciones
- Panel de notificaciones con historial
- Contador de notificaciones no leídas
- Tipos: agregar, editar, eliminar, cambio estado, favoritos

👁️ VISTAS ALTERNATIVAS
- Vista de tabla (por defecto)
- Vista de cuadrícula/tarjetas
- Toggle entre vistas

💾 PERSISTENCIA
- Guardar todo en localStorage
- Cargar datos al iniciar
- Datos de ejemplo si no hay datos guardados

🎨 INTERFAZ
- Modales para agregar/editar
- Confirmaciones para acciones críticas
- Animaciones suaves
- Feedback visual inmediato
- Responsive design

Implementa todo el JavaScript necesario con manejo de errores y validaciones.
```

---

## 3. PROMPT SISTEMA DE REPORTES

```
Crea el sistema completo de reportes (reportes.html y reportes.js) con estas especificaciones:

📊 TIPOS DE REPORTES REQUERIDOS

📈 REPORTES ESTADÍSTICOS
- Resumen general (fichas activas/inactivas, instructores, programas)
- Distribución por jornadas (gráfico de barras simulado)
- Estado de fichas (gráfico circular simulado)
- Tendencias mensuales (gráfico de líneas simulado)

📋 REPORTES DETALLADOS
- Lista completa de fichas con filtros avanzados
- Reporte por instructor (agrupado)
- Reporte por programa de formación
- Reporte por jornada

🔍 FILTROS AVANZADOS
- Rango de fechas (simulado)
- Filtro por instructor
- Filtro por programa
- Filtro por estado
- Filtro por jornada
- Combinación de múltiples filtros

📥 FUNCIONES DE EXPORTACIÓN
- Exportar a PDF (simulado con mensaje)
- Exportar a Excel (simulado con mensaje)
- Imprimir reporte
- Compartir reporte (simulado)

📊 VISUALIZACIÓN DE DATOS
- Tablas interactivas con ordenamiento
- Gráficos simulados con CSS/HTML
- Tarjetas de resumen con iconos
- Indicadores visuales de rendimiento

🎨 INTERFAZ ESPECÍFICA
- Header con título y controles de exportación
- Panel de filtros colapsible
- Área principal para mostrar reportes
- Botones de acción para cada reporte
- Loading states para simulación de carga

💾 INTEGRACIÓN
- Usar datos de fichas del localStorage
- Compartir datos con sistema principal
- Notificaciones para acciones de reporte
- Historial de reportes generados

Implementa con diseño consistente al resto del sistema y funcionalidad completa.
```

---

## 4. PROMPT SISTEMA DE COMENTARIOS

```
Desarrolla el sistema completo de comentarios (comentarios.html y comentarios.js) enfocado en comunicación estudiante-instructor:

💬 FUNCIONALIDADES DEL SISTEMA

👥 GESTIÓN DE COMENTARIOS
- Visualizar comentarios de estudiantes hacia el instructor
- Responder comentarios como instructor
- Editar respuestas propias
- Eliminar comentarios/respuestas (enviar a papelera)
- Marcar comentarios como leídos/no leídos

🔍 FILTROS Y BÚSQUEDA
- Filtrar por estado (leído/no leído)
- Filtrar por fecha
- Filtrar por estudiante
- Filtrar por ficha/programa
- Búsqueda por contenido

📊 ESTADÍSTICAS
- Total de comentarios recibidos
- Comentarios pendientes de respuesta
- Comentarios respondidos
- Actividad reciente

💡 TIPOS DE COMENTARIOS
- Consultas académicas
- Solicitudes de apoyo
- Reportes de problemas
- Sugerencias
- Otros

🎨 INTERFAZ ESPECÍFICA
- Lista de comentarios con diseño tipo chat
- Diferenciación visual entre comentarios de estudiantes y respuestas del instructor
- Panel de respuesta rápida
- Indicadores de estado (leído/no leído, respondido/sin responder)
- Avatars y timestamps

📝 FUNCIONES DE RESPUESTA
- Editor de texto enriquecido (simulado)
- Respuestas rápidas predefinidas
- Adjuntar archivos (simulado)
- Mencionar estudiantes
- Formateo básico de texto

🔔 NOTIFICACIONES
- Nuevos comentarios recibidos
- Respuestas enviadas
- Comentarios marcados como importantes
- Recordatorios de comentarios sin responder

💾 DATOS DE EJEMPLO
Crear comentarios de ejemplo con:
- Nombres de estudiantes ficticios
- Diferentes tipos de consultas
- Fechas variadas
- Estados diversos
- Algunas respuestas ya dadas

Implementa con el mismo diseño y tema del sistema principal.
```

---

## 5. PROMPT SISTEMA DE PAPELERA

```
Crea el sistema completo de papelera (papelera.html y papelera.js) para gestión de elementos eliminados:

🗑️ FUNCIONALIDADES PRINCIPALES

📋 GESTIÓN DE ELEMENTOS ELIMINADOS
- Mostrar todos los elementos enviados a papelera
- Elementos de diferentes módulos (fichas, comentarios, reportes)
- Información completa del elemento original
- Fecha y hora de eliminación
- Usuario que eliminó (instructor)

🔄 OPERACIONES DE RESTAURACIÓN
- Restaurar elemento individual a su ubicación original
- Restaurar múltiples elementos (selección masiva)
- Confirmación antes de restaurar
- Actualización automática del módulo original

🗑️ ELIMINACIÓN PERMANENTE
- Eliminar permanentemente elemento individual
- Eliminación masiva permanente
- Confirmación doble para eliminación permanente
- Advertencias claras sobre irreversibilidad

🔍 FILTROS Y BÚSQUEDA
- Filtrar por tipo de elemento (ficha, comentario, reporte)
- Filtrar por fecha de eliminación
- Filtrar por usuario que eliminó
- Búsqueda por nombre/descripción
- Ordenar por fecha, tipo, nombre

📊 INFORMACIÓN DETALLADA
Para cada elemento mostrar:
- Tipo de elemento (con icono)
- Nombre/título del elemento
- Descripción breve
- Fecha de eliminación
- Usuario que eliminó
- Origen (módulo de donde vino)
- Datos originales completos

🎨 INTERFAZ ESPECÍFICA
- Tabla con información completa
- Iconos diferenciados por tipo de elemento
- Botones de acción (restaurar, eliminar permanente)
- Selección múltiple con checkboxes
- Confirmaciones modales para acciones críticas

⚠️ VALIDACIONES Y SEGURIDAD
- Confirmación doble para eliminación permanente
- Verificar integridad de datos antes de restaurar
- Manejo de errores si el elemento original ya no existe
- Logs de todas las operaciones

💾 INTEGRACIÓN CON OTROS MÓDULOS
- Recibir elementos de fichas, comentarios, reportes
- Notificar a módulos originales cuando se restaura
- Mantener referencias cruzadas
- Sincronización de datos

🔔 NOTIFICACIONES
- Elemento restaurado exitosamente
- Elemento eliminado permanentemente
- Errores en operaciones
- Confirmaciones de acciones masivas

Implementa con el diseño consistente y manejo robusto de datos.
```

---

## 6. PROMPT FUNCIONALIDAD COMPARTIDA

```
Desarrolla el archivo shared.js con funcionalidad compartida entre todos los módulos del sistema:

🔧 FUNCIONALIDADES COMPARTIDAS

🎨 SISTEMA DE TEMAS
- Cambio entre tema oscuro y claro
- Persistencia de preferencia en localStorage
- Aplicación automática al cargar cualquier página
- Transiciones suaves entre temas

🔔 SISTEMA DE NOTIFICACIONES GLOBAL
- Notificaciones toast universales
- Panel de notificaciones compartido
- Contador global de notificaciones
- Persistencia entre páginas
- Tipos: success, error, warning, info

❤️ SISTEMA DE FAVORITOS GLOBAL
- Favoritos compartidos entre módulos
- Panel de favoritos universal
- Contador global de favoritos
- Sincronización entre páginas

👤 MENÚ DE USUARIO COMPARTIDO
- Panel de usuario con información
- Opciones de configuración
- Historial de actividad global
- Cerrar sesión

🧭 NAVEGACIÓN COMPARTIDA
- Sidebar con navegación entre módulos
- Estado activo de página actual
- Colapsar/expandir sidebar
- Navegación móvil responsive

📱 FUNCIONALIDADES MÓVILES
- Menú hamburguesa para móviles
- Sidebar overlay en pantallas pequeñas
- Gestos táctiles básicos
- Responsive design helpers

💾 GESTIÓN DE DATOS COMPARTIDA
- LocalStorage centralizado
- Funciones de guardado/carga comunes
- Sincronización entre módulos
- Backup y restauración de datos

🔍 UTILIDADES COMUNES
- Funciones de búsqueda y filtrado
- Formateo de fechas y números
- Validaciones comunes
- Helpers de DOM

📊 ACTIVIDAD GLOBAL
- Registro de actividades del usuario
- Historial compartido entre módulos
- Timestamps y metadatos
- Límite de actividades almacenadas

🎯 INICIALIZACIÓN AUTOMÁTICA
- Auto-inicialización al cargar DOM
- Configuración de elementos compartidos
- Event listeners globales
- Detección de página actual

⚙️ CONFIGURACIÓN GLOBAL
- Settings compartidos del usuario
- Preferencias de interfaz
- Configuraciones de módulos
- Exportar/importar configuración

🔧 FUNCIONES DE UTILIDAD
- Debounce para búsquedas
- Throttle para scroll events
- Formatters de texto y números
- Validadores comunes

Implementa todo como módulo independiente que se carga antes que los scripts específicos de cada página.
```

---

## 7. PROMPT DISEÑO Y ESTILOS

```
Crea el archivo styles.css completo con el diseño moderno y profesional para todo el sistema:

🎨 ESPECIFICACIONES DE DISEÑO

🌈 PALETA DE COLORES
TEMA OSCURO (principal):
- Fondo principal: #0a0a0f (negro azulado profundo)
- Fondo secundario: #1a1a2e (azul oscuro)
- Fondo de tarjetas: #16213e (azul medio)
- Texto principal: #ffffff
- Texto secundario: #b8b8b8
- Acentos: #00d4ff (azul neón), #8b5cf6 (morado), #f472b6 (rosa)

TEMA CLARO (alternativo):
- Fondo principal: #f8fafc
- Fondo secundario: #ffffff
- Texto principal: #1e293b
- Texto secundario: #64748b
- Acentos mantenidos con menos intensidad

✨ EFECTOS VISUALES
- Gradientes neón en botones y elementos interactivos
- Box-shadows con glow effects
- Transiciones suaves (0.3s ease)
- Hover effects con transformaciones
- Backdrop blur en modales
- Animaciones de entrada para elementos

🧭 LAYOUT PRINCIPAL
- Sidebar fijo de 280px (colapsible a 60px)
- Header fijo con altura de 70px
- Main content con padding responsivo
- Footer opcional con links sociales

📱 RESPONSIVE DESIGN
- Breakpoints: 768px (tablet), 480px (móvil)
- Sidebar overlay en móviles
- Botón hamburguesa para navegación móvil
- Tablas scrollables horizontalmente
- Modales adaptables a pantalla

🎯 COMPONENTES ESPECÍFICOS

📊 TABLAS
- Diseño moderno con bordes sutiles
- Hover effects en filas
- Headers con gradientes
- Sorting indicators
- Responsive con scroll horizontal

🔘 BOTONES
- Primarios con gradientes neón
- Secundarios con bordes
- Estados: normal, hover, active, disabled
- Iconos integrados
- Diferentes tamaños

📋 FORMULARIOS
- Inputs con efectos de focus
- Labels flotantes
- Validación visual
- Selects estilizados
- Textareas redimensionables

🪟 MODALES
- Backdrop blur
- Animaciones de entrada/salida
- Responsive sizing
- Close buttons estilizados
- Scroll interno si es necesario

🔔 NOTIFICACIONES
- Toast notifications con animaciones
- Diferentes tipos con colores
- Posicionamiento fijo
- Auto-dismiss con progress bar

❤️ ELEMENTOS INTERACTIVOS
- Favoritos con animación de corazón
- Toggle switches estilizados
- Progress bars con gradientes
- Loading spinners
- Tooltips informativos

🎨 ANIMACIONES CSS
- Keyframes para efectos especiales
- Transiciones suaves en hover
- Loading animations
- Slide in/out effects
- Fade transitions

📐 UTILIDADES
- Clases helper para spacing
- Flexbox utilities
- Grid utilities
- Text utilities
- Color utilities

🔧 VARIABLES CSS
- Custom properties para colores
- Spacing scale consistente
- Typography scale
- Border radius values
- Shadow definitions

Implementa todo con metodología BEM para nomenclatura y organización modular del CSS.
```

---

## 8. PROMPT INTEGRACIÓN Y DEBUG

```
Realiza la integración final y debugging completo del sistema con estas especificaciones:

🔧 INTEGRACIÓN FINAL

🔗 CONEXIÓN ENTRE MÓDULOS
- Verificar que shared.js se carga antes que scripts específicos
- Sincronización de datos entre páginas
- Navegación fluida entre módulos
- Estado compartido consistente

📊 VALIDACIÓN DE DATOS
- Verificar integridad de localStorage
- Validar estructura de datos entre módulos
- Manejo de datos corruptos o faltantes
- Migración de datos si es necesario

🎯 FUNCIONALIDADES CRÍTICAS
- CRUD completo funcionando en todos los módulos
- Sistema de papelera operativo
- Favoritos sincronizados
- Notificaciones funcionando
- Cambio de tema aplicado globalmente

🐛 DEBUGGING SISTEMÁTICO

✅ VERIFICACIONES OBLIGATORIAS
1. Todas las funciones onclick funcionan correctamente
2. Modales se abren y cierran sin errores
3. Formularios validan y envían datos
4. LocalStorage guarda y carga correctamente
5. Búsquedas y filtros operativos
6. Responsive design en todos los breakpoints
7. Navegación entre páginas sin errores
8. Temas se aplican correctamente

🔍 HERRAMIENTAS DE DEBUG
- Crear debug-fichas.html para probar funciones específicas
- Console.log estratégicos para tracking
- Verificación de elementos DOM
- Pruebas de localStorage
- Validación de funciones globales

⚠️ MANEJO DE ERRORES
- Try-catch en operaciones críticas
- Mensajes de error informativos
- Fallbacks para funcionalidades fallidas
- Validación de elementos DOM antes de uso

📱 PRUEBAS RESPONSIVE
- Verificar en diferentes tamaños de pantalla
- Probar navegación móvil
- Validar modales en móviles
- Confirmar legibilidad en todos los dispositivos

🎨 PULIMIENTO VISUAL
- Consistencia en espaciados
- Alineación perfecta de elementos
- Colores coherentes en todo el sistema
- Animaciones suaves sin glitches

📋 CHECKLIST FINAL
- [ ] Todas las páginas cargan sin errores
- [ ] Navegación funciona completamente
- [ ] CRUD operativo en todos los módulos
- [ ] Sistema de papelera restaura correctamente
- [ ] Favoritos se sincronizan entre páginas
- [ ] Notificaciones aparecen y desaparecen
- [ ] Temas cambian sin problemas
- [ ] Responsive design perfecto
- [ ] LocalStorage mantiene datos
- [ ] No hay errores en consola

🚀 OPTIMIZACIÓN FINAL
- Minificar código si es necesario
- Optimizar imágenes y recursos
- Verificar performance en dispositivos lentos
- Documentar funcionalidades principales

Entrega un sistema 100% funcional, sin errores, completamente operativo y listo para demostración.
```

---

## 📝 NOTAS IMPORTANTES

### 🎯 ORDEN DE EJECUCIÓN
1. Ejecutar prompts en el orden listado
2. Cada prompt construye sobre el anterior
3. Probar funcionalidad después de cada prompt
4. Hacer ajustes antes de continuar al siguiente

### 🔧 CONSIDERACIONES TÉCNICAS
- Usar localStorage para persistencia
- Implementar manejo de errores robusto
- Mantener consistencia en nomenclatura
- Seguir principios de código limpio

### 🎨 DISEÑO CONSISTENTE
- Mantener paleta de colores en todos los módulos
- Usar componentes reutilizables
- Aplicar mismo estilo de animaciones
- Responsive design en todo el sistema

### 📊 DATOS DE PRUEBA
- Incluir datos de ejemplo realistas
- Crear escenarios de prueba diversos
- Simular diferentes estados del sistema
- Preparar casos edge para testing

---

## 🏁 RESULTADO FINAL ESPERADO

Un sistema web completo de **Gestión de Fichas** con:
- ✅ 5 módulos completamente funcionales
- ✅ Diseño moderno y profesional
- ✅ Funcionalidad completa sin errores
- ✅ Responsive design perfecto
- ✅ Integración total entre módulos
- ✅ Sistema de persistencia robusto
- ✅ Experiencia de usuario excepcional

**Total estimado: 8 prompts principales + ajustes menores**

---

## 🎯 PROMPTS PARA RESULTADO IDÉNTICO

Si necesitas recrear el proyecto **exactamente igual**, usa estos prompts adicionales más específicos:

### PROMPT ESPECÍFICO - DISEÑO EXACTO

```
Recrea el diseño EXACTO del sistema con estas especificaciones precisas:

🎨 COLORES EXACTOS
- Fondo principal: #0a0a0f
- Sidebar: #1a1a2e con gradiente sutil
- Cards: #16213e con border #2d3748
- Texto principal: #ffffff
- Texto secundario: #a0aec0
- Acentos: #00d4ff, #8b5cf6, #f472b6

📐 MEDIDAS ESPECÍFICAS
- Sidebar: 280px ancho, colapsa a 60px
- Header: 70px altura exacta
- Cards: border-radius 12px
- Botones: padding 12px 24px
- Modales: max-width 600px

✨ EFECTOS EXACTOS
- Box-shadow: 0 10px 25px rgba(0, 212, 255, 0.1)
- Transiciones: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Hover transform: translateY(-2px)
- Glow effect: 0 0 20px rgba(139, 92, 246, 0.3)

🔤 TIPOGRAFÍA
- Font family: 'Inter', sans-serif
- Títulos: 24px, font-weight 600
- Texto normal: 16px, font-weight 400
- Texto pequeño: 14px, font-weight 300
```

### PROMPT ESPECÍFICO - FUNCIONALIDAD EXACTA

```
Implementa las funciones EXACTAS con estos nombres y comportamientos:

🔧 FUNCIONES PRINCIPALES
- openAddModal() - Abre modal con animación específica
- closeAddModal() - Cierra con fade out 300ms
- handleFormSubmit(e) - Validación exacta como el original
- toggleFavorite(fichaId) - Toggle con animación corazón
- confirmDeleteFicha() - Envía a papelera, no elimina

📊 ESTRUCTURA DE DATOS EXACTA
```javascript
const fichaStructure = {
    id: Number,
    codigo: String,
    formacion: String,
    jornada: 'Mañana'|'Tarde'|'Noche',
    instructor: String,
    estado: 'Activo'|'Inactivo'
};
```

🔔 NOTIFICACIONES EXACTAS
- Posición: top-right
- Duración: 4000ms
- Tipos: success (verde), error (rojo), warning (amarillo)
- Animación: slideInRight
```

### PROMPT ESPECÍFICO - DATOS EXACTOS

```
Usa estos datos de ejemplo EXACTOS:

📋 FICHAS DE EJEMPLO
```javascript
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
    // ... resto de datos exactos
];
```

💬 COMENTARIOS DE EJEMPLO
- Usar nombres específicos de estudiantes
- Fechas exactas del sistema original
- Contenido idéntico de consultas
```

---

## 📊 COMPARACIÓN DE ENFOQUES

| Aspecto | Prompts Generales | Prompts Específicos |
|---------|------------------|-------------------|
| **Funcionalidad** | ✅ 100% igual | ✅ 100% igual |
| **Diseño visual** | 🟡 95% similar | ✅ 100% igual |
| **Código interno** | 🟡 Diferente estructura | ✅ Estructura idéntica |
| **Datos ejemplo** | 🟡 Contenido similar | ✅ Contenido idéntico |
| **Tiempo desarrollo** | ⚡ Más rápido | 🐌 Más lento |
| **Flexibilidad** | ✅ Alta | 🟡 Limitada |

## 🎯 RECOMENDACIÓN

**Para uso general**: Usa los prompts generales - obtienes un sistema completamente funcional con diseño profesional.

**Para replicación exacta**: Necesitarías extraer especificaciones exactas del código actual y crear prompts más detallados.

¿Te gustaría que extraiga las especificaciones exactas del proyecto actual para crear prompts de replicación idéntica?