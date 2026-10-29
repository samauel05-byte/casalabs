# CaSa Labs 3.0 — auditoría y ejecución

Fecha: 2026-10-29.
Estado: diagnóstico estático realizado; pruebas de ejecución pendientes.
Referencia: c0bd98a15d97b631b60a334c3149de45088be80f.
Rama de trabajo: feat/casalabs-3.
Referencia de respaldo Git: backup/casalabs-pre-3-2026-10-29 (SHA verificado).
Una rama en el mismo repositorio no es una copia independiente ni un respaldo de datos externos.

## Alcance comprobado
HTML/CSS/JavaScript sin framework ni build; API serverless api/chat.js.
Páginas: /, /servicios, /nosotros, /preguntas-frecuentes, /contacto,
/tescucho, /gracias-tescucho, /politica-cookies.
Recursos: assets/, css/style.css, js/main.js, js/footer.js, js/yerleny.js.
Portada con estilos y lógica independientes.
Vercel: cleanUrls, trailingSlash false, CSP y cabeceras de seguridad.
README declara publicación automática de main; configuración real pendiente.
No se localizaron panel administrativo, autenticación, roles, esquema de datos,
CRM ni workflows en el árbol auditado. No implica que no existan externamente.
OPENROUTER_API_KEY está referenciada; valor y configuración no inspeccionados.
PayPal incluye compra web y suscripciones de mantenimiento, Direct y TescuchO.
Contacto prepara WhatsApp: no persiste prospectos ni demuestra recepción.
Yerleny usa OpenRouter y respuestas locales; no se ha probado el proveedor.

## Matriz de preservación
| Funcionalidad | Ruta | Dependencias | Estado actual | Prueba de referencia | Cambio previsto | Resultado esperado |
|---|---|---|---|---|---|---|
| Navegación | Todas | HTML/CSS/JS | Código presente | Rutas y teclado | Modernizar visualmente | Acceso conservado |
| Catálogo | /servicios | Pestañas y contenido | Código presente | Todas las categorías | Modernizar visualmente | Servicios conservados |
| Compra web | /servicios | PayPal Orders | Sin prueba de ejecución | Sandbox: éxito, cancelación, error | Conservar contrato | Compra verificada |
| Suscripciones | /servicios, /tescucho | SDK y planes PayPal | Sin prueba de ejecución | Sandbox y verificación de estado | Mejorar funcionalmente | Confirmación fiable |
| Descarga | /gracias-tescucho | Instalador/licencia | EXE ausente del árbol | Entrega y autorización | Corregir tras diagnóstico | Descarga autorizada |
| Contacto | /contacto | WhatsApp | Mensaje preparado | Validación y apertura | Conservar y ampliar | Registro persistido antes de confirmar |
| Yerleny | /api/chat | OpenRouter | Endpoint y fallback presentes | Respuesta/fallo/límites | Mejorar funcionalmente | Conocimiento veraz |
| Productos | / | Contenido comercial | Publicado en código | Destinos y autorizaciones | Modernizar visualmente | Acciones reales |
| FAQ | /, /preguntas-frecuentes | Dos implementaciones | Código presente | Teclado y estados | Modernizar visualmente | Acceso completo |
| Consentimiento | /, /politica-cookies | localStorage | Parcial | Guardar y reabrir | Corregir errores | Preferencias modificables |
| SEO | Páginas/sitemap | Metadatos | Parcial | Canonical/indexación | Preservar y corregir | URLs conservadas |
| CRM/administración | Por confirmar | Sistema externo | No localizado | Identificar fuente y permisos | Nueva capacidad si procede | Una fuente de datos |

## Hallazgos
1. Catálogo web US$350 frente a planes 250/499/800 en portada, schema y asistente.
   Confirmar tarifas autorizadas antes de unificar; no elegir una arbitrariamente.
2. /downloads/TescuchO-Setup.exe no está versionado; downloads/ solo tiene .gitkeep.
   Comprobar si existe entrega externa.
3. Gracias afirma licencia activa sin verificación del servidor y muestra sub desde URL.
   No se localizaron webhooks ni verificación de suscripciones en este repositorio.
4. API chat no limita mensajes ni valida roles/contenido; no tiene timeout explícito
   ni tratamiento adecuado del estado HTTP del proveedor. Pruebas pendientes.
