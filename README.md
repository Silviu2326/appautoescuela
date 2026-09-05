# A punto · autoescuela

Aplicación móvil en español para estudiar el permiso B, construida con React Native, Expo 57 y TypeScript. Incluye servidor Node.js/SQLite y panel editorial web.

## Arranque

Requiere Node.js 24 o posterior.

```bash
npm ci
npm start
```

Escanea el QR con una versión compatible de Expo Go, o utiliza un development build. Para la vista web: `npm run web`. El proyecto incluye configuración para Android e iOS; no incluye un APK/IPA firmado.

## Funciones

- **Hoy:** sesiones de 5, 10 o 20 minutos, fecha objetivo y recuperación de sesiones interrumpidas.
- **Aprender:** conceptos relacionados, requisitos previos, ejemplos y errores habituales.
- **Practicar:** entrenamiento adaptativo, preguntas guardadas, cruces interactivos, clips animados de riesgo y simulacro de 30 preguntas/30 minutos.
- **Mi avance:** estados de aprendizaje, repasos espaciados, historial, diario editable y sincronización manual.
- **Tutor:** guía local sin conexión; conversación contextual, dictado y lectura de capturas mediante un proveedor opcional. Confirmación del texto reconocido y lectura en voz alta mediante el dispositivo.
- **Profesor:** enlaces de una nota, con caducidad de siete días, observaciones y revocación por el alumno.
- **Edición:** conceptos, preguntas y escenas; borradores, fuentes, derechos, revisión, retirada, publicación, incidencias y restauración de versiones.

El contenido incluido es **un banco piloto original**: 65 ejercicios (35 de entrenamiento y 30 de evaluación), 10 conceptos, 5 cruces y 2 clips diagramáticos. Las variantes de evaluación comparten familias y algunas solo cambian la formulación. No equivale a 65 situaciones independientes, no cubre todo el temario y está pendiente de revisión profesional. Las fuentes están enlazadas desde cada ejercicio.

## Servidor y cuentas

```bash
npm run server:init
npm run server
```

El asistente solicita el correo del editor y escribe una contraseña aleatoria en `server/.env`, excluido de Git. Consulta ese archivo localmente para entrar en `http://localhost:3001/admin`. No compartas ni subas el archivo. La base SQLite se crea en `server/data/`.

En la app abre **Mi avance → Plan, cuenta y contenido**. Introduce la dirección del servidor y crea una cuenta de alumno con una contraseña de al menos 12 caracteres. La app funciona sin cuenta. Sincronizar es una acción explícita que incluye historial, marcadores, plan y diario. Las sesiones en curso permanecen en su dispositivo.

Para probar desde un teléfono en tu red, establece `HOST=0.0.0.0` y usa la IP LAN del ordenador, por ejemplo `http://192.168.1.20:3001`. Para un cliente web añade su origen exacto a `ALLOWED_ORIGINS`. Incluye también el origen del servidor para el editor y la página del profesor. La aplicación exige HTTPS fuera de las direcciones locales admitidas.

Configura `PUBLIC_URL` con el origen accesible por el profesor para generar enlaces. Una dirección local solo funciona dentro de esa red. Este repositorio no despliega un servidor público.

## IA, voz y capturas

En `server/.env`, establece `OPENAI_API_KEY`; `OPENAI_MODEL` permite cambiar el modelo conversacional (por defecto `gpt-4.1-mini`). La transcripción utiliza `gpt-4o-mini-transcribe`. Reinicia el servidor. La clave se usa exclusivamente en el servidor.

Sin clave, las funciones que necesitan proveedor se muestran como no disponibles y la guía local sigue funcionando. Mensajes, imágenes y audios solo se envían tras la acción correspondiente del usuario. El adaptador conversacional utiliza el contexto editorial y `store: false`; no incorpora búsqueda web. Las llamadas reales al proveedor no se han validado en este entorno por falta de credenciales y pueden tener coste.

## Verificación

```bash
npm run typecheck
npm run content:check
npm test
npm run export:web
npx expo export --platform android --platform ios --output-dir dist-native
```

Las pruebas cubren aprendizaje espaciado, confianza/ayudas, migración, fusión de datos, retirada/versionado, separación de bancos, roles, aislamiento de cuentas, enlaces revocables y publicación/restauración editorial. La exportación genera bundles; no sustituye una prueba en dispositivos físicos.

## Límites del piloto

El servidor utiliza scrypt, tokens opacos con caducidad y cuotas básicas. Faltan verificación de correo, recuperación de contraseña, gestión completa de eliminación/exportación de cuenta, copias de seguridad operadas, monitorización y pruebas de carga. La sincronización usa marcas temporales del dispositivo; los relojes desajustados pueden afectar a conflictos simultáneos.

La preparación mostrada describe los simulacros realizados: no calcula una probabilidad de aprobar. El contenido necesita validación profesional y ampliación sustancial. Deben verificarse audio, permisos, galería, reproducción y lectores de pantalla en Android e iOS reales antes de distribuir la aplicación.

Consulta [la arquitectura](docs/ARQUITECTURA.md) para extender el proyecto.
