/**
 * Spanish is the source of truth: every other dictionary is typed
 * against `Dictionary`, so a missing or stale key is a build error
 * rather than a string that silently falls back to the wrong language.
 */
export const es = {
  common: {
    tagline: "Practica idiomas hablando con nativos, ahora",
    description:
      "Videochat aleatorio para intercambio de idiomas. Te emparejamos con alguien que habla lo que estudias y estudia lo que hablas. Gratis y solo para mayores de 18 años.",
    adultsOnly: "Solo +18",
    free: "Gratis",
    online: "en línea",
    searching: "buscando",
    languageLabel: "Idioma",
  },

  home: {
    eyebrow: "Intercambio de idiomas, en vivo",
    headline: "Habla con un nativo ahora mismo.",
    headlineMuted: "No en tres semanas.",
    lede: "Parlo te empareja al azar con alguien del otro lado del mundo que habla lo que tú estudias y estudia lo que tú hablas. Dos minutos para empezar, y seguís si los dos queréis.",
    cta: "Empezar a hablar",
    ctaNote: "Requiere verificación de edad · Gratis",
    steps: [
      {
        title: "Di qué hablas y qué practicas",
        body: "Tu idioma nativo y el que quieres mejorar. El emparejamiento busca reciprocidad real: tú enseñas, tú aprendes.",
      },
      {
        title: "Te emparejamos al azar",
        body: "Con alguien compatible de otro país. Sin perfiles que revisar, sin swipe, sin esperar respuesta.",
      },
      {
        title: "Dos minutos para romper el hielo",
        body: "La conversación se acaba sola salvo que los dos queráis seguir. Nadie tiene que ser quien la corta.",
      },
    ],
    languagesTitle: "Elige tu idioma",
    languagesLede: "Veinte idiomas, cada uno con su propia comunidad.",
    practiceVerb: "Practicar",
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        q: "¿Qué es Parlo?",
        a: "Un videochat de intercambio de idiomas. Te empareja al azar con un hablante nativo del idioma que estudias, que a su vez está aprendiendo el tuyo. Las conversaciones empiezan con dos minutos y se alargan solo si los dos queréis.",
      },
      { q: "¿Es gratis?", a: "Sí. El emparejamiento y las conversaciones son gratuitas." },
      {
        q: "¿Hace falta registrarse?",
        a: "No necesitas crear una cuenta. Sí tienes que confirmar que eres mayor de 18 años: Parlo empareja desconocidos por vídeo y es una plataforma exclusivamente para adultos.",
      },
      {
        q: "¿Se graban las conversaciones?",
        a: "No. El vídeo y el audio viajan directamente de un navegador a otro mediante WebRTC. El servidor solo ayuda a establecer la conexión; nunca ve ni almacena el contenido.",
      },
      {
        q: "¿Puedo filtrar con quién hablo?",
        a: "Puedes filtrar por idioma y por género, y pedir que se priorice a gente de otro país. El filtro de género se respeta en ambos sentidos y nunca se amplía solo, por larga que sea la espera.",
      },
    ],
    footer:
      "Parlo es una plataforma para mayores de 18 años. Moderamos activamente, no grabamos las conversaciones y reportamos material de abuso infantil a las autoridades competentes.",
  },

  gate: {
    title: "Verificación de edad",
    body: "Parlo es exclusivamente para mayores de 18 años. Emparejamos personas desconocidas por vídeo, así que esta verificación no es un trámite.",
    pendingLabel: "Pendiente de integración:",
    pending:
      "en producción este paso debe llamar a un proveedor de verificación de edad. La casilla de abajo es solo el marcador de posición para desarrollo.",
    confirm: "Confirmo que tengo 18 años o más y acepto los Términos y la Política de Privacidad.",
    continue: "Continuar",
  },

  setup: {
    title: "Configura tu sesión",
    lede: "Te emparejaremos con alguien compatible.",
    connecting: "Conectando con el servidor…",
    speak: "Hablo con fluidez",
    speakHint: "lo que ofreces",
    learn: "Quiero practicar",
    learnHint: "lo que buscas",
    addAnother: "+ añadir otro",
    chooseLanguage: "Elige un idioma",
    remove: "Quitar",
    level: "Mi nivel",
    levels: { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado" },
    filters: "Filtros y perfil",
    anyGender: "cualquier género",
    anyCountry: "cualquier país",
    internationalShort: "internacional",
    noName: "sin nombre",
    wantToTalkWith: "Quiero hablar con",
    genderNote:
      "Nunca ampliamos este filtro por ti, aunque la espera se alargue. Cuanto más lo restrinjas, más tardarás en encontrar a alguien.",
    myGender: "Mi género",
    genders: {
      female: "Mujer",
      male: "Hombre",
      nonbinary: "No binario",
      undisclosed: "Prefiero no decirlo",
    },
    name: "Nombre",
    optional: "opcional",
    namePlaceholder: "Cómo quieres que te llamen",
    international: "Priorizar personas de otro país",
    internationalNote: "Es el punto del ejercicio: acentos y contexto reales.",
    search: "Buscar compañero",
    cameraNote: "Al continuar se activarán tu cámara y micrófono.",
  },

  queue: {
    title: "Buscando compañero…",
    note: "Ampliamos idioma y región a medida que pasa el tiempo. Tu filtro de género se mantiene siempre.",
    cancel: "Cancelar",
  },

  session: {
    speaks: "Habla",
    practises: "Practica",
    anonymous: "Anónimo",
    international: "Internacional",
    you: "Tú",
    noSignal: "Sin señal",
    report: "Reportar",
    next: "Siguiente",
    exit: "Salir",
    unlimited: "Sin límite de tiempo",
    keepTalking: "Seguir hablando",
    peerWants: "Quiere seguir — ¿tú?",
    waitingPeer: "Esperando a tu compañero…",
    bothIn: "¡Seguimos!",
    privacyNote:
      "No grabamos las llamadas. Nunca compartas datos personales, cuentas ni dinero con desconocidos.",
  },

  chat: {
    icebreaker: "Rompe el hielo. Pregunta de dónde es.",
    typing: "escribiendo…",
    placeholder: "Escribe un mensaje",
    placeholderWaiting: "Esperando compañero…",
    send: "Enviar",
  },

  peerLeft: {
    skip: "Tu compañero pasó a otra conversación.",
    reported: "Conversación finalizada.",
    timeout: "Se acabó el tiempo. Buscando a otra persona…",
    disconnect: "Tu compañero se desconectó.",
  },

  report: {
    title: "Reportar a esta persona",
    subtitle: "La conversación terminará de inmediato.",
    priority: "Revisión prioritaria inmediata",
    reasons: {
      minor: "Parece ser menor de edad",
      nudity: "Desnudez o contenido sexual",
      harassment: "Acoso o insultos",
      violence: "Violencia o amenazas",
      spam: "Spam o publicidad",
      other: "Otro motivo",
    },
    detailsPlaceholder: "Detalles (opcional)",
    cancel: "Cancelar",
    submit: "Enviar reporte",
    duplicate: "Ya habías reportado esta conversación.",
    rateLimited: "Demasiados reportes. Inténtalo más tarde.",
    failed: "No pudimos registrar el reporte. Vuelve a intentarlo.",
  },

  banned: {
    title: "Cuenta suspendida",
    appeal: "Si crees que es un error, puedes apelar escribiendo a soporte@parlo.example.",
  },

  errors: {
    camera:
      "Parlo necesita cámara y micrófono. Revisa los permisos del navegador y vuelve a intentarlo.",
    misconfigured:
      "Configuración incompleta: NEXT_PUBLIC_SIGNAL_URL apunta a ws:// desde una página https. El servidor de señalización necesita wss://.",
    closed: "Conexión cerrada.",
    connect: "No se pudo conectar al servidor de emparejamiento.",
  },

  practise: {
    breadcrumbHome: "Inicio",
    titleTemplate: "Practicar {lang} con nativos por videochat",
    h1Template: "Practicar {lang} hablando con nativos",
    descriptionTemplate:
      "Habla {lang} con hablantes nativos que están aprendiendo español. Emparejamiento aleatorio, gratis, sin agendar. Solo mayores de 18 años.",
    intro:
      "Parlo te empareja al azar con hablantes nativos que están aprendiendo tu idioma. Ellos practican contigo, tú practicas con ellos, y la conversación dura lo que los dos queráis.",
    ctaTemplate: "Empezar a hablar {lang}",
    howTitle: "Cómo funciona",
    howSteps: [
      "Dices qué idioma hablas y cuál practicas.",
      "Te emparejamos con alguien cuyo perfil es el tuyo al revés.",
      "Habláis. Si no fluye, pasas al siguiente sin dar explicaciones.",
    ],
    otherLanguages: "Otros idiomas",
    faq: [
      {
        q: "¿Es gratis?",
        a: "Sí. El emparejamiento y las conversaciones son gratuitas. Parlo funciona por reciprocidad: tú ofreces tu idioma a quien lo estudia y esa persona te ofrece el suyo.",
      },
      {
        q: "¿Necesito un nivel mínimo?",
        a: "No. Eliges tu nivel al empezar y el emparejamiento prioriza a personas de nivel parecido, para que la conversación no sea frustrante para ninguno de los dos.",
      },
      {
        q: "¿Hay que registrarse?",
        a: "No hace falta crear una cuenta para empezar. Sí hay que confirmar que eres mayor de 18 años: Parlo empareja desconocidos por vídeo y es una plataforma exclusivamente para adultos.",
      },
      {
        q: "¿Puedo elegir con quién hablo?",
        a: "Puedes filtrar por idioma, por género y pedir que se priorice a personas de otro país. El filtro de género se respeta en ambos sentidos y nunca se amplía automáticamente, por larga que sea la espera.",
      },
      {
        q: "¿Se graban las conversaciones?",
        a: "No. El vídeo y el audio viajan directamente entre los dos navegadores mediante WebRTC; el servidor solo hace de intermediario para establecer la conexión y nunca ve ni almacena el contenido.",
      },
    ],
  },
};

export type Dictionary = typeof es;
