# Astro-Nav HUD — Documento de Estado del Proyecto

**Última actualización:** 11 junio 2026
**Versión actual:** v0.4
**Repositorio:** github.com/V0raOnline/Astro-Nav-HUD
**Autora:** V0ra (v0raonline.substack.com)

---

## QUÉ ES

Herramienta de navegación astrológica comparativa. Muestra en paralelo cuatro sistemas calendáricos/astrológicos para una fecha, hora y lugar de nacimiento dados. Filosofía central: **muestra sin interpretar — despliega el mapa, no dice a dónde ir.** La metáfora rectora es la "tomografía de la identidad": cada sistema es una capa, ninguna captura el todo, la lectura la hace el usuario.

Los cuatro sistemas:
- **Tonalpohualli** — calendario mexica de 260 días (náhuatl). Correlación Alfonso Caso.
- **Tzolkin** — calendario maya de 260 días. Correlación GMT.
- **Carta Natal occidental** — astrología helenística, zodíaco tropical, casas Placidus.
- **Jyotish** — astrología védica, zodíaco sidéreo, ayanamsa Lahiri.

---

## ESTRUCTURA DEL REPOSITORIO

```
Astro-Nav HUD/
├── index.html              # HUD principal (la herramienta)
├── about.html              # Origen y filosofía (texto en 1ª persona de V0ra)
├── overview.html           # Intro + 4 marcos en paralelo
├── tonalpohualli.html      # Página de marco + arquetipos (4 bloques colapsables)
├── tzolkin.html            # Página de marco + arquetipos
├── natal.html              # Página de marco + arquetipos
├── jyotish.html            # Página de marco + arquetipos
├── README.md
├── CHANGELOG.md
├── NOTAS-MOTOR.md
└── src/
    ├── engines/            # Motores de cálculo (referencia; el index.html tiene su propia copia embebida)
    │   ├── tonalpohualli.js
    │   ├── tzolkin.js
    │   ├── natal.js
    │   └── jyotish.js
    ├── data/               # Datos simbólicos editables en YAML
    │   ├── tonalpohualli.yaml        (20 signos)
    │   ├── tzolkin.yaml              (20 kins)
    │   ├── natal.yaml                (12 signos tropicales)
    │   ├── jyotish-rashis.yaml       (12 rashis)
    │   ├── jyotish-nakshatras.yaml   (27 nakshatras)
    │   ├── numeros-tonalpohualli.yaml (13 números, compartido Tonal+Tzolkin)
    │   ├── senores-noche.yaml        (9 Señores de la Noche)
    │   └── trecenas-tonalpohualli.yaml (20 trecenas)
    ├── lib/
    │   └── astronomy.browser.min.js  # astronomy-engine 2.1.19 (local, NO CDN)
    └── img/
        ├── About_banner.png
        ├── Ollin_banner.png
        ├── Tzolkin_banner.png
        ├── Helenista_banner.png
        └── Jyotish_banner.png
```

---

## ARQUITECTURA TÉCNICA

