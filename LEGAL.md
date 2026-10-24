# Parlo — Mapa de cumplimiento legal

> No es asesoramiento jurídico. Es el mapa del terreno para que sepas qué
> preguntarle a un abogado y qué no puedes lanzar sin resolver. Antes de
> abrir al público necesitas revisión legal real en tus mercados objetivo.

---

## 0. El precedente que define todo: por qué cerró Omegle

Omegle no cerró por falta de dinero ni de usuarios. Cerró en noviembre de
2023 tras **`A.M. v. Omegle.com LLC`** (Distrito de Oregón).

Lo decisivo: el tribunal resolvió que la **Sección 230 no inmunizaba a
Omegle**, porque la demanda no atacaba *el contenido de los usuarios* sino
**el diseño del producto** — el hecho de que el algoritmo emparejara
aleatoriamente a menores con adultos. Eso es una demanda por producto
defectuoso, y la Sección 230 no la cubre.

**La consecuencia para ti:** "yo solo soy una tubería neutral, no controlo
lo que hacen los usuarios" **no es defensa**. Si tu algoritmo es el que
provoca el encuentro dañino, respondes por el algoritmo. Por eso en este
repositorio el control de edad y la moderación no están en el backlog:
están en la arquitectura.

---

## 1. Riesgos ordenados por lo que puede matar el proyecto

| # | Riesgo | Consecuencia máxima | Estado en el repo |
|---|--------|---------------------|-------------------|
| 1 | Menores en la plataforma | Responsabilidad penal y civil; cierre | Puerta de edad **stub** |
| 2 | CSAM no reportado | Delito federal en EE. UU. | Flujo de reporte **stub** |
| 3 | Demanda por diseño del producto | Cierre (precedente Omegle) | Mitigado parcialmente |
| 4 | Sanción RGPD / DSA / OSA | Hasta 4-10% facturación global | No implementado |
| 5 | Rechazo en App Store / Google Play | Sin canal móvil | No aplica todavía |
| 6 | Pérdida de pasarela de pago | Sin monetización | No aplica todavía |

---

## 2. Verificación de edad — el bloqueante número uno

Una casilla que diga "tengo 18 años" **no sirve para nada** legalmente. Ya
no.

**Qué lo exige:**

- **Reino Unido — Online Safety Act 2023.** Ofcom exige *highly effective
  age assurance*. Multas de hasta **18 M£ o el 10% de la facturación
  global**, la que sea mayor. Es la jurisdicción más agresiva ahora mismo.
- **EE. UU. — estados.** Texas (HB 1181, **confirmada por el Tribunal
  Supremo en `FSC v. Paxton`, junio 2025**), Luisiana, Utah, Arkansas,
  Virginia y más. La constitucionalidad de la verificación de edad ya no
  está en discusión.
- **EE. UU. — COPPA.** Menores de 13; multas por infracción y por menor.
- **UE — DSA art. 28.** Obligación de alto nivel de privacidad y seguridad
  para menores.
- **Australia.** Prohibición de redes sociales para menores de 16, en vigor
  desde diciembre de 2025.

**Qué hacer:**

1. Plataforma **exclusivamente +18**. Declarado en Términos, en la home y
   en el onboarding.
2. Integrar un proveedor real: **Yoti, Persona, Veriff, k-ID o Stripe
   Identity**. Presupuesta entre 0,30 y 1,50 € por verificación — es una
   línea de coste seria que mucha gente descubre tarde.
3. Verificar **en el servidor**. Un token que afirme la edad desde el
   cliente no vale nada. Ver `apps/signal/src/safety.ts` → `verifyAgeToken()`
   y la variable `REQUIRE_AGE_TOKEN`.
4. Estimación de edad por selfie como primer filtro barato, documento solo
   cuando la estimación queda cerca del umbral. Reduce coste y fricción.

**En el repo:** `apps/web/components/AgeGate.tsx` tiene la ubicación y la
UX correctas, pero la confirmación es un placeholder. **Es un bloqueante de
lanzamiento.**

---

## 3. CSAM — obligación penal, no opcional

**18 U.S.C. § 2258A**: todo proveedor estadounidense **debe** reportar
material de abuso sexual infantil aparente al **NCMEC**. No reportar es
delito. No hay excepción por tamaño ni por ser una startup.

**Qué hacer:**

1. **Registrarte como ESP ante el NCMEC** antes de abrir al público.
2. Implementar **hash matching**: PhotoDNA (Microsoft, gratuito para
   plataformas cualificadas) o **Thorn Safer**.
