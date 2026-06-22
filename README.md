# Astro-Nav HUD

Herramienta de navegación astrológica comparativa. Muestra en paralelo cuatro sistemas calendáricos/astrológicos para una fecha, hora y lugar de nacimiento dados.

## Filosofía

La herramienta muestra sin interpretar. Es una interfaz de navegación — despliega el mapa, no dice a dónde ir. Cada sistema es un corte distinto de una tomografía de la identidad: ninguno captura el todo, todos iluminan algo.

## Sistemas incluidos

- **Tonalpohualli** — calendario mexica de 260 días (náhuatl). Correlación Alfonso Caso. Validado contra azteccalendar.com.
- **Tzolkin** — calendario maya de 260 días. Correlación GMT. Tradición k'iche' viva.
- **Carta Natal occidental** — astrología helenística, zodíaco tropical, casas Placidus.
- **Jyotish** — astrología védica, zodíaco sidéreo, ayanamsa Lahiri.

## Uso

Requiere servidor local para cargar los YAML de datos simbólicos:

```bash
cd "Astro-Nav HUD"
npx serve .
```

Luego abrir `http://localhost:3000` en el navegador.

> ⚠️ No funciona con `file://` — los YAML se cargan via fetch() y requieren servidor HTTP.

## Estructura

```
Astro-Nav HUD/
├── index.html              # HUD principal
├── about.html              # Origen y filosofía del proyecto
├── overview.html           # Introducción a los cuatro marcos
├── tonalpohualli.html      # Marco detallado — Tonalpohualli
├── tzolkin.html            # Marco detallado — Tzolkin
├── natal.html              # Marco detallado — Carta Natal
├── jyotish.html            # Marco detallado — Jyotish
├── README.md
├── CHANGELOG.md
├── NOTAS-MOTOR.md
└── src/
    ├── engines/            # Motores de cálculo (referencia)
    │   ├── tonalpohualli.js
    │   ├── tzolkin.js
    │   ├── natal.js
    │   └── jyotish.js
    ├── data/               # Datos simbólicos editables en YAML
    │   ├── tonalpohualli.yaml          (20 signos)
    │   ├── tzolkin.yaml                (20 kins)
    │   ├── natal.yaml                  (12 signos tropicales)
    │   ├── jyotish-rashis.yaml         (12 rashis sidéreos)
    │   ├── jyotish-nakshatras.yaml     (27 nakshatras)
    │   ├── numeros-tonalpohualli.yaml  (13 números del ciclo)
    │   ├── senores-noche.yaml          (9 Señores de la Noche)
    │   ├── trecenas-tonalpohualli.yaml (20 trecenas, deidades regentes)
    │   └── mahadasha.yaml              (9 períodos Vimshottari)
    ├── lib/
    │   └── astronomy.browser.min.js   # astronomy-engine 2.1.19 (local)
    └── img/
        ├── About_banner.png
        ├── Ollin_banner.png
        ├── Tzolkin_banner.png
        ├── Helenista_banner.png
        └── Jyotish_banner.png
```

> ⚠️ La lógica de cálculo está embebida en `index.html` además de en `src/engines/`. Si se corrige un cálculo, hay que actualizarlo en ambos sitios.

## Dependencias

- **astronomy-engine 2.1.19** — servido localmente desde `src/lib/` (Edge bloquea el CDN)
- **Google Fonts** (CDN) — Share Tech Mono, Exo 2
- **Nominatim** (OpenStreetMap) — geocodificación

Sin npm, sin bundler, sin build. Un archivo HTML + archivos de datos.

## Validación de cálculos

Todos los motores validados contra fuentes externas (junio 2026):

| Sistema | Referencia | Resultado |
|---|---|---|
| Tonalpohualli | azteccalendar.com + Noche Triste | ✅ Correcto |
| Tzolkin | 21 dic 2012 = 4 Ahau | ✅ Correcto |
| Carta Natal | Efemérides estándar (<1° error) | ✅ Correcto |
| Jyotish | Ayanamsa Lahiri + nakshatras | ✅ Correcto |

Caso de prueba canónico: **3 abril 1974, 09:20, Madrid**
- Tonalpohualli: 6 Tecpatl · trecena 1 Acatl · Señor Tláloc
- Tzolkin: 6 Etznab · trecena 1 Ben
- Carta Natal: Sol 13° Aries · Luna 26° Leo · ASC 14° Tauro · MC 25° Capricornio
- Jyotish: Lagna Mesha · Luna Simha · Nakshatra Magha · Mahadasha Rahu

## Constantes de calibración críticas

```javascript
// Tonalpohualli
const T_ANCHOR_JDN = 2276828; // 1-Coatl = 13 ago 1521 jul = 23 ago 1521 greg
const T_ANCHOR_POS = 105;
const lordIndex = (jdn + 7) % 9; // Señor de la Noche

// Tzolkin
const GMT = 584283; // JDN del 0.0.0.0.0 maya = 4 Ahau

// Jyotish
const ayanamsa = 22.4602 + (year - 1900) * 0.013961; // Lahiri
```

## Edición de datos simbólicos

Los archivos YAML en `src/data/` son editables directamente. Estructura estándar:

```yaml
NombreSigno:
  keywords: "Palabra · Palabra · Palabra"
  description: "Descripción arquetípica."
```

## Fuentes de referencia

- **Tonalpohualli:** Códice Borgia, Códice Borbónico, Tonalamatl de Aubin, Alfonso Caso (*Los calendarios prehispánicos*), Sahagún (*Historia General de las Cosas de Nueva España*)
- **Tzolkin:** Tradición k'iche' viva, Barbara Tedlock (*Time and the Highland Maya*), correlación GMT
- **Carta natal:** Ptolomeo (*Tetrabiblos*), tradición helenística
- **Jyotish:** Brihat Parashara Hora Shastra, Brihat Jataka (Varahamihira)

## Notas

- Las trecenas del Tonalpohualli están verificadas contra el Códice Borbónico. Pendiente de revisión por especialistas en tradición nahua.
- El Tonalpohualli tradicionalmente comienza el día al amanecer, no a medianoche. Para nacimientos antes del amanecer, el día correcto sería el gregoriano anterior. No implementado.
- Las descripciones simbólicas son síntesis honestas de tradiciones complejas, inevitablemente parciales.

Si encuentras errores, inexactitudes o tienes conocimiento específico de alguno de estos sistemas, el repositorio está abierto.
