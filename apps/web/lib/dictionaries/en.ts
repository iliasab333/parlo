import type { Dictionary } from "./es";

export const en: Dictionary = {
  common: {
    tagline: "Practice with natives, right now",
    description:
      "Random video chat for language exchange. We pair you with someone who speaks what you're learning and is learning what you speak. Free, and strictly 18+.",
    adultsOnly: "18+ only",
    free: "Free",
    online: "online",
    searching: "searching",
    languageLabel: "Language",
  },

  home: {
    eyebrow: "Language exchange, live",
    headline: "Talk to a native speaker right now.",
    headlineMuted: "Not in three weeks.",
    lede: "Practice With Natives pairs you at random with someone on the other side of the world who speaks what you're learning and is learning what you speak. Two minutes to start, and you carry on if you both want to.",
    cta: "Start talking",
    ctaNote: "Age verification required · Free",
    steps: [
      {
        title: "Say what you speak and what you're practicing",
        body: "Your own language and the one you want to improve. Matching looks for real reciprocity: you teach, you learn.",
      },
      {
        title: "We pair you at random",
        body: "With someone compatible from another country. No profiles to sift through, no swiping, no waiting for a reply.",
      },
      {
        title: "Two minutes to break the ice",
        body: "The conversation ends on its own unless you both want to continue. Nobody has to be the one who leaves.",
      },
    ],
    languagesTitle: "Pick your language",
    languagesLede: "Twenty languages, each with its own community.",
    practiceVerb: "Practice",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is Practice With Natives?",
        a: "A language-exchange video chat. It pairs you at random with a native speaker of the language you're studying, who is learning yours. Conversations start at two minutes and only run longer if you both want them to.",
      },
      { q: "Is it free?", a: "Yes. Matching and conversations are free." },
      {
        q: "Do I need an account?",
        a: "You don't need to create one. You do have to confirm you're 18 or over: Practice With Natives pairs strangers over video and is an adults-only platform.",
      },
      {
        q: "Are conversations recorded?",
        a: "No. Video and audio travel directly between the two browsers over WebRTC. The server only helps establish the connection; it never sees or stores the content.",
      },
      {
        q: "Can I choose who I talk to?",
        a: "You can filter by language and by gender, and ask to be matched with people from other countries. The gender filter is honoured in both directions and is never widened for you, however long the wait.",
      },
    ],
    footer:
      "Practice With Natives is a platform for adults aged 18 and over. We moderate actively, we do not record conversations, and we report child sexual abuse material to the relevant authorities.",
  },

  gate: {
    title: "Age verification",
    body: "Practice With Natives is strictly for people aged 18 and over. We pair strangers over video, so this check is not a formality.",
    pendingLabel: "Integration pending:",
    pending:
      "in production this step must call an age-assurance provider. The checkbox below is a development placeholder only.",
    confirm: "I confirm I am 18 or older and accept the Terms and the Privacy Policy.",
    continue: "Continue",
  },

  setup: {
    title: "Set up your session",
    lede: "We'll pair you with someone compatible.",
    connecting: "Connecting to the server…",
    speak: "I speak fluently",
    speakHint: "what you offer",
    learn: "I want to practice",
    learnHint: "what you're after",
    addAnother: "+ add another",
    chooseLanguage: "Choose a language",
    remove: "Remove",
    level: "My level",
    levels: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
    filters: "Filters and profile",
    anyGender: "any gender",
    anyCountry: "any country",
    internationalShort: "international",
    noName: "no name",
    wantToTalkWith: "I want to talk with",
    genderNote:
      "We never widen this filter for you, however long the wait. The more you narrow it, the longer it takes to find someone.",
    myGender: "My gender",
    genders: {
      female: "Woman",
      male: "Man",
      nonbinary: "Non-binary",
      undisclosed: "Prefer not to say",
    },
    name: "Name",
    optional: "optional",
    namePlaceholder: "What should people call you",
    international: "Prefer people from another country",
    internationalNote: "That's the whole point: real accents, real context.",
    search: "Find a partner",
    cameraNote: "Continuing will turn on your camera and microphone.",
  },

  queue: {
    title: "Looking for a partner…",
    note: "We widen language and region as time passes. Your gender filter always stays.",
    cancel: "Cancel",
  },

  session: {
    speaks: "Speaks",
    practises: "Practicing",
    anonymous: "Anonymous",
    international: "International",
    you: "You",
    noSignal: "No signal",
    report: "Report",
    next: "Next",
    exit: "Leave",
    unlimited: "No time limit",
    keepTalking: "Keep talking",
    keepTalkingShort: "Stay",
    peerWantsShort: "Stay too?",
    peerWants: "They want to stay — you?",
    waitingPeer: "Waiting for your partner…",
    bothIn: "You're both in!",
    privacyNote:
      "We don't record calls. Never share personal details, accounts or money with strangers.",
  },

  chat: {
    icebreaker: "Break the ice. Ask where they're from.",
    typing: "typing…",
    placeholder: "Write a message",
    placeholderWaiting: "Waiting for a partner…",
    send: "Send",
  },

  peerLeft: {
    skip: "Your partner moved on to another conversation.",
    reported: "Conversation ended.",
    timeout: "Time's up. Looking for someone else…",
    disconnect: "Your partner disconnected.",
  },

  report: {
    title: "Report this person",
    subtitle: "The conversation will end immediately.",
    priority: "Immediate priority review",
    reasons: {
      minor: "Appears to be under 18",
      nudity: "Nudity or sexual content",
      harassment: "Harassment or abuse",
      violence: "Violence or threats",
      spam: "Spam or advertising",
      other: "Something else",
    },
    detailsPlaceholder: "Details (optional)",
    cancel: "Cancel",
    submit: "Send report",
    duplicate: "You had already reported this conversation.",
    rateLimited: "Too many reports. Try again later.",
    failed: "We couldn't record the report. Please try again.",
  },

  banned: {
    title: "Account suspended",
    appeal: "If you think this is a mistake, you can appeal at {email}.",
  },

  errors: {
    camera:
      "Practice With Natives needs your camera and microphone. Check your browser permissions and try again.",
    misconfigured:
      "Incomplete configuration: NEXT_PUBLIC_SIGNAL_URL points at ws:// from an https page. The signalling server needs wss://.",
    closed: "Connection closed.",
    connect: "Couldn't reach the matchmaking server.",
  },

  practise: {
    breadcrumbHome: "Home",
    titleTemplate: "Practice {lang} with native speakers over video",
    h1Template: "Practice {lang} by talking to native speakers",
    descriptionTemplate:
      "Speak {lang} with native speakers who are learning your language. Random matching, free, nothing to schedule. Strictly 18+.",
    intro:
      "Practice With Natives pairs you at random with native speakers who are learning your language. They practice with you, you practice with them, and the conversation lasts as long as you both want it to.",
    ctaTemplate: "Start speaking {lang}",
    howTitle: "How it works",
    howSteps: [
      "You say which language you speak and which you're practicing.",
      "We pair you with someone whose profile is yours in reverse.",
      "You talk. If it isn't flowing, you move on without explaining yourself.",
    ],
    otherLanguages: "Other languages",
    faq: [
      {
        q: "Is it free?",
        a: "Yes. Matching and conversations are free. Practice With Natives runs on reciprocity: you offer your language to someone studying it, and they offer you theirs.",
      },
      {
        q: "Do I need a minimum level?",
        a: "No. You pick your level at the start and matching favours people at a similar one, so the conversation isn't frustrating for either of you.",
      },
      {
        q: "Do I need an account?",
        a: "You don't need one to start. You do have to confirm you're 18 or over: Practice With Natives pairs strangers over video and is an adults-only platform.",
      },
      {
        q: "Can I choose who I talk to?",
        a: "You can filter by language, by gender, and ask to be matched with people from other countries. The gender filter is honoured in both directions and is never widened automatically, however long the wait.",
      },
      {
        q: "Are conversations recorded?",
        a: "No. Video and audio travel directly between the two browsers over WebRTC; the server only brokers the connection and never sees or stores the content.",
      },
    ],
  },

  country: {
    titleTemplate: "Practice {lang} with {people}",
    descriptionTemplate:
      "Speak {lang} with {people} who are learning your language. Random matching, free, nothing to schedule. Strictly 18+.",
    accentTitle: "How it sounds",
    scheduleTitle: "When your hours overlap",
    ctaTemplate: "Talk to {people}",
    otherVariants: "Other variants",
    allSpeakersTemplate: "All {lang} speakers",
  },

  purpose: {
    hubTitle: "What are you practicing for?",
    hubLede: "The goal changes how you should spend each session.",
    problemTitle: "The real problem",
    tipsTitle: "How to make a session count",
    languagesTitle: "Pick the language",
    otherPurposes: "Other goals",
  },
};