3. **Preservar** el contenido reportado 90 días para las autoridades.
4. Designar un punto de contacto y un procedimiento escrito.
5. Cola de revisión humana con escalado 24/7 para la categoría "menor".

**En el repo:** un reporte con motivo `minor` provoca **baneo inmediato**
sin pasar por el contador de strikes, y se marca como `critical`
(`apps/signal/src/safety.ts`). El destino de esa escalada es un `console.warn`:
tienes que conectarlo a un sistema real.

**UE:** el Reglamento CSAM sigue en trílogo; la derogación que permite la
detección voluntaria se extendió hasta abril de 2026. Vigila ese expediente.

---

## 4. Sección 230 y responsabilidad por diseño

La 230 te protege del contenido **de terceros**. No te protege de **tus
propias decisiones de diseño**. Además, **FOSTA-SESTA (2018)** eliminó la
protección en materia de trata sexual.

**Cómo se defiende el diseño:**

- Nunca emparejar a un menor con un adulto → se resuelve siendo +18 estricto.
- Herramientas de reporte y bloqueo visibles **durante** la sesión, no
  escondidas en ajustes.
- Registro documentado de moderación: qué reportaste, cuándo actuaste. Si
  acabas en un juicio, ese registro es tu defensa.
- No diseñar funciones que premien el comportamiento de riesgo.

---

## 5. RGPD y privacidad — "internacional" significa que aplica

Si tienes usuarios en la UE o el Reino Unido, el RGPD aplica aunque tu
empresa esté fuera.

**Lo que mucha gente subestima:**

- **El vídeo y el audio son datos personales.** Transmitirlos es
  tratamiento de datos.
- **No grabes.** En cuanto grabas, entras en las leyes de consentimiento
  bipartito de California, Florida, Illinois, Pensilvania y Washington, y
  multiplicas tu superficie RGPD. La arquitectura de este repo es P2P
  (WebRTC): **el servidor nunca ve el medio**, solo retransmite SDP e ICE.
  Eso es una ventaja legal, consérvala.
- **Illinois BIPA.** Si haces *cualquier* análisis biométrico facial: entre
  1.000 y 5.000 $ **por infracción**, con demandas colectivas. **No hagas
  reconocimiento facial.** Para moderación usa solo clasificadores NSFW que
  no identifiquen a la persona.
- **Género.** Bajo el RGPD el género **no** es categoría especial del art. 9
  (a diferencia de la vida sexual o la orientación). Pero necesitas base
  legítima, minimización y declararlo en la política de privacidad. Cuidado:
  si combinas el filtro de género con otras señales para **inferir
  orientación sexual**, sí entras en el art. 9 y el régimen es mucho más
  estricto.

**Lo que necesitas sí o sí:** política de privacidad, base jurídica
documentada, DPA con cada procesador, política de retención, procedimiento
de derechos (acceso, supresión), **representante en la UE (art. 27)** si no
estás establecido allí, y consentimiento de cookies.

---

## 6. DSA (Unión Europea)

Con usuarios en la UE, aunque no seas una VLOP (umbral: 45 M usuarios
mensuales), te obliga a:

- Mecanismo de **notificación y acción** para contenido ilegal.
- **Declaración de motivos** a quien sancionas: por qué le baneaste.
- **Informe de transparencia** periódico.
- Punto de contacto para autoridades y para usuarios.
- Términos en lenguaje claro.
- Art. 28: protección reforzada de menores; **sin publicidad basada en
  perfilado** a menores.

---

## 7. UK Online Safety Act

Ofcom lleva aplicándolo activamente desde julio de 2025. Necesitas:

1. **Evaluación de riesgo de contenido ilegal** documentada.
2. **Evaluación de acceso de menores**.
3. Deberes de seguridad proporcionados al riesgo.

Si sostienes "somos +18 y lo hacemos cumplir", puedes argumentar que los
menores no acceden normalmente — **pero solo si tienes *highly effective
age assurance***. Sin eso, el argumento se cae y entras en el régimen
completo de protección de menores.

---

## 8. El filtro de género: lo legal y lo que nadie te cuenta

**Legalmente** es defendible y habitual, sobre todo presentado como medida
de seguridad. No es discriminación: son preferencias de asociación personal,
no acceso a un servicio esencial. Bajo el RGPD, declarado y minimizado, va
bien.

**En la práctica, el problema es económico, no legal.** En todas las
plataformas de chat aleatorio el ratio real es de aproximadamente **1 mujer
por cada 15-25 hombres**. Si dejas el filtro de género gratis e ilimitado:

