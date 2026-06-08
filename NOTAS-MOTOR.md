# Notas: Motor de Cálculo Real

## Estado actual (v0.2)
Los datos en index.html son estáticos — calculados con Python/ephem y hardcodeados.

## Para hacer el motor funcional en el navegador

### Opción A: astrologico (recomendada para empezar)
Librería JS con efemérides embebidas 1800-2100. Funciona sin servidor.
```
npm install astrologico
```
Cubre: posiciones planetarias, ascendente, casas Placidus.

### Opción B: Swiss Ephemeris WASM
Máxima precisión. Peso ~3MB. Más complejo de integrar.
https://github.com/8fold/swe-to-js

## Lo que ya está implementado (src/engines/)

- **tonalpohualli.js** — cálculo completo. Solo necesita fecha. Sin dependencias externas.
- **tzolkin.js** — cálculo completo. Solo necesita fecha. Sin dependencias externas.
- **natal.js** — GST, LST, Ascendente, MC. Pendiente: posiciones planetarias (necesita ephemeris).
- **jyotish.js** — ayanamsa Lahiri, nakshatras, dashas. Pendiente: posiciones planetarias.

## Orden de trabajo sugerido

1. Integrar tonalpohualli.js y tzolkin.js en index.html — son autónomos, se pueden activar ya.
2. Instalar astrologico o similar para posiciones planetarias.
3. Conectar natal.js y jyotish.js con las posiciones reales.
4. Añadir input de geocodificación (ciudad → lat/lon).

## Validación

Referencia para 03/04/1974 09:20 Madrid (calculado con Python/ephem):
- Sol: 13.16° Aries
- Luna: 26.04° Leo  
- Mercurio: 17.60° Piscis
- Venus: 26.75° Acuario
- Marte: 19.93° Géminis
- Júpiter: 5.83° Piscis
- Saturno: 28.86° Géminis
- ASC: 14.25° Tauro
- MC: 25.57° Capricornio
- Tonalpohualli: 11 Ollin (día 37/260)
- Tzolkin: 6 Etznab (día 58/260)
