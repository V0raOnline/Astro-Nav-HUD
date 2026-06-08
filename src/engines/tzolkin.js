/**
 * Tzolkin Engine
 * Calendario maya de 260 días
 * Correlación GMT (Goodman-Martinez-Thompson)
 * Anchor: JDN 584283 = Long Count 0.0.0.0.0 = 4 Ahau (día 160 del ciclo)
 */

const SIGNS = [
  { maya: "Imix",       es: "Dragón de Agua" },
  { maya: "Ik",         es: "Viento"         },
  { maya: "Akbal",      es: "Noche"          },
  { maya: "Kan",        es: "Lagarto"        },
  { maya: "Chicchan",   es: "Serpiente"      },
  { maya: "Cimi",       es: "Muerte"         },
  { maya: "Manik",      es: "Venado"         },
  { maya: "Lamat",      es: "Estrella"       },
  { maya: "Muluc",      es: "Agua"           },
  { maya: "Oc",         es: "Perro"          },
  { maya: "Chuen",      es: "Mono"           },
  { maya: "Eb",         es: "Camino"         },
  { maya: "Ben",        es: "Caña"           },
  { maya: "Ix",         es: "Jaguar"         },
  { maya: "Men",        es: "Águila"         },
  { maya: "Cib",        es: "Guerrero"       },
  { maya: "Caban",      es: "Tierra"         },
  { maya: "Etznab",     es: "Espejo"         },
  { maya: "Cauac",      es: "Tormenta"       },
  { maya: "Ahau",       es: "Sol"            },
];

// Meses Haab
const HAAB_MONTHS = [
  "Pop","Uo","Zip","Zotz","Tzec","Xul","Yaxkin","Mol",
  "Chen","Yax","Zac","Ceh","Mac","Kankin","Muan","Pax",
  "Kayab","Cumku","Uayeb"
];

// GMT anchor: JDN 584283 = 4 Ahau = día 160 del ciclo Tzolkin
const GMT_JDN    = 584283;
const ANCHOR_POS = 160;

function julianDayNumber(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function calculateLongCount(jdn) {
  const days = jdn - GMT_JDN;
  const baktun  = Math.floor(days / 144000);
  const rem1    = days % 144000;
  const katun   = Math.floor(rem1 / 7200);
  const rem2    = rem1 % 7200;
  const tun     = Math.floor(rem2 / 360);
  const rem3    = rem2 % 360;
  const uinal   = Math.floor(rem3 / 20);
  const kin     = rem3 % 20;
  return `${baktun}.${katun}.${tun}.${uinal}.${kin}`;
}

function calculateHaab(jdn) {
  // 0.0.0.0.0 = 8 Cumku → posición 348 en ciclo Haab de 365
  const haabPos   = ((jdn - GMT_JDN) + 348) % 365;
  const monthIdx  = Math.min(Math.floor(haabPos / 20), 18);
  const dayInMonth = haabPos % 20;
  return { day: dayInMonth, month: HAAB_MONTHS[monthIdx] };
}

function calculate(year, month, day) {
  const jdn  = julianDayNumber(year, month, day);
  const diff = jdn - GMT_JDN;
  const pos  = ((ANCHOR_POS - 1 + diff) % 260 + 260) % 260 + 1;

  const signIndex = (pos - 1) % 20;
  const number    = (pos - 1) % 13 + 1;

  const trecenaNum       = Math.floor((pos - 1) / 13) + 1;
  const trecenaStart     = (trecenaNum - 1) * 13 + 1;
  const trecenaSignIndex = (trecenaStart - 1) % 20;

  const haab      = calculateHaab(jdn);
  const longCount = calculateLongCount(jdn);

  return {
    pos,
    number,
    sign: SIGNS[signIndex],
    trecena: {
      number: trecenaNum,
      sign: SIGNS[trecenaSignIndex],
      dayWithin: number,
    },
    longCount,
    haab,
  };
}

export { calculate, SIGNS, HAAB_MONTHS };