- **Stack:** HTML + CSS + JS vanilla. Sin build, sin bundler, sin npm. Un archivo HTML autónomo + datos.
- **Estética:** HUD de cabina de navegación. Fondo oscuro (#080a0e), ámbar (#d4860a/#f0a020). Fuentes Share Tech Mono + Exo 2. Starfield animado, scan line.
- **Cálculo planetario:** astronomy-engine 2.1.19, servido localmente desde src/lib/ (NO CDN — Edge bloquea el CDN por Tracking Prevention). API: GeoVector() + Ecliptic() → .elon
- **Geocodificación:** Nominatim (OpenStreetMap) como fuente primaria, tabla local de ~25 ciudades como fallback. Autorrellena país.
- **Offset UTC:** tabla de ~50 países con lógica de horario de verano. Campo editable manualmente; el usuario puede corregir y recalcular.
- **Datos simbólicos:** cargados por fetch() desde los YAML al iniciar. Fallback embebido mínimo si fetch falla. REQUIERE servidor local (npx serve .) para que fetch funcione — file:// da error CORS.

### Constantes de calibración críticas
- Tonalpohualli anchor: **JDN 2276828 = 1-Coatl (pos 105)**. 13 ago 1521 juliano = 23 ago 1521 gregoriano.
- Señor de la Noche: fórmula **(jdn + 7) % 9**
- Tzolkin anchor: **GMT JDN 584283 = 4 Ahau**
- Lahiri ayanamsa: **22.4602 + (year-1900)*0.013961**
- Trecena: usar posición del día 1 de la trecena = (trecenaNum*13)%20

---

## VALIDACIÓN DE CÁLCULOS (investigación 11 jun 2026)

Se hizo una verificación completa contra fuentes externas. Resultado:

| Sistema | Estado | Validado contra |
|---|---|---|
| Tonalpohualli | ✅ CORREGIDO | azteccalendar.com (10 jun 2026 = 9 Quiahuitl) + Noche Triste (9 Ollin) |
| Tzolkin | ✅ Correcto | 21 dic 2012 = 4 Ahau |
| Carta Natal | ✅ Correcto | Efemérides estándar (7 planetas + ASC + MC, <1° error) |
| Jyotish | ✅ Correcto | Ayanamsa Lahiri, nakshatra, Vimshottari dasha |

**Caso de prueba (3 abr 1974, 09:20, Madrid):**
- Tonalpohualli: 6 Tecpatl · trecena 1 Acatl · Señor Tláloc
- Tzolkin: 6 Etznab · trecena 1 Ben · Long Count 12.18.0.12.18
- Carta Natal: Sol 13° Aries · Luna 26° Leo · ASC 14° Tauro · MC 25° Capricornio
- Jyotish: Lagna Mesha · Luna Simha · Nakshatra Magha · Mahadasha Rahu (2022-2040)

### Errores encontrados y corregidos en esta sesión
1. **Anchor Tonalpohualli:** 2276849 → 2276828 (desfase 21 días + confusión juliano/gregoriano). Afectaba signo, número y trecena.
2. **Señor de la Noche:** jdn%9 → (jdn+7)%9
3. **Trecenas:** 11 de 20 deidades incorrectas + 2 signos intercambiados (trecenas 12 y 19). Corregidas contra Códice Borbónico.

---

## NAVEGACIÓN

- HUD (index.html): dos botones en cabecera → about.html y overview.html. Iconos de columna clickables → páginas de marco (nueva pestaña).
- Cada página de marco: nav de vuelta a HUD/about/overview.

---

## CONTENIDO EDITORIAL

- **about.html:** texto en primera persona de V0ra (origen del proyecto, la "tomografía de la identidad"). NO MODIFICAR sin permiso explícito de la autora.
- **Descripciones de marcos:** escritas en tono adyacente a V0ra (poético-simbólico con rigor). Almacenadas en framework-descriptions.md y maquetadas en overview.html + páginas de marco.
- **Arquetipos (YAML):** síntesis de fuentes documentadas. Cada entrada tiene keywords + description. Son editables sin tocar código.

### Páginas de marco — estructura (4 bloques colapsables)
- Tonalpohualli: 20 signos · 20 trecenas · 9 Señores · 13 números
- Tzolkin: 20 kins · 13 números
- Carta Natal: 12 signos
- Jyotish: 12 rashis · 27 nakshatras

---

## PENDIENTE / BACKLOG

### Inmediato
- [ ] Copiar las 4 páginas de marco al repo (tonalpohualli/tzolkin/natal/jyotish.html) — generadas, pendientes de subir
- [ ] Verificar en navegador que los iconos del HUD abren las páginas correctas
- [ ] Commit de las páginas de marco

### Validación adicional recomendada
- [ ] Confirmar Señor de la Noche con una 2ª fecha de azteccalendar.com (solo validado contra 1 referencia)
- [ ] Validar carta natal contra Astro.com con 3 cartas distintas (Swiss Ephemeris)
- [ ] Revisión de las trecenas por especialista en tradición nahua (contactos mexicanos de la autora)

### Funcionalidad v0.5
- [ ] Traducciones al inglés (todo el contenido está solo en español)
- [ ] Capa simbólica socrática: una pregunta abierta por símbolo (NO interpretación). PARKED por decisión de diseño — debe activar reflexión, no cerrar sentido. Ver nota abajo.
- [ ] Diferenciar más las descripciones de rashis Jyotish de las occidentales
- [ ] Nota sobre el amanecer: el Tonalpohualli tradicionalmente empieza el día al amanecer, no a medianoche. Para nacimientos de madrugada habría que usar el día gregoriano anterior. No implementado.

### Limpieza
- [ ] Eliminar index.html.old y files.zip del repo (residuos)
- [ ] jyotish-rashis.yaml.bak (backup, se puede borrar)

---

## DECISIONES DE DISEÑO IMPORTANTES

1. **No interpretar.** El HUD muestra datos y arquetipos documentados. NO genera interpretaciones personalizadas. Esto es deliberado y central a la filosofía.

2. **Capa simbólica socrática (parked).** Se evaluó añadir una segunda capa "accionable". Conclusión: una interpretación automática sería autoayuda y traicionaría la filosofía. Si se retoma, la forma correcta es UNA PREGUNTA ABIERTA por símbolo (ej. Ollin: "¿Dónde el movimiento constante es respuesta al miedo a detenerte?"). Pregunta, no respuesta.

3. **Honestidad epistémica.** Los cálculos son verificables y están validados. Las descripciones simbólicas son síntesis parciales de tradiciones con variaciones internas — no hay "interpretación correcta" única donde las fuentes mismas difieren. Las trecenas están marcadas como verificadas contra Códice Borbónico pero pendientes de revisión experta.

4. **Separación mapa/manual.** El HUD es la herramienta (densa, técnica). Las páginas about/overview/marco son el contexto (espacioso, legible). Archivos separados a propósito.

---

## NOTAS DE TRABAJO (para quien continúe)

- El index.html tiene la lógica de cálculo EMBEBIDA (no importa los módulos de src/engines/). Si se corrige un cálculo, hay que corregirlo en AMBOS sitios: index.html y el .js correspondiente.
- Los YAML se cargan por fetch — siempre probar con `npx serve .`, nunca con file://
- Entorno de la autora: Windows, repo en G:\GHU Codexsphere\01 GitHub repos\Astro-Nav HUD
- El sistema de archivos del agente y el de la autora están separados: los archivos generados por el agente se copian manualmente vía descarga, o se editan directamente con herramientas de filesystem que accedan a G:\
- Tono de la autora (V0ra): poético-simbólico con rigor técnico, sarcasmo quirúrgico, sin autoayuda ni lenguaje corporativo. Hay un skill v0ra-tone con la especificación completa.
