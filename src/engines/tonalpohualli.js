/**
 * Tonalpohualli Engine
 * Calendario mexica de 260 días
 * Correlación: Alfonso Caso - 13 septiembre 1521 = 1 Coatl (día 105 del ciclo)
 * FIX v0.4: anchor JDN corregido de 2299158 a 2276849
 */

const SIGNS = [
  { nahuatl: "Cipactli",      es: "Cocodrilo"      },
  { nahuatl: "Ehecatl",       es: "Viento"          },
  { nahuatl: "Calli",         es: "Casa"            },
  { nahuatl: "Cuetzpalin",    es: "Lagartija"       },
  { nahuatl: "Coatl",         es: "Serpiente"       },
  { nahuatl: "Miquiztli",     es: "Muerte"          },
  { nahuatl: "Mazatl",        es: "Venado"          },
  { nahuatl: "Tochtli",       es: "Conejo"          },
  { nahuatl: "Atl",           es: "Agua"            },
  { nahuatl: "Itzcuintli",    es: "Perro"           },
  { nahuatl: "Ozomatli",      es: "Mono"            },
  { nahuatl: "Malinalli",     es: "Hierba torcida"  },
  { nahuatl: "Acatl",         es: "Caña"            },
  { nahuatl: "Ocelotl",       es: "Jaguar"          },
  { nahuatl: "Cuauhtli",      es: "Águila"          },
  { nahuatl: "Cozcacuauhtli", es: "Buitre"          },
  { nahuatl: "Ollin",         es: "Movimiento"      },
  { nahuatl: "Tecpatl",       es: "Pedernal"        },
  { nahuatl: "Quiahuitl",     es: "Lluvia"          },
  { nahuatl: "Xochitl",       es: "Flor"            },
];

const LORDS_OF_NIGHT = [
  "Xiuhtecuhtli",    // 1
  "Tlaltecuhtli",    // 2
  "Chalchiuhtlicue", // 3
  "Tonatiuh",        // 4
  "Tlazolteotl",     // 5
  "Mictlantecuhtli", // 6
  "Centeotl",        // 7
  "Tlaloc",          // 8
  "Quetzalcoatl",    // 9
];

// Anchor Alfonso Caso: 1-Coatl = día 105 del ciclo
// 13 ago 1521 juliano = 23 ago 1521 gregoriano = JDN 2276828
// Validado contra azteccalendar.com (10 jun 2026 = 9 Quiahuitl)
// y la Noche Triste (11 jul 1520 greg = 9 Ollin)
const ANCHOR_JDN = 2276828;
const ANCHOR_POS = 105;

function julianDayNumber(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function calculate(year, month, day) {
  const jdn  = julianDayNumber(year, month, day);
  const diff = jdn - ANCHOR_JDN;
  const pos  = ((ANCHOR_POS - 1 + diff) % 260 + 260) % 260 + 1;

  const signIndex = (pos - 1) % 20;
  const number    = (pos - 1) % 13 + 1;

  // Trecena: usar posición del día 1 de la trecena, no el número de trecena
  const trecenaNum       = Math.floor((pos - 1) / 13);
  const trecenaStart     = trecenaNum * 13 + 1;
  const trecenaSignIndex = (trecenaStart - 1) % 20;

  const lordIndex = (jdn + 7) % 9;

  return {
    pos,
    number,
    sign: SIGNS[signIndex],
    trecena: {
      number: trecenaNum + 1,
      sign:   SIGNS[trecenaSignIndex],
      dayWithin: number,
    },
    lordOfNight: LORDS_OF_NIGHT[lordIndex],
  };
}

// Validación: 03/04/1974 = 6 Tecpatl, trecena 1 Acatl, Señor Tlaloc
// calculate(1974, 4, 3) → { number: 6, sign: { nahuatl: "Tecpatl" }, trecena: { sign: { nahuatl: "Acatl" } }, lordOfNight: "Tlaloc" }

export { calculate, SIGNS, LORDS_OF_NIGHT };
