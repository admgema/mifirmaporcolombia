# Mi Firma por Colombia — Instrucciones de uso

## Estructura de archivos

```
mifirmaporcolombia/
├── index.html          ← Página principal
├── css/
│   └── style.css       ← Estilos visuales
├── js/
│   └── app.js          ← Lógica de canvas y descarga
├── img/
│   └── plantilla.png   ← TU PLANTILLA AQUÍ (ver abajo)
└── INSTRUCCIONES.md
```

## Cómo agregar tu plantilla real

1. Exporta tu diseño como **PNG** en resolución **1080 × 1080 px** (cuadrado, para redes sociales).
2. Nómbralo exactamente `plantilla.png`.
3. Colócalo dentro de la carpeta `img/`.
4. La página usará automáticamente tu imagen real en lugar del diseño de demostración.

## Personalizar la zona del nombre

En `js/app.js`, al inicio del archivo, encontrarás:

```js
const NAME_ZONE = {
  x:      0.08,   // distancia desde el borde izquierdo (0 = izquierda, 1 = derecha)
  y:      0.62,   // distancia desde el borde superior (0 = arriba, 1 = abajo)
  width:  0.84,   // ancho de la zona (fracción del total)
  height: 0.16,   // alto de la zona
};
```

Ajusta estos valores para que el nombre quede exactamente en el espacio en blanco de tu plantilla.

## Cómo publicar la página (sin costo)

### Opción A — GitHub Pages (recomendado)
1. Crea un repositorio en GitHub.
2. Sube todos los archivos.
3. Ve a Settings → Pages → Branch: main → Save.
4. Tu URL será: `https://tu-usuario.github.io/mifirmaporcolombia`

### Opción B — Netlify (arrastrar y soltar)
1. Ve a netlify.com → "Deploy manually".
2. Arrastra la carpeta del proyecto.
3. Listo, tienes URL pública en segundos.

### Opción C — Servidor propio
Sirve los archivos con cualquier servidor web estático (Apache, Nginx, etc.).
No se necesita backend, todo corre en el navegador del usuario.

## Notas técnicas

- Todo el procesamiento ocurre **en el navegador**. No se envía ningún dato a ningún servidor.
- La imagen se genera usando la API **Canvas** de HTML5.
- El archivo descargado es un PNG de 1080×1080 px, apto para todas las redes sociales.
