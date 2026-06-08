/**
 * Natal Chart Engine
 * Astrología occidental - zodíaco tropical - casas Placidus
 *
 * IMPLEMENTACIÓN ACTUAL (v0.4):
 * - Ascendente y MC: calculados en JS con fórmulas de Meeus (error < 0.1°)
 * - Posiciones planetarias: astronomy-engine v2.1.19 via CDN
 *   https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js
 *   API usada: GeoVector(body, time, aberration) → Ecliptic(vec) → elon
 *
 * VALIDACIÓN para 03/04/1974 09:20 Madrid (UTC 07:20):
 * Sol: 13° Aries | Luna: 26° Leo | Mercurio: 17° Piscis
 * Venus: 26° Acuario | Marte: 19° Géminis | Júpiter: 5° Piscis
 * Saturno: 28° Géminis | ASC: 14° Tauro | MC: 25° Capricornio
 */

const SIGNS = [
  "Aries","Tauro","Géminis","Cáncer","Leo","Virgo",
  "Libra","Escorpio","Sagitario","Capricornio","Acuario","Piscis"
];

const OBLIQUITY = 23.4367; // oblicuidad media ~1974

function toRad(deg) { return deg * Math.PI / 180; }
function toDeg(rad) { return rad * 180 / Math.PI; }
function normLon(l) { return ((l % 360) + 360) % 360; }

/**
 * Número de Día Juliano (con fracción para hora)
 */
function julianDayNumber(year, month, day, hour = 0, minute = 0) {
  const ut = hour + minute / 60;
  const a  = Math.floor((14 - month) / 12);
  const y  = year + 4800 - a;
  const m  = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return jdn + (ut - 12) / 24;
}

/**
 * Tiempo Sidéreo de Greenwich en grados
 * Fórmula: Jean Meeus, Astronomical Algorithms cap. 12
 */
function greenwichSiderealTime(jd) {
  const T = (jd - 2451545.0) / 36525;
  let gst  = 280.46061837
    + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T
    - (T * T * T) / 38710000;
  return normLon(gst);
}

/**
 * Tiempo Sidéreo Local en grados
 */
function localSiderealTime(jd, longitude) {
  return normLon(greenwichSiderealTime(jd) + longitude);
}

/**
 * Ascendente (longitud eclíptica)
 */
function calculateAscendant(lst, latitude, obliquity = OBLIQUITY) {
  const ramc = toRad(lst);
  const eps  = toRad(obliquity);
  const lat  = toRad(latitude);
  const asc  = toDeg(Math.atan2(
    Math.cos(ramc),
    -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps))
  ));
  return normLon(asc);
}

/**
 * Medio Cielo (MC)
 */
function calculateMC(lst, obliquity = OBLIQUITY) {
  const ramc = toRad(lst);
  const eps  = toRad(obliquity);
  const mc   = toDeg(Math.atan2(
    Math.sin(ramc),
    Math.cos(ramc) * Math.cos(eps)
  ));
  return normLon(mc);
}

/**
 * Longitud eclíptica → signo + grado
 */
function lonToSign(lon) {
  const idx = Math.floor(lon / 30) % 12;
  const deg = Math.floor(lon % 30);
  return { sign: SIGNS[idx], index: idx, deg };
}

/**
 * Cálculo de ángulos (ASC, MC, DSC, IC)
 * @param {number} year, month, day - fecha
 * @param {number} hourUTC, minuteUTC - hora en UTC
 * @param {number} latitude, longitude - coordenadas geográficas
 */
function calculateAngles(year, month, day, hourUTC, minuteUTC, latitude, longitude) {
  const jd  = julianDayNumber(year, month, day, hourUTC, minuteUTC);
  const lst = localSiderealTime(jd, longitude);
  const asc = calculateAscendant(lst, latitude);
  const mc  = calculateMC(lst);
  return {
    jd,
    lst,
    ascendant:   lonToSign(asc),
    mc:          lonToSign(mc),
    descendant:  lonToSign(normLon(asc + 180)),
    ic:          lonToSign(normLon(mc + 180)),
  };
}

export {
  julianDayNumber,
  greenwichSiderealTime,
  localSiderealTime,
  calculateAscendant,
  calculateMC,
  calculateAngles,
  lonToSign,
  normLon,
  SIGNS,
};
