import type { Dictionary } from "./es";

export const it: Dictionary = {
  common: {
    tagline: "Pratica le lingue parlando con madrelingua, ora",
    description:
      "Videochat casuale per lo scambio linguistico. Ti abbiniamo a qualcuno che parla ciò che studi e studia ciò che parli. Gratis e solo per maggiori di 18 anni.",
    adultsOnly: "Solo 18+",
    free: "Gratis",
    online: "online",
    searching: "in cerca",
    languageLabel: "Lingua",
  },

  home: {
    eyebrow: "Scambio linguistico, dal vivo",
    headline: "Parla con un madrelingua adesso.",
    headlineMuted: "Non fra tre settimane.",
    lede: "Parlo ti abbina a caso con qualcuno dall'altra parte del mondo che parla ciò che studi e studia ciò che parli. Due minuti per iniziare, e si continua se lo volete entrambi.",
    cta: "Inizia a parlare",
    ctaNote: "Richiede la verifica dell'età · Gratis",
    steps: [
      {
        title: "Dicci cosa parli e cosa pratichi",
        body: "La tua lingua e quella che vuoi migliorare. L'abbinamento cerca reciprocità vera: insegni e impari.",
      },
      {
        title: "Ti abbiniamo a caso",
        body: "Con qualcuno compatibile di un altro paese. Nessun profilo da scorrere, niente swipe, nessuna risposta da aspettare.",
      },
      {
        title: "Due minuti per rompere il ghiaccio",
        body: "La conversazione finisce da sola a meno che non vogliate continuare entrambi. Nessuno deve essere quello che la interrompe.",
      },
    ],
    languagesTitle: "Scegli la tua lingua",
    languagesLede: "Venti lingue, ognuna con la sua comunità.",
    practiceVerb: "Praticare",
    faqTitle: "Domande frequenti",
    faq: [
      {
        q: "Che cos'è Parlo?",
        a: "Una videochat di scambio linguistico. Ti abbina a caso con un madrelingua della lingua che studi, che a sua volta sta imparando la tua. Le conversazioni partono da due minuti e si allungano solo se lo volete entrambi.",
      },
      { q: "È gratis?", a: "Sì. L'abbinamento e le conversazioni sono gratuiti." },
      {
        q: "Serve registrarsi?",
        a: "Non devi creare un account. Devi però confermare di avere almeno 18 anni: Parlo abbina sconosciuti in video ed è una piattaforma esclusivamente per adulti.",
      },
      {
        q: "Le conversazioni vengono registrate?",
        a: "No. Video e audio viaggiano direttamente da un browser all'altro tramite WebRTC. Il server aiuta solo a stabilire la connessione; non vede né conserva mai il contenuto.",
      },
      {
        q: "Posso filtrare con chi parlo?",
        a: "Puoi filtrare per lingua e per genere, e chiedere la priorità a persone di un altro paese. Il filtro di genere vale in entrambe le direzioni e non viene mai allargato da solo, per quanto lunga sia l'attesa.",
      },
    ],
    footer:
      "Parlo è una piattaforma per maggiori di 18 anni. Moderiamo attivamente, non registriamo le conversazioni e segnaliamo materiale pedopornografico alle autorità competenti.",
  },

  gate: {
    title: "Verifica dell'età",
    body: "Parlo è riservato ai maggiori di 18 anni. Abbiniamo sconosciuti in video, quindi questa verifica non è una formalità.",
    pendingLabel: "Integrazione in sospeso:",
    pending:
      "in produzione questo passaggio deve richiamare un fornitore di verifica dell'età. La casella qui sotto è solo un segnaposto di sviluppo.",
    confirm: "Confermo di avere almeno 18 anni e accetto i Termini e l'Informativa sulla privacy.",
    continue: "Continua",
  },

  setup: {
    title: "Configura la sessione",
    lede: "Ti abbineremo a qualcuno di compatibile.",
    connecting: "Connessione al server…",
    speak: "Parlo correntemente",
    speakHint: "cosa offri",
    learn: "Voglio praticare",
    learnHint: "cosa cerchi",
    addAnother: "+ aggiungi un'altra",
    chooseLanguage: "Scegli una lingua",
    remove: "Rimuovi",
    level: "Il mio livello",
    levels: { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzato" },
    filters: "Filtri e profilo",
    anyGender: "qualsiasi genere",
    anyCountry: "qualsiasi paese",
    internationalShort: "internazionale",
    noName: "senza nome",
    wantToTalkWith: "Voglio parlare con",
    genderNote:
      "Non allarghiamo mai questo filtro al posto tuo, per quanto lunga sia l'attesa. Più lo restringi, più tempo ci vorrà per trovare qualcuno.",
    myGender: "Il mio genere",
    genders: {
      female: "Donna",
      male: "Uomo",
      nonbinary: "Non binario",
      undisclosed: "Preferisco non dirlo",
    },
    name: "Nome",
    optional: "facoltativo",
    namePlaceholder: "Come vuoi farti chiamare",
    international: "Dare priorità a persone di un altro paese",
    internationalNote: "È tutto il punto: accenti e contesto veri.",
    search: "Cerca un partner",
    cameraNote: "Continuando verranno attivati fotocamera e microfono.",
  },

  queue: {
    title: "Cerco un partner…",
    note: "Allarghiamo lingua e regione col passare del tempo. Il filtro di genere resta sempre.",
    cancel: "Annulla",
  },

  session: {
    speaks: "Parla",
    practises: "Pratica",
    anonymous: "Anonimo",
    international: "Internazionale",
    you: "Tu",
    noSignal: "Nessun segnale",
    report: "Segnala",
    next: "Avanti",
    exit: "Esci",
    unlimited: "Senza limite di tempo",
    keepTalking: "Continua a parlare",
    peerWants: "Vuole continuare — e tu?",
    waitingPeer: "In attesa del tuo partner…",
    bothIn: "Si continua!",
    privacyNote:
      "Non registriamo le chiamate. Non condividere mai dati personali, account o denaro con sconosciuti.",
  },

  chat: {
    icebreaker: "Rompi il ghiaccio. Chiedi da dove viene.",
    typing: "sta scrivendo…",
    placeholder: "Scrivi un messaggio",
    placeholderWaiting: "In attesa di un partner…",
    send: "Invia",
  },

  peerLeft: {
    skip: "Il tuo partner è passato a un'altra conversazione.",
    reported: "Conversazione terminata.",
    timeout: "Tempo scaduto. Cerco un'altra persona…",
    disconnect: "Il tuo partner si è disconnesso.",
  },

  report: {
    title: "Segnala questa persona",
    subtitle: "La conversazione terminerà subito.",
    priority: "Revisione prioritaria immediata",
    reasons: {
      minor: "Sembra essere minorenne",
      nudity: "Nudità o contenuti sessuali",
      harassment: "Molestie o insulti",
      violence: "Violenza o minacce",
      spam: "Spam o pubblicità",
      other: "Altro motivo",
    },
    detailsPlaceholder: "Dettagli (facoltativo)",
    cancel: "Annulla",
    submit: "Invia segnalazione",
    duplicate: "Avevi già segnalato questa conversazione.",
    rateLimited: "Troppe segnalazioni. Riprova più tardi.",
    failed: "Non siamo riusciti a registrare la segnalazione. Riprova.",
  },

  banned: {
    title: "Account sospeso",
    appeal: "Se pensi che sia un errore, puoi fare ricorso scrivendo a soporte@parlo.example.",
  },

  errors: {
    camera:
      "Parlo ha bisogno di fotocamera e microfono. Controlla i permessi del browser e riprova.",
    misconfigured:
      "Configurazione incompleta: NEXT_PUBLIC_SIGNAL_URL punta a ws:// da una pagina https. Il server di segnalazione richiede wss://.",
    closed: "Connessione chiusa.",
    connect: "Non è stato possibile raggiungere il server di abbinamento.",
  },

  practise: {
    breadcrumbHome: "Home",
    titleTemplate: "Praticare {lang} con madrelingua in video",
    h1Template: "Praticare {lang} parlando con madrelingua",
    descriptionTemplate:
      "Parla {lang} con madrelingua che stanno imparando la tua lingua. Abbinamento casuale, gratis, niente da programmare. Solo maggiori di 18 anni.",
    intro:
      "Parlo ti abbina a caso con madrelingua che stanno imparando la tua lingua. Loro praticano con te, tu pratichi con loro, e la conversazione dura quanto volete entrambi.",
    ctaTemplate: "Inizia a parlare {lang}",
    howTitle: "Come funziona",
    howSteps: [
      "Dici che lingua parli e quale pratichi.",
      "Ti abbiniamo a qualcuno il cui profilo è il tuo al contrario.",
      "Parlate. Se non scorre, passi al prossimo senza dare spiegazioni.",
    ],
    otherLanguages: "Altre lingue",
    faq: [
      {
        q: "È gratis?",
        a: "Sì. L'abbinamento e le conversazioni sono gratuiti. Parlo funziona per reciprocità: offri la tua lingua a chi la studia e quella persona ti offre la sua.",
      },
      {
        q: "Serve un livello minimo?",
        a: "No. Scegli il tuo livello all'inizio e l'abbinamento dà priorità a persone di livello simile, così la conversazione non è frustrante per nessuno dei due.",
      },
      {
        q: "Serve registrarsi?",
        a: "Non serve creare un account per iniziare. Devi però confermare di avere almeno 18 anni: Parlo abbina sconosciuti in video ed è una piattaforma esclusivamente per adulti.",
      },
      {
        q: "Posso scegliere con chi parlo?",
        a: "Puoi filtrare per lingua, per genere e chiedere la priorità a persone di un altro paese. Il filtro di genere vale in entrambe le direzioni e non viene mai allargato automaticamente, per quanto lunga sia l'attesa.",
      },
      {
        q: "Le conversazioni vengono registrate?",
        a: "No. Video e audio viaggiano direttamente tra i due browser tramite WebRTC; il server fa solo da intermediario per la connessione e non vede né conserva mai il contenuto.",
      },
    ],
  },
};