5. CSP no admite cdnjs.cloudflare.com, utilizado por GSAP en portada.
6. Consentimiento sale anticipadamente con preferencias guardadas; no se encontró
   reapertura persistente. La política y su retención deben reflejar implementación real.
7. Testimonios, cifras e interfaces publicadas requieren acreditar autorización y origen.
8. Sitemap no incluye /tescucho; gracias declara noindex.
9. Recursos assets/ tienen caché immutable anual sin nombres con hash:
   versionar URLs de recursos modificados para evitar contenido antiguo.

## Arquitectura aprobable
Mantener arquitectura estática inicialmente; módulos JS y CSS compartidos.
Paleta oficial y logo existentes, tokens visuales y componentes accesibles.
Hero con mejora progresiva, escena Three.js ligera solo si las pruebas justifican
su coste; contenido y CTA disponibles sin WebGL. Alternativa estática,
prefers-reduced-motion, control manual y suspensión fuera de pantalla.
Una estrategia de animación; resolver CSP sin ampliar orígenes innecesariamente.
Catálogo y base de conocimiento con información autorizada.
Capa comercial del servidor: validación, identificadores, idempotencia,
persistencia y notificaciones verificadas. No confirmar envío sin aceptación real.
Integrar CRM/panel existente antes de diseñar otra fuente de datos.
No crear esquema de datos definitivo hasta identificar sistemas externos.
No instalar todas las tecnologías sugeridas ni migrar a Next.js por defecto.

## Entregas y puertas de calidad
1. Diagnóstico: completar acceso operativo, respaldo independiente, baseline y rollback.
2. Design system: tokens, navegación, componentes; teclado, contraste y responsive.
3. Experiencia principal: hero/servicios; sin WebGL y sin movimiento sigue funcionando.
4. Productos: contenido y capturas reales; enlaces y autorización verificados.
5. Conversión: solicitudes persistidas, notificaciones, asistente y CRM probados.
6. Administración: operaciones y permisos probados sin pérdida de módulos.
7. Calidad: rutas, formularios, pagos sandbox, seguridad, SEO, accesibilidad y rendimiento.
8. Publicación: staging, revisión, autorización de producción y recuperación preparada.
No avanzar una entrega como completada si falla su puerta de calidad.
Helias Oils no inspeccionado visualmente: navegador no disponible.

## Plan de pruebas
Inventariar enlaces internos/externos y fragmentos.
Comparar antes/después en móvil y escritorio.
Navegación por teclado, foco, Escape, lectores de pantalla y movimiento reducido.
Validación de contacto, popup bloqueado, proveedor caído y reintentos.
PayPal sandbox: compra, suscripción, cancelación, duplicados, fallos y verificación servidor.
Chat: métodos, body inválido, roles no permitidos, tamaño, timeout y upstream no exitoso.
Cotizador: persistencia, consentimiento, duplicados y entrega de notificación.
Permisos administrativos y aislamiento entre roles.
SEO canonical, sitemap, noindex, redirecciones y recursos.
Lighthouse/Core Web Vitals: medir baseline antes de establecer comparación.
No ejecutar cobros reales ni enviar mensajes a clientes durante pruebas.

## Respaldo y reversión
Antes de cambios funcionales, generar git bundle completo en entorno operativo,
verificar con git bundle verify y restaurar en un directorio limpio.
Registrar checksum del archivo y comparación de refs/árbol.
Identificar deployment estable de Vercel y comprobar procedimiento de rollback.
Inventariar y respaldar sistemas de datos externos antes de migraciones.
Revertir cambios de código por commits revisables; nunca reset forzado de main.
No borrar datos ni credenciales. Rollback de código no equivale a restauración de datos.
La rama backup conserva la referencia Git; copia independiente y recuperación
del despliegue todavía no realizadas.

## Bloqueos reales
El entorno seleccionado falló al iniciarse; exec_command confirma que no existe
un entorno utilizable. No hay navegador disponible.
No se pueden ejecutar pruebas ni verificar el sitio en vivo en esta sesión.
Faltan identificación de CRM/panel externo, tarifas autorizadas, material comercial
autorizado y configuración de sandbox para pruebas integrales.
No solicitar claves por chat; utilizar conexiones seguras y configuración del proveedor.

## Registro de cambios
2026-10-29: referencias backup y feat creadas desde baseline y verificadas por GitHub.
2026-10-29: auditoría y plan documentados. Sin cambios de aplicación ni producción.
