import type { Dictionary } from "./es";

export const de: Dictionary = {
  common: {
    tagline: "Sprachen üben – im Gespräch mit Muttersprachlern, sofort",
    description:
      "Zufälliger Videochat für den Sprachaustausch. Wir bringen dich mit jemandem zusammen, der spricht, was du lernst, und lernt, was du sprichst. Kostenlos und erst ab 18.",
    adultsOnly: "Nur ab 18",
    free: "Kostenlos",
    online: "online",
    searching: "auf der Suche",
    languageLabel: "Sprache",
  },

  home: {
    eyebrow: "Sprachaustausch, live",
    headline: "Sprich jetzt mit einem Muttersprachler.",
    headlineMuted: "Nicht erst in drei Wochen.",
    lede: "Practice With Natives verbindet dich zufällig mit jemandem auf der anderen Seite der Welt, der spricht, was du lernst, und lernt, was du sprichst. Zwei Minuten zum Anfangen – und ihr macht weiter, wenn ihr beide wollt.",
    cta: "Loslegen",
    ctaNote: "Altersprüfung erforderlich · Kostenlos",
    steps: [
      {
        title: "Sag, was du sprichst und was du übst",
        body: "Deine Sprache und die, die du verbessern willst. Das Matching sucht echte Gegenseitigkeit: Du gibst etwas, du bekommst etwas.",
      },
      {
        title: "Wir verbinden dich zufällig",
        body: "Mit jemand Passendem aus einem anderen Land. Keine Profile durchblättern, kein Swipen, kein Warten auf Antwort.",
      },
      {
        title: "Zwei Minuten, um das Eis zu brechen",
        body: "Das Gespräch endet von selbst, außer ihr wollt beide weitermachen. Niemand muss derjenige sein, der es beendet.",
      },
    ],
    languagesTitle: "Wähle deine Sprache",
    languagesLede: "Zwanzig Sprachen, jede mit ihrer eigenen Community.",
    practiceVerb: "Üben:",
    faqTitle: "Häufige Fragen",
    faq: [
      {
        q: "Was ist Practice With Natives?",
        a: "Ein Videochat für Sprachaustausch. Er verbindet dich zufällig mit einem Muttersprachler der Sprache, die du lernst – und der wiederum deine lernt. Gespräche starten mit zwei Minuten und werden nur länger, wenn ihr beide wollt.",
      },
      { q: "Ist es kostenlos?", a: "Ja. Matching und Gespräche sind kostenlos." },
      {
        q: "Muss ich mich registrieren?",
        a: "Ein Konto brauchst du nicht. Du musst aber bestätigen, dass du 18 oder älter bist: Practice With Natives verbindet Fremde per Video und ist eine Plattform ausschließlich für Erwachsene.",
      },
      {
        q: "Werden Gespräche aufgezeichnet?",
        a: "Nein. Video und Ton laufen über WebRTC direkt von Browser zu Browser. Der Server hilft nur beim Verbindungsaufbau; er sieht und speichert die Inhalte nie.",
      },
      {
        q: "Kann ich filtern, mit wem ich spreche?",
        a: "Du kannst nach Sprache und Geschlecht filtern und Menschen aus anderen Ländern bevorzugen. Der Geschlechterfilter gilt in beide Richtungen und wird nie von selbst gelockert, egal wie lang die Wartezeit ist.",
      },
    ],
    footer:
      "Practice With Natives ist eine Plattform für Personen ab 18 Jahren. Wir moderieren aktiv, zeichnen keine Gespräche auf und melden Darstellungen sexuellen Kindesmissbrauchs den zuständigen Behörden.",
  },

  gate: {
    title: "Altersprüfung",
    body: "Practice With Natives ist ausschließlich für Personen ab 18 Jahren. Wir verbinden Fremde per Video – diese Prüfung ist keine Formsache.",
    pendingLabel: "Integration ausstehend:",
    pending:
      "im Produktivbetrieb muss dieser Schritt einen Anbieter zur Altersverifikation aufrufen. Das Kästchen unten ist nur ein Platzhalter für die Entwicklung.",
    confirm: "Ich bestätige, dass ich 18 Jahre oder älter bin, und akzeptiere die AGB und die Datenschutzerklärung.",
    continue: "Weiter",
  },

  setup: {
    title: "Sitzung einrichten",
    lede: "Wir verbinden dich mit jemand Passendem.",
    connecting: "Verbindung zum Server…",
    speak: "Ich spreche fließend",
    speakHint: "was du anbietest",
    learn: "Ich möchte üben",
    learnHint: "was du suchst",
    addAnother: "+ weitere hinzufügen",
    chooseLanguage: "Sprache wählen",
    remove: "Entfernen",
    level: "Mein Niveau",
    levels: { beginner: "Anfänger", intermediate: "Mittelstufe", advanced: "Fortgeschritten" },
    filters: "Filter und Profil",
    anyGender: "beliebiges Geschlecht",
    anyCountry: "beliebiges Land",
    internationalShort: "international",
    noName: "ohne Namen",
    wantToTalkWith: "Ich möchte sprechen mit",
    genderNote:
      "Wir lockern diesen Filter nie für dich, egal wie lang die Wartezeit wird. Je enger du ihn setzt, desto länger dauert es, jemanden zu finden.",
    myGender: "Mein Geschlecht",
    genders: {
      female: "Frau",
      male: "Mann",
      nonbinary: "Nichtbinär",
      undisclosed: "Keine Angabe",
    },
    name: "Name",
    optional: "optional",
    namePlaceholder: "Wie sollen dich andere nennen",
    international: "Menschen aus anderen Ländern bevorzugen",
    internationalNote: "Genau darum geht es: echte Akzente, echter Kontext.",
    search: "Partner suchen",
    cameraNote: "Mit dem Fortfahren werden Kamera und Mikrofon aktiviert.",
  },

  queue: {
    title: "Suche nach einem Partner…",
    note: "Sprache und Region weiten wir mit der Zeit aus. Dein Geschlechterfilter bleibt immer bestehen.",
    cancel: "Abbrechen",
  },

  session: {
    speaks: "Spricht",
    practises: "Übt",
    anonymous: "Anonym",
    international: "International",
    you: "Du",
    noSignal: "Kein Signal",
    report: "Melden",
    next: "Weiter",
    exit: "Verlassen",
    unlimited: "Ohne Zeitlimit",
    keepTalking: "Weiter sprechen",
    keepTalkingShort: "Bleiben",
    peerWantsShort: "Auch?",
    peerWants: "Will weitermachen — und du?",
    waitingPeer: "Warte auf deinen Partner…",
    bothIn: "Wir machen weiter!",
    privacyNote:
      "Wir zeichnen keine Gespräche auf. Teile nie persönliche Daten, Konten oder Geld mit Fremden.",
  },

  chat: {
    icebreaker: "Brich das Eis. Frag, woher die Person kommt.",
    typing: "schreibt…",
    placeholder: "Nachricht schreiben",
    placeholderWaiting: "Warte auf einen Partner…",
    send: "Senden",
  },

  peerLeft: {
    skip: "Dein Partner ist zu einem anderen Gespräch gewechselt.",
    reported: "Gespräch beendet.",
    timeout: "Die Zeit ist um. Suche nach jemand anderem…",
    disconnect: "Dein Partner hat die Verbindung getrennt.",
  },

  report: {
    title: "Diese Person melden",
    subtitle: "Das Gespräch endet sofort.",
    priority: "Sofortige vorrangige Prüfung",
    reasons: {
      minor: "Scheint minderjährig zu sein",
      nudity: "Nacktheit oder sexuelle Inhalte",
      harassment: "Belästigung oder Beleidigungen",
      violence: "Gewalt oder Drohungen",
      spam: "Spam oder Werbung",
      other: "Anderer Grund",
    },
    detailsPlaceholder: "Details (optional)",
    cancel: "Abbrechen",
    submit: "Meldung senden",
    duplicate: "Du hattest dieses Gespräch bereits gemeldet.",
    rateLimited: "Zu viele Meldungen. Versuch es später noch einmal.",
    failed: "Die Meldung konnte nicht gespeichert werden. Bitte versuch es erneut.",
  },

  banned: {
    title: "Konto gesperrt",
    appeal: "Wenn du das für einen Fehler hältst, kannst du unter {email} Einspruch einlegen.",
  },

  errors: {
    camera:
      "Practice With Natives braucht Kamera und Mikrofon. Prüfe die Browser-Berechtigungen und versuch es erneut.",
    misconfigured:
      "Unvollständige Konfiguration: NEXT_PUBLIC_SIGNAL_URL zeigt von einer https-Seite auf ws://. Der Signalisierungsserver braucht wss://.",
    closed: "Verbindung geschlossen.",
    connect: "Der Matching-Server war nicht erreichbar.",
  },

  practise: {
    breadcrumbHome: "Start",
    titleTemplate: "{lang} mit Muttersprachlern per Video üben",
    h1Template: "{lang} üben im Gespräch mit Muttersprachlern",
    descriptionTemplate:
      "Sprich {lang} mit Muttersprachlern, die deine Sprache lernen. Zufälliges Matching, kostenlos, nichts zu planen. Erst ab 18.",
    intro:
      "Practice With Natives verbindet dich zufällig mit Muttersprachlern, die deine Sprache lernen. Sie üben mit dir, du übst mit ihnen – und das Gespräch dauert so lange, wie ihr beide wollt.",
    ctaTemplate: "{lang} sprechen",
    howTitle: "So funktioniert es",
    howSteps: [
      "Du sagst, welche Sprache du sprichst und welche du übst.",
      "Wir verbinden dich mit jemandem, dessen Profil deines umgekehrt ist.",
      "Ihr redet. Wenn es nicht passt, gehst du weiter – ohne Erklärung.",
    ],
    otherLanguages: "Andere Sprachen",
    faq: [
      {
        q: "Ist es kostenlos?",
        a: "Ja. Matching und Gespräche sind kostenlos. Practice With Natives funktioniert über Gegenseitigkeit: Du bietest deine Sprache jemandem an, der sie lernt, und diese Person bietet dir ihre an.",
      },
      {
        q: "Brauche ich ein Mindestniveau?",
        a: "Nein. Du wählst zu Beginn dein Niveau, und das Matching bevorzugt Menschen auf ähnlichem Stand, damit das Gespräch für keinen von beiden frustrierend wird.",
      },
      {
        q: "Muss ich mich registrieren?",
        a: "Zum Starten brauchst du kein Konto. Du musst aber bestätigen, dass du 18 oder älter bist: Practice With Natives verbindet Fremde per Video und ist eine Plattform ausschließlich für Erwachsene.",
      },
      {
        q: "Kann ich wählen, mit wem ich spreche?",
        a: "Du kannst nach Sprache und Geschlecht filtern und Menschen aus anderen Ländern bevorzugen. Der Geschlechterfilter gilt in beide Richtungen und wird nie automatisch gelockert, egal wie lang die Wartezeit ist.",
      },
      {
        q: "Werden Gespräche aufgezeichnet?",
        a: "Nein. Video und Ton laufen über WebRTC direkt zwischen den beiden Browsern; der Server vermittelt nur die Verbindung und sieht oder speichert die Inhalte nie.",
      },
    ],
  },

  country: {
    titleTemplate: "{lang} mit {people} üben",
    descriptionTemplate:
      "Sprich {lang} mit {people}, die deine Sprache lernen. Zufälliges Matching, kostenlos, nichts zu planen. Erst ab 18.",
    accentTitle: "Wie es klingt",
    scheduleTitle: "Wann ihr euch überschneidet",
    ctaTemplate: "Mit {people} sprechen",
    otherVariants: "Andere Varianten",
    allSpeakersTemplate: "Alle {lang}-Sprecher",
  },

  purpose: {
    hubTitle: "Wofür willst du üben?",
    hubLede: "Das Ziel ändert, wie du jede Sitzung nutzen solltest.",
    problemTitle: "Das eigentliche Problem",
    tipsTitle: "So holst du aus einer Sitzung etwas heraus",
    languagesTitle: "Sprache wählen",
    otherPurposes: "Andere Ziele",
  },
};
