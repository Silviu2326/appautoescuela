# Arquitectura de la versión 0.2

## Cliente

`App.tsx` contiene las cuatro pestañas y una pila local de pantallas. `src/state/Store.tsx` centraliza progreso y contenido, con una referencia síncrona para evitar dobles correcciones y una cola de escritura en AsyncStorage. La migración desde la primera versión conserva respuestas sin inventar confianza.

`src/engine/learning.ts` calcula evidencia por concepto, selecciona entrenamiento y separa evaluación. Consolidar exige aciertos sin ayuda ni dudas, tres días distintos, al menos dos variantes y un intervalo real de 48 horas. Una respuesta incorrecta, insegura o asistida reinicia la cadena. El tiempo de respuesta se registra sin penalizar el dominio por responder despacio.

La sesión de estudio conserva preguntas, elección, confianza, ayudas y correcciones. El simulacro conserva fecha límite absoluta, elecciones, posición y marcas; el tiempo sigue pasando al abandonar la pantalla. Las no contestadas cuentan como error. Actualizar contenido cierra sesiones abiertas para evitar mezclar versiones.

El contenido inicial vive en `src/data/catalog.ts`. Cada pregunta tiene familia, conceptos, versión, fuente, derechos y estado editorial. Las escenas utilizan reglas explícitas y SVG, no un motor general de tráfico. Los clips propios se generan con `scripts/create-risk-clips.py` (Pillow + ffmpeg).

Los tokens se guardan en SecureStore en móvil y sessionStorage en web. No hay una clave de proveedor en el bundle.

## Servidor

`server/app.ts` expone HTTP, SQLite y autorización alumno/editor. `server/provider.ts` aísla conversación, OCR y transcripción. `server/public/` aloja el editor y la vista de la nota compartida. El registro público solo crea alumnos.

Los intentos se combinan por identificador. Notas y marcadores usan la fecha de modificación y conservan marcas de borrado. La sincronización excluye sesiones activas. No hay sincronización en segundo plano ni notificaciones push.

Los enlaces compartidos contienen un secreto aleatorio en el fragmento de URL. La página lo retira de la barra y lo envía en el cuerpo de la petición. Solo se conserva su hash en la base. El enlace permite comentar sin identificar al profesor: la interfaz lo presenta como una observación recibida mediante enlace, no una firma del docente.

La publicación comprueba la versión base, valida el contenido y registra una nueva versión en una transacción. Editar conceptos o escenas incrementa las versiones de preguntas dependientes y reinicia su revisión. Restaurar crea una nueva versión sin borrar el historial. Los contenidos iniciales son de demostración.

| Ruta | Acceso | Función |
| --- | --- | --- |
| GET /api/health, /api/content | Público | Capacidades y contenido |
| POST /api/register, /api/login | Público | Cuenta y token |
| POST /api/sync | Cuenta | Combinar progreso |
| POST /api/shares | Cuenta | Crear enlace de nota |
| GET /api/shares | Propietario | Enlaces activos |
| POST /api/shares/revoke | Propietario | Revocar |
| POST /api/review | Secreto | Leer nota o comentar |
| GET /api/feedback | Propietario | Recuperar observación |
| POST /api/report | Cuenta | Incidencia |
| POST /api/tutor, /api/ocr, /api/transcribe | Cuenta y proveedor | Ayuda opcional |
| GET /api/admin/state | Editor | Contenido e historial |
| POST /api/admin/draft, /publish, /restore, /resolve | Editor | Flujo editorial |

Antes de abrir registro público, completar cuentas, operación y evaluación del proveedor. Las cuotas son en memoria y por proceso. SQLite requiere disco persistente y copias de seguridad. Ampliar el banco con situaciones independientes y revisadas antes de tratar sus resultados como evidencia de preparación para un examen real.
