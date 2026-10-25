# Parlo

Intercambio de idiomas por vídeo con emparejamiento aleatorio. Te conecta
con un hablante nativo del idioma que estudias, que a su vez estudia el
tuyo.

Solo vídeo. Mayores de 18 años.

---

## Por qué este nicho

Es el mismo motor de emparejamiento aleatorio que popularizó Omegle, pero
encuadrado como aprendizaje de idiomas. No es cosmético:

- **Postura legal.** Tras `A.M. v. Omegle.com LLC`, el chat de vídeo
  anónimo genérico es una categoría de riesgo. Un producto educativo con
  control de edad estricto es defendible. Ver [LEGAL.md](LEGAL.md).
- **Distribución.** Las apps de vídeo aleatorio se rechazan sistemáticamente
  en la App Store por la directriz 1.2. Las de idiomas, no.
- **Pagos.** Stripe prohíbe el contenido adulto. Mantenerse claramente
  fuera de esa categoría es la diferencia entre tener pasarela o pagar
  entre 8 y 15% a un procesador de alto riesgo.
- **Producto.** El emparejamiento recíproco (tú enseñas lo que el otro
  estudia) da una razón real para quedarse en la conversación.

El motor no está acoplado al nicho: `Profile` tiene dos ejes genéricos
(*lo que ofreces* / *lo que buscas*). Cambiar de nicho es tocar
`packages/protocol/src/index.ts`, no reescribir el matcher.

---

## Arquitectura

```
navegador A  ──WebSocket──┐
                          ├──►  @parlo/signal   (cola + señalización)
navegador B  ──WebSocket──┘            │
      ▲                                │  solo SDP / ICE
      └────────── WebRTC P2P ──────────┘   el medio nunca toca el servidor
```

- **`packages/protocol`** — tipos y esquemas Zod compartidos. El servidor
  valida con ellos todo lo que llega del cliente.
- **`apps/signal`** — servidor WebSocket (Node + `ws`): cola de
  emparejamiento, señalización WebRTC, límites de frecuencia, baneos.
- **`apps/web`** — Next.js 16 (App Router) + Tailwind v4.

**El vídeo y el audio van directos entre navegadores.** El servidor solo
retransmite SDP e ICE. Es una ventaja de privacidad deliberada y también
legal: no grabas ni ves el medio. Consérvala.

### Por qué el servidor de señalización va aparte

Vercel Functions no acepta conexiones WebSocket entrantes. Hacen streaming
(SSE) y duran hasta 800 s con Fluid Compute, pero no hay *upgrade* a
WebSocket. `apps/web` despliega en Vercel sin problema; `apps/signal`
necesita un proceso de larga duración — Fly.io, Railway o Render.

## Estado del despliegue

| Pieza | Dónde | Estado |
|---|---|---|
| `apps/web` | Vercel — <https://parlo-seven.vercel.app> | **en producción** |
| `apps/signal` | Render — <https://parlo-signal.onrender.com> | **en producción** |
| Postgres | pendiente de aprovisionar | **no existe** |
| TURN | no contratado | **no existe** |

Verificado de punta a punta en producción: emparejamiento por
complementariedad, rol *polite* repartido, chat relevado, y el allowlist
de orígenes devolviendo 403 a cualquier origen que no sea el de Vercel.

**Dos limitaciones activas ahora mismo:**

1. **El plan gratuito de Render duerme el servicio** tras ~15 min sin
   tráfico. Al despertar tarda unos 50 s, y el reinicio **borra el store
   de moderación en memoria**: sin `DATABASE_URL`, los baneos no
   sobreviven a una siesta.
2. **Solo hay STUN, no TURN.** El 10-20% de usuarios tras NAT simétrico
   verá pantalla negra. Ver «TURN no es opcional» más abajo.

`NEXT_PUBLIC_SIGNAL_URL` se incrusta en tiempo de build: si la cambias,
hay que **volver a desplegar**, no basta con guardarla.

```bash
npx vercel env add NEXT_PUBLIC_SIGNAL_URL production
npx vercel deploy --prod
```

El repositorio es **público** porque Render está conectado a otra cuenta
de GitHub y clonar por URL fue el camino corto. No hay secretos dentro
—  todo va por variables de entorno — pero tenlo presente.

---

## Arrancar en local

```bash
npm install && npm run build --workspace=@parlo/protocol
```

En dos terminales:

```bash
npm run dev:signal
```

```bash
npm run dev:web
```

Abre <http://localhost:3000> en **dos pestañas** y configura perfiles
complementarios (una hablando español y practicando inglés, la otra al
revés). Necesitas permitir cámara y micrófono en ambas.

### Pruebas

```bash
node scripts/smoke.mjs
```

Nueve comprobaciones end-to-end del emparejamiento: complementariedad de
idiomas, reparto de rol *polite*, retransmisión de chat, notificación al
saltar, **cumplimiento bidireccional del filtro de género** y rechazo de
payloads malformados.

```bash
PORT=8788 REMATCH_COOLDOWN_MS=0 npm run dev:signal   # en otra terminal
node scripts/moderation.mjs
```

Seis comprobaciones de moderación, que es donde está el riesgo real:
baneo inmediato por reporte de menor, persistencia del baneo al
reconectar con el mismo token, **que tres reportes de UNA sola persona no
baneen** (conteo por acusadores distintos), que tres acusadores distintos
sí baneen, rechazo de reportes repetidos, y que una carrera de reportes
duplicados no cuente doble.

```bash
node scripts/peer.mjs
```

Compañero sintético que se pone en cola y responde, para probar la interfaz
real contra algo sin necesitar dos cámaras.

---

