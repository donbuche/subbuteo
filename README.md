# Subbuteo Marcador

Marcador digital de escritorio para partidas de Subbuteo (fútbol de mesa). Electron + Vite (electron-vite), JavaScript vanilla, SCSS y Tailwind CSS v4.

## Puesta en marcha

```bash
npm install
npm run dev        # desarrollo con recarga en caliente
npm run build      # compila a out/
npm run dist:mac   # empaqueta .dmg en dist/ (también dist:win y dist:linux)
```

Necesitas Node 20 o superior.

## Estructura

```
src/
  main/            Proceso principal: ventanas, splash, IPC, protocolo media://
    store.js       Persistencia en JSON (userData/subbuteo-data.json)
  preload/         Puente seguro window.api entre renderer y main
  shared/          Datos por defecto (equipos, duraciones) y generador de escudos
  renderer/
    index.html     Ventana principal
    splash.html    Splash de Ariane webdesign (2 s)
    public/        Logotipos y escudos (sustituibles)
    src/
      core/        Estado, router, audio (Web Audio), iconos, utilidades
      components/  Barra superior, modales y avisos
      views/       home, setup (nuevo partido), match, history, settings
      styles/      tailwind.css, parciales SCSS y custom-styles.scss
```

## Sustituir los recursos provisionales

Los logotipos y escudos son provisionales. Sustitúyelos manteniendo el nombre del archivo:

- `src/renderer/public/images/ariane-logo.svg`: splash
- `src/renderer/public/images/subbuteo-logo.svg`: cabecera
- `src/renderer/public/crests/<id-equipo>.svg`: escudos de los equipos por defecto

Si prefieres PNG, cambia la extensión en `src/shared/defaults.js`. `npm run crests` regenera los escudos provisionales.

Desde **Configuración** también puedes cambiar el escudo de cualquier equipo sin tocar el código.

## Sonidos y música

Por defecto, el silbato, la grada y el tema de fondo se sintetizan con Web Audio API, así que no hay archivos ni licencias. En **Configuración → Sonidos / Música** puedes asignar tus propios MP3/WAV/OGG/M4A y crear una lista de reproducción. Los archivos importados se copian a `userData/media/`.

## Estilos

- Los tokens de color y tipografía están en `@theme` dentro de `styles/tailwind.css`.
- `styles/custom-styles.scss` se carga en último lugar y está vacío: es el sitio para los ajustes rápidos.

## Datos

El historial y la configuración se guardan en `~/Library/Application Support/Subbuteo Marcador/subbuteo-data.json` (macOS).
