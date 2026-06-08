/**
 * Jyotish Engine
 * Astrología védica - zodíaco sidéreo
 * Ayanamsa Lahiri (Chitrapaksha)
 * NOTA: Este motor requiere posiciones planetarias externas (ephemeris).
 * Por ahora implementa: ayanamsa, nakshatras, y cálculo de dashas.
 * Las posiciones planetarias requieren integración con Swiss Ephemeris o similar.
 */

// Ayanamsa Lahiri aproximado por año
// Fórmula lineal válida para el siglo XX-XXI (error < 0.01°)
function lahiriAyanamsa(year) {
  return 23.85 + (year - 2000) * 0.01396;
}

// 12 signos sidéreos (Rashis)
const RASHIS = [
  { sanskrit: "Mesha",       es: "Aries"       },
  { sanskrit: "Vrishabha",   es: "Tauro"       },
  { sanskrit: "Mithuna",     es: "Géminis"     },
  { sanskrit: "Kataka",      es: "Cáncer"      },
  { sanskrit: "Simha",       es: "Leo"         },
  { sanskrit: "Kanya",       es: "Virgo"       },
  { sanskrit: "Tula",        es: "Libra"       },
  { sanskrit: "Vrischika",   es: "Escorpio"    },
  { sanskrit: "Dhanus",      es: "Sagitario"   },
  { sanskrit: "Makara",      es: "Capricornio" },
  { sanskrit: "Kumbha",      es: "Acuario"     },
  { sanskrit: "Mīna",        es: "Piscis"      },
];

// 27 Nakshatras con sus señores (para Vimshottari Dasha)
const NAKSHATRAS = [
  { name: "Ashwini",           lord: "Ketu",    years: 7  },
  { name: "Bharani",           lord: "Venus",   years: 20 },
  { name: "Krittika",          lord: "Sun",     years: 6  },
  { name: "Rohini",            lord: "Moon",    years: 10 },
  { name: "Mrigashira",        lord: "Mars",    years: 7  },
  { name: "Ardra",             lord: "Rahu",    years: 18 },
  { name: "Punarvasu",         lord: "Jupiter", years: 16 },
  { name: "Pushya",            lord: "Saturn",  years: 19 },
  { name: "Ashlesha",          lord: "Mercury", years: 17 },
  { name: "Magha",             lord: "Ketu",    years: 7  },
  { name: "Purva Phalguni",    lord: "Venus",   years: 20 },
  { name: "Uttara Phalguni",   lord: "Sun",     years: 6  },
  { name: "Hasta",             lord: "Moon",    years: 10 },
  { name: "Chitra",            lord: "Mars",    years: 7  },
  { name: "Swati",             lord: "Rahu",    years: 18 },
  { name: "Vishakha",          lord: "Jupiter", years: 16 },
  { name: "Anuradha",          lord: "Saturn",  years: 19 },
  { name: "Jyeshtha",          lord: "Mercury", years: 17 },
  { name: "Mula",              lord: "Ketu",    years: 7  },
  { name: "Purva Ashadha",     lord: "Venus",   years: 20 },
  { name: "Uttara Ashadha",    lord: "Sun",     years: 6  },
  { name: "Shravana",          lord: "Moon",    years: 10 },
  { name: "Dhanishtha",        lord: "Mars",    years: 7  },
  { name: "Shatabhisha",       lord: "Rahu",    years: 18 },
  { name: "Purva Bhadrapada",  lord: "Jupiter", years: 16 },
  { name: "Uttara Bhadrapada", lord: "Saturn",  years: 19 },
  { name: "Revati",            lord: "Mercury", years: 17 },
];

const NAKSHATRA_SPAN = 360 / 27; // 13.333...°

// Secuencia Vimshottari Dasha (120 años total)
const DASHA_SEQUENCE = [
  "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"
];

function getNakshatra(moonLonSidereal) {
  const idx = Math.floor(moonLonSidereal / NAKSHATRA_SPAN);
  const degWithin = moonLonSidereal % NAKSHATRA_SPAN;
  const fraction = degWithin / NAKSHATRA_SPAN;
  return { nakshatra: NAKSHATRAS[idx], index: idx, fraction };
}

function getRashi(lonSidereal) {
  const idx = Math.floor(lonSidereal / 30) % 12;
  const deg = lonSidereal % 30;
  return { rashi: RASHIS[idx], deg: deg.toFixed(2) };
}

/**
 * Calcula el timeline de Mahadasha Vimshottari
 * @param {number} birthYear - año decimal (e.g. 1974.25)
 * @param {object} nakshatraResult - resultado de getNakshatra()
 * @returns {Array} timeline de dashas con fechas inicio/fin
 */
function getDashaTimeline(birthYear, nakshatraResult) {
  const { nakshatra, fraction } = nakshatraResult;

  // Porción ya transcurrida del dasha de nacimiento
  const elapsed = fraction * nakshatra.years;
  const startYear = birthYear - elapsed;

  // Encontrar posición en secuencia
  const startIdx = DASHA_SEQUENCE.indexOf(nakshatra.lord);

  const timeline = [];
  let current = startYear;

  for (let i = 0; i < 9; i++) {
    const idx = (startIdx + i) % 9;
    const lordName = DASHA_SEQUENCE[idx];
    const nk = NAKSHATRAS.find(n => n.lord === lordName && 
      DASHA_SEQUENCE.indexOf(lordName) === idx % 9);
    // Buscar años correctos por posición en secuencia
    const years = getYearsForLord(lordName, startIdx, i);
    timeline.push({
      lord: lordName,
      start: current,
      end: current + years,
      years,
    });
    current += years;
  }

  return timeline;
}

function getYearsForLord(lord, startIdx, offset) {
  const seqIdx = (startIdx + offset) % 9;
  const lords = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
  const years  = [7, 20, 6, 10, 7, 18, 16, 19, 17];
  return years[seqIdx];
}

// Conversión longitud tropical → sidérea
function toSidereal(tropicalLon, year) {
  return ((tropicalLon - lahiriAyanamsa(year)) % 360 + 360) % 360;
}

export {
  lahiriAyanamsa,
  getNakshatra,
  getRashi,
  getDashaTimeline,
  toSidereal,
  RASHIS,
  NAKSHATRAS,
  DASHA_SEQUENCE,
};
