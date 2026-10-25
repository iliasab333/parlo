import type { Dictionary } from "./es";

export const pt: Dictionary = {
  common: {
    tagline: "Pratica idiomas falando com nativos, agora",
    description:
      "Videochat aleatório para intercâmbio de idiomas. Emparelhamos-te com alguém que fala o que estudas e estuda o que falas. Grátis e apenas para maiores de 18 anos.",
    adultsOnly: "Só +18",
    free: "Grátis",
    online: "online",
    searching: "à procura",
    languageLabel: "Idioma",
  },

  home: {
    eyebrow: "Intercâmbio de idiomas, ao vivo",
    headline: "Fala com um nativo agora mesmo.",
    headlineMuted: "Não daqui a três semanas.",
    lede: "O Practice With Natives emparelha-te ao acaso com alguém do outro lado do mundo que fala o que tu estudas e estuda o que tu falas. Dois minutos para começar, e continuam se os dois quiserem.",
    cta: "Começar a falar",
    ctaNote: "Requer verificação de idade · Grátis",
    steps: [
      {
        title: "Diz o que falas e o que praticas",
        body: "A tua língua e aquela que queres melhorar. O emparelhamento procura reciprocidade real: ensinas e aprendes.",
      },
      {
        title: "Emparelhamos-te ao acaso",
        body: "Com alguém compatível de outro país. Sem perfis para percorrer, sem swipe, sem esperar resposta.",
      },
      {
        title: "Dois minutos para quebrar o gelo",
        body: "A conversa acaba sozinha a não ser que os dois queiram continuar. Ninguém tem de ser quem a corta.",
      },
    ],
    languagesTitle: "Escolhe o teu idioma",
    languagesLede: "Vinte idiomas, cada um com a sua comunidade.",
    practiceVerb: "Praticar",
    faqTitle: "Perguntas frequentes",
    faq: [
      {
        q: "O que é o Practice With Natives?",
        a: "Um videochat de intercâmbio de idiomas. Emparelha-te ao acaso com um falante nativo do idioma que estudas, que por sua vez está a aprender o teu. As conversas começam com dois minutos e só se prolongam se ambos quiserem.",
      },
      { q: "É grátis?", a: "Sim. O emparelhamento e as conversas são gratuitos." },
      {
        q: "É preciso registo?",
        a: "Não precisas de criar conta. Tens de confirmar que tens 18 anos ou mais: o Practice With Natives emparelha desconhecidos por vídeo e é uma plataforma exclusivamente para adultos.",
      },
      {
        q: "As conversas são gravadas?",
        a: "Não. O vídeo e o áudio viajam diretamente de um navegador para o outro através de WebRTC. O servidor apenas ajuda a estabelecer a ligação; nunca vê nem guarda o conteúdo.",
      },
      {
        q: "Posso filtrar com quem falo?",
        a: "Podes filtrar por idioma e por género, e pedir prioridade a pessoas de outro país. O filtro de género é respeitado nos dois sentidos e nunca é alargado sozinho, por mais longa que seja a espera.",
      },
    ],
    footer:
      "O Practice With Natives é uma plataforma para maiores de 18 anos. Moderamos ativamente, não gravamos as conversas e reportamos material de abuso sexual de menores às autoridades competentes.",
  },

  gate: {
    title: "Verificação de idade",
    body: "O Practice With Natives é exclusivamente para maiores de 18 anos. Emparelhamos desconhecidos por vídeo, por isso esta verificação não é uma formalidade.",
    pendingLabel: "Integração pendente:",
    pending:
      "em produção este passo tem de chamar um fornecedor de verificação de idade. A caixa abaixo é apenas um marcador de desenvolvimento.",
    confirm: "Confirmo que tenho 18 anos ou mais e aceito os Termos e a Política de Privacidade.",
    continue: "Continuar",
  },

  setup: {
    title: "Configura a tua sessão",
    lede: "Vamos emparelhar-te com alguém compatível.",
    connecting: "A ligar ao servidor…",
    speak: "Falo fluentemente",
    speakHint: "o que ofereces",
    learn: "Quero praticar",
    learnHint: "o que procuras",
    addAnother: "+ adicionar outro",
    chooseLanguage: "Escolhe um idioma",
    remove: "Remover",
    level: "O meu nível",
    levels: { beginner: "Principiante", intermediate: "Intermédio", advanced: "Avançado" },
    filters: "Filtros e perfil",
    anyGender: "qualquer género",
    anyCountry: "qualquer país",
    internationalShort: "internacional",
    noName: "sem nome",
    wantToTalkWith: "Quero falar com",
    genderNote:
      "Nunca alargamos este filtro por ti, por mais longa que seja a espera. Quanto mais o restringires, mais demoras a encontrar alguém.",
    myGender: "O meu género",
    genders: {
      female: "Mulher",
      male: "Homem",
      nonbinary: "Não binário",
      undisclosed: "Prefiro não dizer",
    },
    name: "Nome",
    optional: "opcional",
    namePlaceholder: "Como queres que te chamem",
    international: "Dar prioridade a pessoas de outro país",
    internationalNote: "É esse o objetivo: sotaques e contexto reais.",
    search: "Procurar parceiro",
    cameraNote: "Ao continuar, a câmara e o microfone serão ativados.",
  },

  queue: {
    title: "À procura de parceiro…",
    note: "Alargamos idioma e região com o passar do tempo. O teu filtro de género mantém-se sempre.",
    cancel: "Cancelar",
  },

  session: {
    speaks: "Fala",
    practises: "Pratica",
    anonymous: "Anónimo",
    international: "Internacional",
    you: "Tu",
    noSignal: "Sem sinal",
    report: "Denunciar",
    next: "Seguinte",
    exit: "Sair",
    unlimited: "Sem limite de tempo",
    keepTalking: "Continuar a falar",
    keepTalkingShort: "Seguir",
    peerWantsShort: "Continuamos?",
    peerWants: "Quer continuar — e tu?",
    waitingPeer: "À espera do teu parceiro…",
    bothIn: "Continuamos!",
    privacyNote:
      "Não gravamos as chamadas. Nunca partilhes dados pessoais, contas ou dinheiro com desconhecidos.",
  },

  chat: {
    icebreaker: "Quebra o gelo. Pergunta de onde é.",
    typing: "a escrever…",
    placeholder: "Escreve uma mensagem",
    placeholderWaiting: "À espera de parceiro…",
    send: "Enviar",
  },

  peerLeft: {
    skip: "O teu parceiro passou a outra conversa.",
    reported: "Conversa terminada.",
    timeout: "Acabou o tempo. À procura de outra pessoa…",
    disconnect: "O teu parceiro desligou-se.",
  },

  report: {
    title: "Denunciar esta pessoa",
    subtitle: "A conversa termina imediatamente.",
    priority: "Revisão prioritária imediata",
    reasons: {
      minor: "Parece ser menor de idade",
      nudity: "Nudez ou conteúdo sexual",
      harassment: "Assédio ou insultos",
      violence: "Violência ou ameaças",
      spam: "Spam ou publicidade",
      other: "Outro motivo",
    },
    detailsPlaceholder: "Detalhes (opcional)",
    cancel: "Cancelar",
    submit: "Enviar denúncia",
    duplicate: "Já tinhas denunciado esta conversa.",
    rateLimited: "Demasiadas denúncias. Tenta mais tarde.",
    failed: "Não conseguimos registar a denúncia. Tenta novamente.",
  },

  banned: {
    title: "Conta suspensa",
    appeal: "Se achas que é um erro, podes recorrer escrevendo para {email}.",
  },

  errors: {
    camera:
      "O Practice With Natives precisa da câmara e do microfone. Verifica as permissões do navegador e tenta novamente.",
    misconfigured:
      "Configuração incompleta: NEXT_PUBLIC_SIGNAL_URL aponta para ws:// a partir de uma página https. O servidor de sinalização precisa de wss://.",
    closed: "Ligação fechada.",
    connect: "Não foi possível contactar o servidor de emparelhamento.",
  },

  practise: {
    breadcrumbHome: "Início",
    titleTemplate: "Praticar {lang} com nativos por videochat",
    h1Template: "Praticar {lang} falando com nativos",
    descriptionTemplate:
      "Fala {lang} com falantes nativos que estão a aprender a tua língua. Emparelhamento aleatório, grátis, sem marcar nada. Apenas maiores de 18 anos.",
    intro:
      "O Practice With Natives emparelha-te ao acaso com falantes nativos que estão a aprender a tua língua. Eles praticam contigo, tu praticas com eles, e a conversa dura o que os dois quiserem.",
    ctaTemplate: "Começar a falar {lang}",
    howTitle: "Como funciona",
    howSteps: [
      "Dizes que idioma falas e qual praticas.",
      "Emparelhamos-te com alguém cujo perfil é o teu ao contrário.",
      "Falam. Se não fluir, passas ao seguinte sem dar explicações.",
    ],
    otherLanguages: "Outros idiomas",
    faq: [
      {
        q: "É grátis?",
        a: "Sim. O emparelhamento e as conversas são gratuitos. O Practice With Natives funciona por reciprocidade: ofereces a tua língua a quem a estuda e essa pessoa oferece-te a dela.",
      },
      {
        q: "Preciso de um nível mínimo?",
        a: "Não. Escolhes o teu nível ao começar e o emparelhamento dá prioridade a pessoas de nível parecido, para que a conversa não seja frustrante para nenhum dos dois.",
      },
      {
        q: "É preciso registo?",
        a: "Não precisas de criar conta para começar. Tens de confirmar que tens 18 anos ou mais: o Practice With Natives emparelha desconhecidos por vídeo e é uma plataforma exclusivamente para adultos.",
      },
      {
        q: "Posso escolher com quem falo?",
        a: "Podes filtrar por idioma, por género e pedir prioridade a pessoas de outro país. O filtro de género é respeitado nos dois sentidos e nunca é alargado automaticamente, por mais longa que seja a espera.",
      },
      {
        q: "As conversas são gravadas?",
        a: "Não. O vídeo e o áudio viajam diretamente entre os dois navegadores através de WebRTC; o servidor apenas intermedeia a ligação e nunca vê nem guarda o conteúdo.",
      },
    ],
  },

  country: {
    titleTemplate: "Praticar {lang} com {people}",
    descriptionTemplate:
      "Fala {lang} com {people} que estão a aprender a tua língua. Emparelhamento aleatório e gratuito, sem marcar nada. Apenas maiores de 18 anos.",
    accentTitle: "Como soa",
    scheduleTitle: "Quando coincidem",
    ctaTemplate: "Falar com {people}",
    otherVariants: "Outras variantes",
    allSpeakersTemplate: "Todos os falantes de {lang}",
  },

  purpose: {
    hubTitle: "Para que queres praticar?",
    hubLede: "O objetivo muda a forma como deves usar cada sessão.",
    problemTitle: "O problema real",
    tipsTitle: "Como aproveitar uma sessão",
    languagesTitle: "Escolhe o idioma",
    otherPurposes: "Outros objetivos",
  },
};
