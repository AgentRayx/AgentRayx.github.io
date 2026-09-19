# AgentRayx / bitácora digital

Blog para GitHub Pages con archivo de writeups, búsqueda, categorías, animaciones, barra de progreso de lectura y un escritorio de escritura. Todo el código es editable. No necesita instalar dependencias.

## Vista previa local

Con Node.js instalado, abre una terminal en esta carpeta y ejecuta `npm run dev`. Visita http://127.0.0.1:4173.

## Publicar por primera vez

1. En tu cuenta **AgentRayx**, crea un repositorio llamado **AgentRayx.github.io** para usar la dirección `https://agentrayx.github.io/`. También puedes elegir otro nombre: GitHub lo publicará bajo una subruta.
2. Sube el contenido de esta carpeta a la rama `main`, incluyendo `.github/workflows/pages.yml`. Mantén `dist` como carpeta dentro del repositorio.
3. En el repositorio, entra en **Settings → Pages → Source → GitHub Actions**.
4. En **Actions → Publicar blog**, ejecuta el flujo. Los siguientes cambios en `main` se despliegan automáticamente.
5. La dirección definitiva aparece en **Settings → Pages** cuando el despliegue termina.

El flujo publica únicamente `dist`. Los enlaces relativos funcionan también en `usuario.github.io/repositorio/`.

## Tu escritorio

Cada writeup tiene una **portada independiente**. En **Portada del writeup → Subir portada**, elige un PNG, JPG o WebP de hasta 8 MB. Se optimiza automáticamente para web. Puedes reemplazarla, quitarla y añadir una descripción accesible. Aparece en la tarjeta del archivo, la entrada y la vista previa. El borrador conserva la imagen localmente; al publicar, el editor la sube como archivo separado a `dist/uploads/`, evitando cargar el archivo de artículos con portadas incorporadas. La carga de la imagen y el guardado del artículo son dos commits; un fallo intermedio puede dejar una imagen sin usar, sin perder el borrador.

**Byte**, el perrito con camiseta HTB, saluda al tocarlo en la portada. Sus animaciones respetan el ajuste de movimiento reducido y el control de animaciones del blog. El archivo y el prompt de generación están documentados en `ASSETS.md`.

Abre **Mi escritorio → Nueva entrada**. Escribe el título, la categoría, la descripción y tu historia. Los botones insertan formato Markdown y **Vista previa** muestra el resultado. Puedes importar `.md` o `.txt`, descargar una copia y añadir imágenes PNG, JPG, WebP o GIF de hasta 500 KB cada una.

Los borradores se guardan **solo en el navegador actual**. No se sincronizan entre dispositivos. Borrar los datos del navegador los elimina. Usa **Descargar .md** para conservar copias. Los borradores nunca se publican hasta pulsar **Publicar en GitHub** con una conexión válida.

Los tres artículos iniciales están identificados como ejemplos. Puedes editarlos desde la sección **En el archivo**. Para quitar un artículo publicado, elimina su objeto de `dist/posts.json` en GitHub; eliminar un borrador en el editor no quita una publicación.

## Conectar la publicación

Crea un token de acceso de granularidad fina en GitHub, limitado al repositorio del blog, con permiso **Contents: Read and write**. En **Conectar GitHub**, indica `AgentRayx/AgentRayx.github.io`, rama `main`, y el token.

El token se mantiene **solo en memoria**. Recargar la página o desconectar lo elimina; nunca se guarda en el repositorio ni en el almacenamiento del navegador. No lo envíes por chat. El panel es accesible públicamente, pero modificar el repositorio requiere un token con permisos de escritura.

**Publicar en GitHub** crea un commit en `dist/posts.json`. La confirmación indica que GitHub recibió el cambio, no que el despliegue haya terminado. Comprueba **Actions** para ver el estado del despliegue. Las reglas de protección de rama pueden impedir los commits directos.

Antes de guardar se comprueba que la entrada remota no haya cambiado desde que comenzaste a editarla. Ante un conflicto, descarga el borrador, consulta la versión en GitHub y compara los cambios. El editor no sobrescribe versiones remotas diferentes automáticamente.

## Personalización

En **Mi escritorio → Personalizar** puedes cambiar el nombre, los textos de presentación, el color de acento y las animaciones. **Probar en el blog** aplica los cambios a la sesión actual. **Publicar apariencia** los guarda en GitHub para todos los visitantes. Se respeta la preferencia de movimiento reducido del dispositivo.

Para cambiar cualquier parte del diseño:

- `dist/app.js`: estructura, comportamiento y valores iniciales.
- `dist/style.css` y `dist/personality.css`: distribución, colores, tipografías y animaciones.
- `dist/index.html`: estructura base y metadatos.
- `dist/favicon.svg`: icono de la pestaña.
- `dist/posts.json`: artículos y configuración publicada.

## Límites de esta primera versión

- El formato admite títulos, negrita, cursiva, listas simples, citas, enlaces, imágenes y código. El HTML del autor se escapa para evitar ejecución de scripts.
- Las imágenes subidas se incorporan al archivo de artículos. El archivo total se limita a **900 KB** para editarlo con la API utilizada. Para muchas capturas, usa imágenes alojadas en enlaces HTTPS mediante `![Descripción](https://...)`.
- Las entradas usan enlaces con `#`; no generan un archivo HTML independiente ni metadatos sociales por artículo.
- No incluye comentarios, cuentas de lectores ni analíticas.
- Las fuentes de Google tienen fuentes de respaldo si no hay conexión.
- Los textos publicados y el historial de un repositorio público son públicos.

## Verificación

`npm run check` comprueba la sintaxis. `npm test` verifica el renderizado Markdown y el bloqueo de enlaces inseguros.

Referencias: [Configuración de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [API de contenidos de GitHub](https://docs.github.com/en/rest/repos/contents).