## Decisiones de diseño que conviene no deshacer

**El filtro de género nunca se relaja solo.** Los de idioma y región se van
ampliando conforme crece la espera (`RELAX_AFTER_MS`); el de género no,
nunca, por larga que sea la cola. Ampliarlo en silencio traicionaría la
expectativa de seguridad por la que el usuario lo activó, y es exactamente
el tipo de decisión de diseño que se examina en un juicio tras el
precedente Omegle.

**Un reporte por "menor" saltea el contador de strikes.** Banea al instante,
marca revisión crítica y es el único tipo de reporte exento del límite de
frecuencia. Ver `apps/signal/src/safety.ts`.

**Los strikes se cuentan por acusadores DISTINTOS, no por reportes.** Si
contaras reportes, una sola persona insistente podría banear a cualquiera.
Y no hay tabla de strikes: se derivan de `reports`, porque un contador
paralelo puede desincronizarse del registro de auditoría — y el registro
es lo que tienes que defender.

**Las tablas viven en un esquema `parlo`, no en `public`.** Las bases de
datos se comparten, y `reports` es un nombre que ya usa medio mundo.

**Si falla la consulta de baneos, se deniega el acceso.** Un apagón que
deja entrar a todos los baneados es el peor de los dos modos de fallo.
`BAN_CHECK_FAIL_OPEN=true` lo invierte, como decisión deliberada.

**El emparejamiento es voraz, no óptimo.** Un emparejamiento de peso máximo
daría mejores parejas, pero la cola rota demasiado rápido para que compense
la latencia. `O(n²)` por tick con constantes mínimas.

---

## Configuración

Servidor de señalización (`apps/signal`):

| Variable | Por defecto | Notas |
|---|---|---|
| `PORT` | `8787` | |
| `ALLOWED_ORIGINS` | `*` | **Fija los orígenes reales en producción** |
| `REQUIRE_AGE_TOKEN` | `false` | **Debe ser `true` en producción** |
| `DATABASE_URL` | — | Postgres para moderación. Sin esto, **en memoria** |
| `DB_SCHEMA` | `parlo` | Esquema propio, nunca `public` |
| `BAN_CHECK_FAIL_OPEN` | `false` | Denegar si falla la consulta de baneos |
| `DEVICE_TOKEN_SECRET` | inseguro | Cámbialo |
| `RELAX_AFTER_MS` | `20000` | Cuándo se amplían idioma y región |
| `TURN_URL` / `TURN_USERNAME` / `TURN_CREDENTIAL` | — | Ver abajo |

Web (`apps/web`):

| Variable | Por defecto |
|---|---|
| `NEXT_PUBLIC_SIGNAL_URL` | `ws://localhost:8787` |

### TURN no es opcional

STUN es gratis y conecta al 80-90% de los usuarios. El resto está detrás de
NAT simétrico y **necesita TURN**, que retransmite el medio de verdad y por
tanto consume ancho de banda de verdad. Sin TURN, uno de cada cinco
usuarios ve una pantalla negra y se va. Opciones: coturn autoalojado,
Cloudflare Calls, Twilio o Metered. Presupuéstalo antes de lanzar.

---

## Antes de abrir al público

Esto es un MVP funcional, **no un producto lanzable**. Los bloqueantes:

1. **Verificación de edad real.** `AgeGate.tsx` es un placeholder.
   Bloqueante absoluto — ver [LEGAL.md §2](LEGAL.md).
2. **Registro en el NCMEC y hash matching de CSAM.** Obligación penal en
   EE. UU. — [LEGAL.md §3](LEGAL.md).
3. ~~**Persistencia de moderación.**~~ Hecho: baneos y reportes van a
   Postgres (`db/migrations/001_moderation.sql`). Falta mover la **cola de
   emparejamiento** a Redis para poder correr más de una instancia, y
   construir la **interfaz de revisión** — hoy los reportes se acumulan sin
   que nadie los vea, que es justo lo que convierte un incidente en una
   demanda.
4. **Moderación de vídeo.** Muestreo de fotogramas con clasificador NSFW.
   **Sin reconocimiento facial** — la BIPA de Illinois impone entre 1.000 y
   5.000 $ por infracción.
5. **Reconexión del WebSocket.** Hoy, si cae la señalización, la página se
   queda muerta hasta recargar.
6. **Escalado horizontal.** La cola vive en el proceso. Con más de una
   instancia hacen falta cola y salas compartidas (Redis).
7. **Textos legales** redactados por un abogado; las rutas `/legal/*` de la
   home todavía no existen.

---

## Verificado

- Build de producción y typecheck limpios en los tres paquetes.
- `scripts/smoke.mjs`: 9/9.
- **WebRTC de extremo a extremo entre dos navegadores.** Negociación
  completa (oferta, respuesta, ICE) y medio fluyendo en ambos sentidos:
  cada pestaña reproduce el stream remoto de la otra con pistas de audio y
  vídeo en estado `live`. Probado sustituyendo `getUserMedia` por un stream
  de canvas, porque no había cámara en el entorno.
- Emparejamiento por complementariedad de idiomas con perfiles reales desde
  la interfaz (es→en contra en→es).
- Chat de ida y vuelta durante la videollamada, con envío por botón y por
  tecla Enter.
- Puerta de edad, panel de configuración y cola.
- Ruta de error sin cámara: muestra el aviso y **no** te mete en cola.

**No verificado:** el comportamiento con NAT real. Toda la prueba fue
localhost, donde ICE resuelve por candidatos de host y **nunca se ejerce
STUN ni TURN**. El 10-20% de conexiones que necesitan TURN en producción no
está cubierto por esta verificación.
