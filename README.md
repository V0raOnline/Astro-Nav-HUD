# Astro-Nav HUD

Herramienta de navegación astrológica comparativa. Muestra en paralelo cuatro sistemas calendáricos/astrológicos para una fecha, hora y lugar de nacimiento dados.

## Filosofía

La herramienta muestra sin interpretar. Despliega el mapa — no dice a dónde ir.

## Sistemas incluidos

- **Tonalpohualli** — calendario mexica de 260 días (náhuatl). Correlación Alfonso Caso.
- **Tzolkin** — calendario maya de 260 días. Correlación GMT.
- **Carta Natal occidental** — astrología helenística, zodíaco tropical, casas Placidus.
- **Jyotish** — astrología védica, zodíaco sidéreo, ayanamsa Lahiri.

## Uso

Requiere servidor local para cargar los YAML de datos simbólicos:

```bash
cd "Astro-Nav HUD"
npx serve .
```

Luego abrir `http://localhost:3000` en el navegador.

## Estructura

```
Astro-Nav HUD/
├── index.html              # HUD principal (v0.4)
├── README.md
├── CHANGELOG.md
├── NOTAS-MOTOR.md
└── src/
    ├── engines/            # Motores de cálculo
    │   ├── tonalpohualli.js
    │   ├── tzolkin.js
    │   ├── natal.js
    │   └── jyotish.js
    └── data/               # Datos simbólicos editables
        ├── tonalpohualli.yaml    (20 signos)
        ├── tzolkin.yaml          (20 kins)
        ├── natal.yaml            (12 signos tropicales)
        ├── jyotish-rashis.yaml   (12 rashis)
        └── jyotish-nakshatras.yaml (27 nakshatras)
```

## Dependencias externas

- **astronomy-engine 2.1.19** (CDN) — posiciones planetarias
- **Google Fonts** (CDN) — Share Tech Mono, Exo 2

Sin npm, sin bundler. Un archivo HTML + archivos de datos.

## Edición de datos simbólicos

Los archivos YAML en `src/data/` son editables directamente. Estructura:

```yaml
NombreSigno:
  keywords: "Palabra · Palabra · Palabra"
  description: "Descripción arquetípica de una o dos líneas."
```

El HUD los carga via fetch() al iniciar. Si no encuentra algún archivo, activa el fallback embebido.

## Fuentes de referencia

- Tonalpohualli: Códice Borgia, Códice Borbónico, Alfonso Caso (*Los calendarios prehispánicos*)
- Tzolkin: tradición k'iche' viva, Barbara Tedlock (*Time and the Highland Maya*)
- Carta natal: Ptolomeo (*Tetrabiblos*), tradición helenística
- Jyotish: Brihat Parashara Hora Shastra, Brihat Jataka (Varahamihira)

## Estado

v0.4 — cuatro motores activos, datos simbólicos en YAML, sección desplegable.

Pendiente v0.5:
- Descripciones Jyotish diferenciadas de las occidentales
- Traducciones al inglés
- Dial planetario para carta natal
- Geocodificación completa (tabla actual: ~25 ciudades)
