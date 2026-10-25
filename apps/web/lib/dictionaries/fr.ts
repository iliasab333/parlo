import type { Dictionary } from "./es";

export const fr: Dictionary = {
  common: {
    tagline: "Pratiquez les langues avec des natifs, maintenant",
    description:
      "Chat vidéo aléatoire pour l'échange linguistique. Nous vous mettons en relation avec quelqu'un qui parle ce que vous apprenez et apprend ce que vous parlez. Gratuit et réservé aux plus de 18 ans.",
    adultsOnly: "18+ uniquement",
    free: "Gratuit",
    online: "en ligne",
    searching: "en recherche",
    languageLabel: "Langue",
  },

  home: {
    eyebrow: "Échange linguistique, en direct",
    headline: "Parlez à un natif tout de suite.",
    headlineMuted: "Pas dans trois semaines.",
    lede: "Lingora vous met en relation au hasard avec quelqu'un à l'autre bout du monde qui parle ce que vous apprenez et apprend ce que vous parlez. Deux minutes pour commencer, et vous continuez si vous le voulez tous les deux.",
    cta: "Commencer à parler",
    ctaNote: "Vérification de l'âge requise · Gratuit",
    steps: [
      {
        title: "Dites ce que vous parlez et ce que vous pratiquez",
        body: "Votre langue et celle que vous voulez améliorer. L'appariement cherche une vraie réciprocité : vous enseignez, vous apprenez.",
      },
      {
        title: "Nous vous apparions au hasard",
        body: "Avec quelqu'un de compatible dans un autre pays. Aucun profil à parcourir, pas de swipe, pas d'attente de réponse.",
      },
      {
        title: "Deux minutes pour briser la glace",
        body: "La conversation s'arrête d'elle-même sauf si vous voulez tous les deux continuer. Personne n'a à être celui qui met fin.",
      },
    ],
    languagesTitle: "Choisissez votre langue",
    languagesLede: "Vingt langues, chacune avec sa propre communauté.",
    practiceVerb: "Pratiquer",
    faqTitle: "Questions fréquentes",
    faq: [
      {
        q: "Qu'est-ce que Lingora ?",
        a: "Un chat vidéo d'échange linguistique. Il vous apparie au hasard avec un locuteur natif de la langue que vous étudiez, qui apprend la vôtre. Les conversations démarrent sur deux minutes et ne se prolongent que si vous le souhaitez tous les deux.",
      },
      { q: "Est-ce gratuit ?", a: "Oui. L'appariement et les conversations sont gratuits." },
      {
        q: "Faut-il s'inscrire ?",
        a: "Vous n'avez pas besoin de créer un compte. Vous devez en revanche confirmer que vous avez 18 ans ou plus : Lingora met en relation des inconnus par vidéo et reste une plateforme réservée aux adultes.",
      },
      {
        q: "Les conversations sont-elles enregistrées ?",
        a: "Non. La vidéo et l'audio circulent directement d'un navigateur à l'autre via WebRTC. Le serveur aide seulement à établir la connexion ; il ne voit ni ne conserve jamais le contenu.",
      },
      {
        q: "Puis-je filtrer avec qui je parle ?",
        a: "Vous pouvez filtrer par langue et par genre, et demander la priorité aux personnes d'un autre pays. Le filtre de genre est respecté dans les deux sens et n'est jamais élargi tout seul, quelle que soit la durée de l'attente.",
      },
    ],
    footer:
      "Lingora est une plateforme réservée aux personnes de 18 ans et plus. Nous modérons activement, nous n'enregistrons pas les conversations et nous signalons tout contenu d'abus sexuel sur mineur aux autorités compétentes.",
  },

  gate: {
    title: "Vérification de l'âge",
    body: "Lingora est strictement réservé aux personnes de 18 ans et plus. Nous mettons en relation des inconnus par vidéo : cette vérification n'est pas une formalité.",
    pendingLabel: "Intégration en attente :",
    pending:
      "en production, cette étape doit appeler un prestataire de vérification d'âge. La case ci-dessous n'est qu'un repère de développement.",
    confirm: "Je confirme avoir 18 ans ou plus et j'accepte les Conditions et la Politique de confidentialité.",
    continue: "Continuer",
  },

  setup: {
    title: "Configurez votre session",
    lede: "Nous vous apparierons avec quelqu'un de compatible.",
    connecting: "Connexion au serveur…",
    speak: "Je parle couramment",
    speakHint: "ce que vous offrez",
    learn: "Je veux pratiquer",
    learnHint: "ce que vous cherchez",
    addAnother: "+ ajouter une autre",
    chooseLanguage: "Choisissez une langue",
    remove: "Retirer",
    level: "Mon niveau",
    levels: { beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé" },
    filters: "Filtres et profil",
    anyGender: "tous genres",
    anyCountry: "tous pays",
    internationalShort: "international",
    noName: "sans nom",
    wantToTalkWith: "Je veux parler avec",
    genderNote:
      "Nous n'élargissons jamais ce filtre à votre place, quelle que soit la durée de l'attente. Plus vous le restreignez, plus il faudra de temps pour trouver quelqu'un.",
    myGender: "Mon genre",
    genders: {
      female: "Femme",
      male: "Homme",
      nonbinary: "Non binaire",
      undisclosed: "Je préfère ne pas dire",
    },
    name: "Prénom",
    optional: "facultatif",
    namePlaceholder: "Comment voulez-vous qu'on vous appelle",
    international: "Donner la priorité aux personnes d'un autre pays",
    internationalNote: "C'est tout l'intérêt : des accents et un contexte réels.",
    search: "Trouver un partenaire",
    cameraNote: "En continuant, votre caméra et votre micro seront activés.",
  },

  queue: {
    title: "Recherche d'un partenaire…",
    note: "Nous élargissons la langue et la région au fil du temps. Votre filtre de genre reste toujours en place.",
    cancel: "Annuler",
  },

  session: {
    speaks: "Parle",
    practises: "Pratique",
    anonymous: "Anonyme",
    international: "International",
    you: "Vous",
    noSignal: "Pas de signal",
    report: "Signaler",
    next: "Suivant",
    exit: "Quitter",
    unlimited: "Sans limite de temps",
    keepTalking: "Continuer à parler",
    peerWants: "Il/elle veut continuer — et vous ?",
    waitingPeer: "En attente de votre partenaire…",
    bothIn: "On continue !",
    privacyNote:
      "Nous n'enregistrons pas les appels. Ne partagez jamais de données personnelles, de comptes ni d'argent avec des inconnus.",
  },

  chat: {
    icebreaker: "Brisez la glace. Demandez d'où vient la personne.",
    typing: "en train d'écrire…",
    placeholder: "Écrivez un message",
    placeholderWaiting: "En attente d'un partenaire…",
    send: "Envoyer",
  },

  peerLeft: {
    skip: "Votre partenaire est passé à une autre conversation.",
    reported: "Conversation terminée.",
    timeout: "Le temps est écoulé. Recherche d'une autre personne…",
    disconnect: "Votre partenaire s'est déconnecté.",
  },

  report: {
    title: "Signaler cette personne",
    subtitle: "La conversation prendra fin immédiatement.",
    priority: "Examen prioritaire immédiat",
    reasons: {
      minor: "Semble être mineur",
      nudity: "Nudité ou contenu sexuel",
      harassment: "Harcèlement ou insultes",
      violence: "Violence ou menaces",
      spam: "Spam ou publicité",
      other: "Autre motif",
    },
    detailsPlaceholder: "Détails (facultatif)",
    cancel: "Annuler",
    submit: "Envoyer le signalement",
    duplicate: "Vous aviez déjà signalé cette conversation.",
    rateLimited: "Trop de signalements. Réessayez plus tard.",
    failed: "Nous n'avons pas pu enregistrer le signalement. Réessayez.",
  },

  banned: {
    title: "Compte suspendu",
    appeal: "Si vous pensez qu'il s'agit d'une erreur, vous pouvez faire appel à {email}.",
  },

  errors: {
    camera:
      "Lingora a besoin de votre caméra et de votre micro. Vérifiez les autorisations du navigateur et réessayez.",
    misconfigured:
      "Configuration incomplète : NEXT_PUBLIC_SIGNAL_URL pointe vers ws:// depuis une page https. Le serveur de signalisation a besoin de wss://.",
    closed: "Connexion fermée.",
    connect: "Impossible de joindre le serveur d'appariement.",
  },

  practise: {
    breadcrumbHome: "Accueil",
    titleTemplate: "Pratiquer {lang} avec des natifs en vidéo",
    h1Template: "Pratiquer {lang} en parlant avec des natifs",
    descriptionTemplate:
      "Parlez {lang} avec des locuteurs natifs qui apprennent votre langue. Appariement aléatoire, gratuit, rien à planifier. Réservé aux plus de 18 ans.",
    intro:
      "Lingora vous apparie au hasard avec des locuteurs natifs qui apprennent votre langue. Ils pratiquent avec vous, vous pratiquez avec eux, et la conversation dure aussi longtemps que vous le voulez tous les deux.",
    ctaTemplate: "Commencer à parler {lang}",
    howTitle: "Comment ça marche",
    howSteps: [
      "Vous indiquez la langue que vous parlez et celle que vous pratiquez.",
      "Nous vous apparions avec quelqu'un dont le profil est le vôtre à l'envers.",
      "Vous parlez. Si ça ne prend pas, vous passez au suivant sans vous justifier.",
    ],
    otherLanguages: "Autres langues",
    faq: [
      {
        q: "Est-ce gratuit ?",
        a: "Oui. L'appariement et les conversations sont gratuits. Lingora fonctionne par réciprocité : vous offrez votre langue à qui l'étudie, et cette personne vous offre la sienne.",
      },
      {
        q: "Faut-il un niveau minimum ?",
        a: "Non. Vous choisissez votre niveau au départ et l'appariement privilégie les personnes d'un niveau proche, pour que la conversation ne soit frustrante pour aucun des deux.",
      },
      {
        q: "Faut-il s'inscrire ?",
        a: "Pas besoin de créer un compte pour commencer. Vous devez en revanche confirmer que vous avez 18 ans ou plus : Lingora met en relation des inconnus par vidéo et reste une plateforme réservée aux adultes.",
      },
      {
        q: "Puis-je choisir avec qui je parle ?",
        a: "Vous pouvez filtrer par langue, par genre et demander la priorité aux personnes d'un autre pays. Le filtre de genre est respecté dans les deux sens et n'est jamais élargi automatiquement, quelle que soit la durée de l'attente.",
      },
      {
        q: "Les conversations sont-elles enregistrées ?",
        a: "Non. La vidéo et l'audio circulent directement entre les deux navigateurs via WebRTC ; le serveur ne fait qu'établir la connexion et ne voit ni ne conserve jamais le contenu.",
      },
    ],
  },

  country: {
    titleTemplate: "Pratiquer {lang} avec des {people}",
    descriptionTemplate:
      "Parlez {lang} avec des {people} qui apprennent votre langue. Appariement aléatoire, gratuit, rien à planifier. Réservé aux plus de 18 ans.",
    accentTitle: "Comment ça sonne",
    scheduleTitle: "Quand vos horaires se croisent",
    ctaTemplate: "Parler avec des {people}",
    otherVariants: "Autres variantes",
    allSpeakersTemplate: "Tous les locuteurs de {lang}",
  },

  purpose: {
    hubTitle: "Pour quoi voulez-vous pratiquer ?",
    hubLede: "L'objectif change la façon dont vous devriez utiliser chaque session.",
    problemTitle: "Le vrai problème",
    tipsTitle: "Comment tirer parti d'une session",
    languagesTitle: "Choisissez la langue",
    otherPurposes: "Autres objectifs",
  },
};