- Casi todos los hombres filtran "solo mujeres".
- Las pocas mujeres reciben una carga desproporcionada y se van.
- El ratio empeora, y el producto entra en espiral.

**Cómo lo resuelven los que funcionan:**

1. Filtro de género **de pago** (es la principal palanca de ingresos del
   sector, no es casualidad).
2. Exigir **verificación de género** para declararte mujer — si no, se
   suplanta de inmediato.
3. Controles de seguridad más fuertes por defecto para las cuentas
   femeninas.
4. Métrica que debes vigilar desde el día uno: **tiempo de espera segmentado
   por género**. Es tu indicador de salud del mercado.

**Decisión de diseño de este repo:** el filtro de género **nunca se relaja
automáticamente**, aunque la espera se alargue. Los filtros de idioma y
región sí se van ampliando con el tiempo. Ampliar el de género en silencio
para acelerar el emparejamiento traiciona exactamente la expectativa de
seguridad por la que el usuario lo activó — y, tras el precedente Omegle,
es justo el tipo de decisión de diseño que se examina en un juicio. Ver
`apps/signal/src/matcher.ts`.

---

## 9. Tiendas de aplicaciones

- **Apple, directriz 1.2 (contenido generado por usuarios):** filtrado de
  contenido, mecanismo de reporte, bloqueo de usuarios abusivos y datos de
  contacto publicados. Las apps de vídeo aleatorio **se rechazan con mucha
  frecuencia**; el encuadre de "aprendizaje de idiomas" mejora
  sustancialmente tus probabilidades.
- **Google Play:** requisitos equivalentes más clasificación por edad.
- Planifica el canal **web primero**. No construyas tu negocio asumiendo
  que te aprueban la app.

---

## 10. Pagos

- **Stripe prohíbe** los servicios de contenido para adultos. Si tu
  plataforma deriva hacia ahí, pierdes la pasarela sin previo aviso.
- Las normas de **Visa y Mastercard** (especialmente el AN 5013 de
  Mastercard, 2021) son muy duras con el contenido adulto.
- Si acabas en categoría de alto riesgo: CCBill, Segpay y similares, con
  comisiones del **8-15%** frente al 2,9% habitual.

**Implicación estratégica:** mantente firmemente en el lado no adulto. No
es solo cuestión legal, es la diferencia entre tener pasarela de pago o no.

---

## 11. Marca

- **No** uses "Omegle" ni variantes en el nombre, el dominio, los metadatos
  ni el ASO. Es marca registrada.
- No copies su interfaz ni su identidad visual.
- **Haz búsqueda de marca para "Parlo"** en la UE (EUIPO), EE. UU. (USPTO)
  y tus mercados objetivo **antes de comprar dominio y hacer branding**.
  Ojo: "Parlo" es corto y evocador en lenguas romances, lo que significa que
  hay probabilidad razonable de colisión. Verifícalo antes de invertir.

---

## 12. Lista de bloqueantes antes de abrir al público

- [ ] Verificación de edad real integrada y validada en servidor
- [ ] Registro como ESP ante el NCMEC
- [ ] Hash matching de CSAM (PhotoDNA / Thorn)
- [ ] Clasificador NSFW sobre muestreo de fotogramas (**sin biometría**)
- [ ] Cola de revisión humana con escalado 24/7 para "menor"
- [ ] Baneos persistentes en base de datos (hoy son **en memoria**: se
      borran en cada despliegue)
- [ ] Términos, Política de Privacidad y Normas de la Comunidad redactadas
      por un abogado
- [ ] Representante en la UE (art. 27 RGPD) y punto de contacto DSA
- [ ] Evaluación de riesgo documentada para la OSA del Reino Unido
- [ ] Procedimiento de apelación de baneos (lo exige el DSA)
- [ ] Bloqueo geográfico de jurisdicciones que no puedas cumplir
- [ ] Servidores TURN contratados y presupuestados
- [ ] Seguro de responsabilidad civil que cubra plataformas de UGC

---

## 13. Bloqueo geográfico

Bloquear es más barato que cumplir. Candidatos a valorar según tu capacidad
real de cumplimiento: Australia (régimen de menores de 16), estados de
EE. UU. con verificación de edad si no integras proveedor, y cualquier
jurisdicción con requisitos de localización de datos que no puedas asumir.

Es una decisión de negocio, pero tómala **conscientemente y por escrito**,
no por omisión.
