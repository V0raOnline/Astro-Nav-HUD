# CHANGELOG

## v0.4 (junio 2025)

### Nuevas funcionalidades
- Motor de planetas real via astronomy-engine 2.1.19 (CDN)
- Posiciones planetarias calculadas para Carta Natal y Jyotish
- Sección simbólica desplegable con características arquetípicas por signo
- Datos simbólicos en YAML editables (src/data/)
- Carga dinámica de YAML con fallback embebido
- Tabla de ciudades ampliada (El Casar, más ciudades latinoamericanas)
- Badges de estado por columna (LIVE)

### Correcciones
- **CRÍTICO**: Anchor JDN del Tonalpohualli corregido (2299158 → 2276849)
  - El valor anterior correspondía al inicio del calendario gregoriano, no al anchor de Alfonso Caso
  - Producía signos incorrectos para todas las fechas
- API de astronomy-engine corregida: GeoVector() + Ecliptic() en lugar de EclipticLongitude() (no existe)
- Fórmula ayanamsa Lahiri corregida: 22.4602 + (year-1900)*0.013961
- Cálculo de trecena corregido en Tonalpohualli y Tzolkin (usaba índice de trecena, no posición del día 1)
- Race condition en actualización simbólica resuelta (valores capturados durante cálculo, no leídos del DOM)

### Validación
Valores de referencia para 03/04/1974 09:20 Madrid (UTC 07:20):
- Tonalpohualli: 11 Ollin, trecena 1 Mazatl, Señor Xiuhtecuhtli
- Tzolkin: 6 Etznab, trecena 1 Ben, Long Count 12.18.0.12.18, Haab 16 Cumku
- Carta natal: Sol 13° Aries, Luna 26° Leo, ASC 14° Tauro, MC 25° Capricornio
- Jyotish: Lagna Mesha, Luna Simha, Nakshatra Magha, Mahadasha Rahu (2022-2040)

---

## v0.3 (junio 2025)

### Nuevas funcionalidades
- Motores Tonalpohualli y Tzolkin activos en JS (sin dependencias externas)
- Cálculo de Ascendente y MC en tiempo real
- Tabla de geocodificación de ciudades
- Manejo de offset UTC por país y mes (verano/invierno)
- Botón CALCULAR funcional

### Correcciones
- Bug de encoding: guión largo (−) en lugar de guión ASCII (-) en offsets negativos

---

## v0.2 (junio 2025)

### Funcionalidades
- HUD estático con datos hardcodeados para 03/04/1974 Madrid
- Cuatro columnas: Tonalpohualli, Tzolkin, Carta Natal, Jyotish
- Iconos SVG por sistema (Ollin, Etznab, rueda natal, Sri Yantra)
- Campo de estrellas animado, línea de scan
- Fila de síntesis inferior

---

## v0.1 (junio 2025)

### Funcionalidades
- Prototipo inicial de interfaz HUD
- Estética: fondo oscuro, tipografía ámbar, monoespaciada
- Estructura de cuatro columnas paralelas
