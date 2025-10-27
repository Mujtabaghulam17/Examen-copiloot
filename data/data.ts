export interface Question {
  id: number;
  examen_id: string;
  vraag_nummer: number;
  tekst_naam: string;
  vraag_passage?: string;
  vraag_tekst: string;
  vraag_type: string;
  kern_vaardigheid: string;
  max_score: number;
  correctie_model: string;
  difficulty: 1 | 2 | 3;
  context_id?: number;
  options?: string[];
  correct_option?: string;
}

export interface MasteryScore {
  correct: number;
  total: number;
}

export interface PlannerTask {
    description: string;
    completed: boolean;
    xpAwarded?: boolean;
    infoType?: 'syllabus' | 'components';
}
export interface PlannerWeek {
    week_number: number;
    theme: string;
    tasks: PlannerTask[];
}
export interface StudyPlan {
    weeks: PlannerWeek[];
}

export interface Mistake {
    questionId: number;
    userAnswer: string;
    aiFeedback: string;
    repetitionLevel: number;
    nextReviewDate: string; 
}

export interface ChatMessage {
    role: 'user' | 'model' | 'system';
    text: string;
}

export interface SessionProposal {
    focusSkill: string;
    newQuestionsCount: number;
    introMessage: string;
}

export interface ActiveSession {
    questions: Question[];
    currentIndex: number;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface MasterySessionContent {
  explanation: string;
  guided_example: {
    question: string;
    thinking_process: string;
  };
  practice_questions: {
    question: string;
    options: string[];
    correct_option: string;
    feedback_correct: string;
    feedback_incorrect: string;
  }[];
  final_tip: string;
}

export interface SubjectSpecificData {
    masteryScores: { [key: string]: MasteryScore };
    answeredIds: number[];
    mistakes: Mistake[];
    studyPlan: StudyPlan | null;
    examDate: string;
}

export const FREE_QUESTION_IDS_NL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
export const FREE_QUESTION_IDS_EN = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115];
export const FREE_QUESTION_IDS_NK = [201, 202];
export const FREE_QUESTION_IDS_BIO = [301, 302];
export const FREE_QUESTION_IDS_ECO = [401, 402];

export const dutchExamQuestions: Question[] = [
  // VWO_Nederlands_2023_T1
  {
    id: 1,
    examen_id: 'VWO_Nederlands_2023_T1',
    vraag_nummer: 5,
    tekst_naam: 'De Plicht om te Vergeten',
    vraag_passage: 'De historicus en de journalist delen een fundamenteel doel: het reconstrueren van het verleden. Waar de journalist zich echter richt op de actualiteit en de korte termijn, neemt de historicus de lange lijnen en diepere context in ogenschouw. Beide disciplines vereisen een kritische houding ten opzichte van bronnen, maar de historicus heeft het voordeel van afstand, wat een objectiever oordeel mogelijk maakt.',
    vraag_tekst: 'Welke functie heeft de tweede zin ("Waar de journalist...") ten opzichte van de eerste zin in deze passage?',
    vraag_type: 'Functievraag',
    kern_vaardigheid: 'Argumentatieanalyse',
    max_score: 2,
    correctie_model: 'De tweede zin nuanceert of contrasteert de bewering in de eerste zin door de verschillen tussen de historicus en de journalist te benadrukken. Kernwoorden: contrast, tegenstelling, verschil, nuancering.',
    difficulty: 2,
  },
  {
    id: 2,
    examen_id: 'VWO_Nederlands_2023_T1',
    vraag_nummer: 6,
    tekst_naam: 'De Plicht om te Vergeten',
    vraag_tekst: 'Wat is de hoofdgedachte van de passage in de vorige vraag?',
    vraag_type: 'Hoofdgedachtevraag',
    kern_vaardigheid: 'Argumentatieanalyse',
    max_score: 1,
    correctie_model: 'De kern is dat historici en journalisten overeenkomsten hebben in hun doel, maar verschillen in hun methode en perspectief.',
    difficulty: 1,
    context_id: 1,
  },
   {
    id: 3,
    examen_id: 'VWO_Nederlands_2023_T1',
    vraag_nummer: 10,
    tekst_naam: 'Digitale Dilemma\'s',
    vraag_passage: 'Het "recht om vergeten te worden" is een complex juridisch concept. Enerzijds beschermt het de privacy van individuen door hen in staat te stellen verouderde of irrelevante informatie online te laten verwijderen. Anderzijds kan het botsen met het recht op vrijheid van meningsuiting en de publieke toegang tot informatie.',
    vraag_tekst: 'Welk principe staat op gespannen voet met het "recht om vergeten te worden" volgens de tekst?',
    vraag_type: 'Meerkeuzevraag',
    kern_vaardigheid: 'Argumentatieanalyse',
    max_score: 1,
    correctie_model: 'Het juiste antwoord is "Vrijheid van meningsuiting", omdat de tekst expliciet stelt dat het recht om vergeten te worden kan "botsen met het recht op vrijheid van meningsuiting".',
    difficulty: 1,
    options: [
      'Het recht op privacy',
      'Het auteursrecht',
      'Vrijheid van meningsuiting',
      'Het recht op een eerlijk proces'
    ],
    correct_option: 'Vrijheid van meningsuiting'
  },
  // VWO_Nederlands_2024_T1
  {
    id: 4,
    examen_id: 'VWO_Nederlands_2024_T1',
    vraag_nummer: 1,
    tekst_naam: 'De Ironie van de Vooruitgang',
    vraag_passage: 'De technologische vooruitgang heeft ons leven onmiskenbaar comfortabeler gemaakt. We zijn beter verbonden, gezonder en productiever dan ooit tevoren. Toch knaagt er een gevoel van onbehagen. De constante stroom van informatie leidt tot overprikkeling, en de perfecte levens die op sociale media worden geëtaleerd, creëren een onrealistische standaard. We hebben meer, maar zijn we ook gelukkiger?',
    vraag_tekst: 'Welk woord beschrijft het beste de toon van de auteur ten opzichte van technologische vooruitgang?',
    vraag_type: 'Toonvraag',
    kern_vaardigheid: 'Tekstbegrip',
    max_score: 1,
    correctie_model: 'De toon is kritisch, sceptisch of ambivalent. De auteur erkent de voordelen, maar legt de nadruk op de negatieve keerzijdes.',
    difficulty: 2,
  },
  {
    id: 5,
    examen_id: 'VWO_Nederlands_2024_T1',
    vraag_nummer: 2,
    tekst_naam: 'De Ironie van de Vooruitgang',
    vraag_tekst: 'Wat is de belangrijkste tegenstelling die in deze passage wordt beschreven?',
    vraag_type: 'Analysevraag',
    kern_vaardigheid: 'Argumentatieanalyse',
    max_score: 2,
    correctie_model: 'De tegenstelling tussen materieel comfort/technologische vooruitgang en mentaal welzijn/geluk.',
    difficulty: 2,
    context_id: 4,
  },
  {
    id: 6,
    examen_id: 'VWO_Nederlands_2024_T1',
    vraag_nummer: 3,
    tekst_naam: 'De Ironie van de Vooruitgang',
    vraag_tekst: 'De laatste zin is een retorische vraag. Wat is het doel van deze vraag?',
    vraag_type: 'Functievraag',
    kern_vaardigheid: 'Stijl en Retorica',
    max_score: 1,
    correctie_model: 'Het doel is om de lezer aan het denken te zetten en de hoofdgedachte van de tekst te benadrukken: dat materiële vooruitgang niet automatisch leidt tot meer geluk.',
    difficulty: 3,
    context_id: 4
  },
  // VWO_Nederlands_2022_T2
  {
    id: 7,
    examen_id: 'VWO_Nederlands_2022_T2',
    vraag_nummer: 12,
    tekst_naam: 'De Robot als Collega',
    vraag_passage: '(1) De introductie van AI op de werkvloer leidt onvermijdelijk tot banenverlies. (2) Echter, dit is een kortzichtige visie. (3) Nieuwe technologie creëert historisch gezien altijd nieuwe soorten banen die we ons nu nog niet kunnen voorstellen. (4) De focus moet dus niet liggen op het tegenhouden van technologie, maar op het omscholen van de beroepsbevolking.',
    vraag_tekst: 'Welk argument wordt in zin (3) gebruikt om de stelling in zin (2) te onderbouwen?',
    vraag_type: 'Argumentatievraag',
    kern_vaardigheid: 'Argumentatieanalyse',
    max_score: 2,
    correctie_model: 'Een argument op basis van een historische vergelijking of analogie.',
    difficulty: 3,
  },
  {
    id: 8,
    examen_id: 'VWO_Nederlands_2022_T2',
    vraag_nummer: 13,
    tekst_naam: 'De Robot als Collega',
    vraag_tekst: 'Citeer de zinsnede uit de passage die de conclusie van de auteur bevat.',
    vraag_type: 'Citeervraag',
    kern_vaardigheid: 'Argumentatieanalyse',
    max_score: 1,
    correctie_model: '"De focus moet dus niet liggen op het tegenhouden van technologie, maar op het omscholen van de beroepsbevolking."',
    difficulty: 1,
    context_id: 7,
  },
  // VWO_Nederlands_2021_T1
  {
    id: 9,
    examen_id: 'VWO_Nederlands_2021_T1',
    vraag_nummer: 8,
    tekst_naam: 'Taal en Denken',
    vraag_passage: 'De Sapir-Whorfhypothese stelt dat de taal die we spreken onze manier van denken en waarnemen beïnvloedt. Een extreme interpretatie hiervan, het linguïstisch determinisme, claimt dat taal ons denken volledig bepaalt. De meeste moderne linguïsten hangen echter een gematigdere versie aan: linguïstische relativiteit, die stelt dat taal ons denken weliswaar stuurt en vormt, maar niet volledig vastlegt.',
    vraag_tekst: 'Leg in eigen woorden het verschil uit tussen linguïstisch determinisme en linguïstische relativiteit.',
    vraag_type: 'Uitlegvraag',
    kern_vaardigheid: 'Argumentatieanalyse',
    max_score: 3,
    correctie_model: 'Determinisme stelt dat taal het denken 100% bepaalt (je kunt niet denken wat je taal niet kan uitdrukken). Relativiteit stelt dat taal het denken beïnvloedt en makkelijker maakt om over bepaalde dingen te denken, maar het niet onmogelijk maakt om buiten de taal te denken.',
    difficulty: 3,
  },
  {
    id: 10,
    examen_id: 'VWO_Nederlands_2023_T2',
    vraag_nummer: 4,
    tekst_naam: 'De kracht van verveling',
    vraag_passage: 'Verveling wordt vaak gezien als een negatieve toestand, een leegte die we zo snel mogelijk moeten vullen met afleiding. Toch pleiten sommige psychologen voor een herwaardering. Zij stellen dat juist in momenten van verveling de creativiteit wordt aangewakkerd en de geest ruimte krijgt om nieuwe verbindingen te leggen. Het is de ongestructureerde tijd die ons brein nodig heeft om tot diepere inzichten te komen.',
    vraag_tekst: 'Welke van de onderstaande beweringen geeft de mening van de "sommige psychologen" het beste weer?',
    vraag_type: 'Meerkeuzevraag',
    kern_vaardigheid: 'Tekstbegrip',
    max_score: 1,
    correctie_model: 'Het juiste antwoord is "Verveling kan een positief effect hebben op de creativiteit", omdat dit direct aansluit bij de stelling dat verveling creativiteit aanwakkert.',
    difficulty: 1,
    options: [
        'Verveling is een leegte die altijd gevuld moet worden.',
        'Verveling is een symptoom van een gebrek aan discipline.',
        'Verveling kan een positief effect hebben op de creativiteit.',
        'Verveling is schadelijk voor de mentale gezondheid.'
    ],
    correct_option: 'Verveling kan een positief effect hebben op de creativiteit.'
  },
  {
    id: 11,
    examen_id: 'VWO_Nederlands_2023_T2',
    vraag_nummer: 5,
    tekst_naam: 'De kracht van verveling',
    vraag_tekst: 'Wat is de functie van de laatste zin van de passage ("Het is de ongestructureerde tijd...")?',
    vraag_type: 'Functievraag',
    kern_vaardigheid: 'Argumentatieanalyse',
    max_score: 2,
    correctie_model: 'De zin geeft een verklaring voor of een toelichting op de bewering in de voorgaande zin (dat verveling de creativiteit aanwakkert).',
    difficulty: 2,
    context_id: 10
  },
  {
    id: 12,
    examen_id: 'VWO_Nederlands_2022_T1',
    vraag_nummer: 1,
    tekst_naam: 'Het filterbubbel-effect',
    vraag_passage: 'Algoritmes van sociale media zijn ontworpen om ons te geven wat we willen. Ze leren van onze clicks en likes, en serveren ons vervolgens content die naadloos aansluit bij onze bestaande overtuigingen. Hoewel dit comfortabel is, creëert het een gevaarlijke "filterbubbel": een persoonlijk informatie-universum waarin we nauwelijks nog worden blootgesteld aan afwijkende meningen. Dit kan leiden tot polarisatie en een verminderd begrip voor anderen.',
    vraag_tekst: 'Welk woord beschrijft het beste de houding van de auteur ten opzichte van de filterbubbel?',
    vraag_type: 'Toonvraag',
    kern_vaardigheid: 'Tekstbegrip',
    max_score: 1,
    correctie_model: 'De houding is waarschuwend of kritisch. De auteur benadrukt de gevaren ("gevaarlijke", "polarisatie").',
    difficulty: 2
  },
  {
    id: 13,
    examen_id: 'VWO_Nederlands_2022_T1',
    vraag_nummer: 2,
    tekst_naam: 'Het filterbubbel-effect',
    vraag_tekst: 'Leg uit waarom de auteur het comfort van algoritmes paradoxaal noemt in de context van de hele passage.',
    vraag_type: 'Uitlegvraag',
    kern_vaardigheid: 'Argumentatieanalyse',
    max_score: 2,
    correctie_model: 'Het is paradoxaal omdat het comfort op de korte termijn (alleen zien wat je leuk vindt) leidt tot een gevaar op de lange termijn (polarisatie, onbegrip). Het positieve gevoel heeft dus een negatieve keerzijde.',
    difficulty: 3,
    context_id: 12
  },
  {
    id: 14,
    examen_id: 'VWO_Nederlands_2021_T2',
    vraag_nummer: 15,
    tekst_naam: 'De waarde van literatuur',
    vraag_passage: 'In een tijdperk van snelle informatie en korte aandachtsspannes lijkt het lezen van complexe literatuur een anachronisme. Waarom zou je je door een dichtbundel worstelen als je ook een samenvatting kunt kijken? Toch is het juist deze inspanning die literatuur waardevol maakt. Het dwingt tot vertraging, tot zorgvuldig interpreteren en tot het verplaatsen in een ander perspectief. Deze vaardigheden zijn in onze huidige maatschappij crucialer dan ooit.',
    vraag_tekst: 'Welk argument gebruikt de auteur om de waarde van literatuur te verdedigen?',
    vraag_type: 'Argumentatievraag',
    kern_vaardigheid: 'Argumentatieanalyse',
    max_score: 2,
    correctie_model: 'Het argument is dat de inspanning die literatuur vereist, essentiële vaardigheden traint (zoals vertragen, interpreteren, perspectief nemen) die zeer relevant zijn in de moderne tijd.',
    difficulty: 2
  },
  {
    id: 15,
    examen_id: 'VWO_Nederlands_2021_T2',
    vraag_nummer: 16,
    tekst_naam: 'De waarde van literatuur',
    vraag_tekst: 'Citeer de zinsnede die de tegenstelling beschrijft waarmee de auteur de passage opent.',
    vraag_type: 'Citeervraag',
    kern_vaardigheid: 'Tekstbegrip',
    max_score: 1,
    correctie_model: '"complexe literatuur een anachronisme" versus "snelle informatie en korte aandachtsspannes". (Een van beide of de combinatie is goed).',
    difficulty: 1,
    context_id: 14
  }
];

export const englishExamQuestions: Question[] = [
  {
    id: 101,
    examen_id: 'VWO_English_2023_T1',
    vraag_nummer: 1,
    tekst_naam: 'The Gig Economy',
    vraag_passage: 'The rise of the gig economy, facilitated by digital platforms, has been lauded by some as the future of work, offering flexibility and autonomy. Critics, however, point to the precarious nature of such employment, highlighting the lack of benefits, job security, and consistent income that traditional jobs provide. The debate essentially revolves around whether this model empowers or exploits its workforce.',
    vraag_tekst: 'What is the main function of the second sentence ("Critics, however...")?',
    vraag_type: 'Function Question',
    kern_vaardigheid: 'Argument Analysis',
    max_score: 2,
    correctie_model: 'To present a contrasting view or counterargument to the positive perspective mentioned in the first sentence.',
    difficulty: 2,
  },
  {
    id: 102,
    examen_id: 'VWO_English_2023_T1',
    vraag_nummer: 2,
    tekst_naam: 'The Gig Economy',
    vraag_tekst: 'Which of the following best summarizes the central issue discussed in the passage?',
    vraag_type: 'Multiple Choice',
    kern_vaardigheid: 'Text Comprehension',
    max_score: 1,
    correctie_model: 'The correct answer is "The controversy over whether the gig economy is beneficial or detrimental to workers," as it captures the two opposing viewpoints.',
    difficulty: 1,
    context_id: 101,
    options: [
        'The technological innovation of digital platforms.',
        'The difference between flexibility and autonomy.',
        'The controversy over whether the gig economy is beneficial or detrimental to workers.',
        'The decline of traditional employment models.'
    ],
    correct_option: 'The controversy over whether the gig economy is beneficial or detrimental to workers.'
  },
  {
    id: 103,
    examen_id: 'VWO_English_2024_T1',
    vraag_nummer: 5,
    tekst_naam: 'On Reading',
    vraag_passage: 'In an age of information overload, the act of deep reading – the slow, immersive journey through a complex text – has become an act of rebellion. It requires a level of sustained focus that our digitally conditioned minds are increasingly losing. This is not merely a nostalgic plea for the past; it is a serious concern about the potential erosion of critical thinking and empathy, skills that are cultivated in the quiet space between the reader and the page.',
    vraag_tekst: 'What is the author’s tone regarding the decline of deep reading?',
    vraag_type: 'Tone Question',
    kern_vaardigheid: 'Text Comprehension',
    max_score: 1,
    correctie_model: 'The tone is concerned or alarmed. Words like "rebellion", "losing", "serious concern", and "erosion" indicate a negative and worried perspective.',
    difficulty: 2
  },
  {
    id: 104,
    examen_id: 'VWO_English_2024_T1',
    vraag_nummer: 6,
    tekst_naam: 'On Reading',
    vraag_tekst: 'According to the author, what two key skills are threatened by the loss of deep reading?',
    vraag_type: 'Analysis Question',
    kern_vaardigheid: 'Argument Analysis',
    max_score: 2,
    correctie_model: 'The two skills are critical thinking and empathy.',
    difficulty: 1,
    context_id: 103
  },
  {
    id: 105,
    examen_id: 'VWO_English_2022_T2',
    vraag_nummer: 10,
    tekst_naam: 'Urban Green Spaces',
    vraag_passage: 'The integration of green spaces into urban environments is often framed purely in aesthetic terms – parks make cities look nicer. This perspective, however, overlooks their vital ecological and psychological functions. They mitigate the urban heat island effect, improve air quality, and provide crucial habitats for wildlife. Furthermore, studies consistently show that access to nature reduces stress and improves mental well-being for city dwellers.',
    vraag_tekst: 'What is the primary purpose of this passage?',
    vraag_type: 'Purpose Question',
    kern_vaardigheid: 'Argument Analysis',
    max_score: 2,
    correctie_model: 'To argue that the benefits of urban green spaces extend far beyond simple aesthetics, encompassing important ecological and psychological advantages.',
    difficulty: 3
  },
  {
    id: 106,
    examen_id: 'VWO_English_2022_T2',
    vraag_nummer: 11,
    tekst_naam: 'Urban Green Spaces',
    vraag_tekst: 'Cite the phrase that describes the limited, common view of urban green spaces that the author wishes to correct.',
    vraag_type: 'Citation Question',
    kern_vaardigheid: 'Text Comprehension',
    max_score: 1,
    correctie_model: '"framed purely in aesthetic terms".',
    difficulty: 1,
    context_id: 105
  },
  {
    id: 107,
    examen_id: 'VWO_English_2021_T1',
    vraag_nummer: 15,
    tekst_naam: 'The Paradox of Choice',
    vraag_passage: 'Modern consumer society operates on the assumption that more choice is always better. From breakfast cereals to streaming services, we are inundated with options. Yet, psychologist Barry Schwartz argues this abundance can be debilitating. Confronted with too many choices, people can experience "analysis paralysis," becoming so overwhelmed that they fail to make any decision at all. Even when they do choose, they are often less satisfied, haunted by the possibility that a different choice might have been better.',
    vraag_tekst: 'Explain in your own words what "analysis paralysis" is.',
    vraag_type: 'Explanation Question',
    kern_vaardigheid: 'Text Comprehension',
    max_score: 2,
    correctie_model: 'It is the state of being unable to make a decision because there are too many options to choose from.',
    difficulty: 2
  },
  {
    id: 108,
    examen_id: 'VWO_English_2021_T1',
    vraag_nummer: 16,
    tekst_naam: 'The Paradox of Choice',
    vraag_tekst: 'What is the paradox mentioned in the title?',
    vraag_type: 'Analysis Question',
    kern_vaardigheid: 'Argument Analysis',
    max_score: 2,
    correctie_model: 'The paradox is that while we believe more choice is good, it can actually lead to negative outcomes like indecision and dissatisfaction.',
    difficulty: 3,
    context_id: 107
  },
  {
    id: 109,
    examen_id: 'VWO_English_2023_T2',
    vraag_nummer: 4,
    tekst_naam: 'Fact vs. Opinion',
    vraag_passage: 'The line between fact and opinion has become dangerously blurred in the digital age. A fact is a statement that can be verified as true or false through objective evidence. An opinion, conversely, is a personal belief or judgment that cannot be proven or disproven. The failure to distinguish between the two is a cornerstone of misinformation, allowing unsubstantiated claims to be presented with the same authority as established facts.',
    vraag_tekst: 'What is the key difference between a fact and an opinion, according to the text?',
    vraag_type: 'Explanation Question',
    kern_vaardigheid: 'Argument Analysis',
    max_score: 2,
    correctie_model: 'A fact can be objectively verified (proven true or false), whereas an opinion is a personal belief and cannot be proven.',
    difficulty: 1
  },
  {
    id: 110,
    examen_id: 'VWO_English_2023_T2',
    vraag_nummer: 5,
    tekst_naam: 'Fact vs. Opinion',
    vraag_tekst: 'Which word could best replace "conversely" in the second sentence?',
    vraag_type: 'Multiple Choice',
    kern_vaardigheid: 'Vocabulary',
    max_score: 1,
    correctie_model: 'The correct answer is "on the other hand," as it signals a contrast between the definition of a fact and the definition of an opinion.',
    difficulty: 2,
    context_id: 109,
    options: [
        'Similarly',
        'Therefore',
        'On the other hand',
        'For example'
    ],
    correct_option: 'On the other hand'
  },
  {
    id: 111,
    examen_id: 'VWO_English_2020_T1',
    vraag_nummer: 12,
    tekst_naam: 'The Impostor Syndrome',
    vraag_passage: 'Impostor syndrome is a psychological pattern in which an individual doubts their skills, talents, or accomplishments and has a persistent internalized fear of being exposed as a "fraud". Despite external evidence of their competence, those experiencing impostor syndrome remain convinced that they are undeserving of all they have achieved. They often attribute their successes to luck or to deceiving others into thinking they are more intelligent than they perceive themselves to be.',
    vraag_tekst: 'What is the core belief of someone experiencing impostor syndrome?',
    vraag_type: 'Comprehension Question',
    kern_vaardigheid: 'Text Comprehension',
    max_score: 1,
    correctie_model: 'They believe they are a fraud and do not deserve their success or accomplishments.',
    difficulty: 2
  },
  {
    id: 112,
    examen_id: 'VWO_English_2020_T1',
    vraag_nummer: 13,
    tekst_naam: 'The Impostor Syndrome',
    vraag_tekst: 'How do people with impostor syndrome explain their successes, according to the text?',
    vraag_type: 'Analysis Question',
    kern_vaardigheid: 'Text Comprehension',
    max_score: 2,
    correctie_model: 'They attribute them to external factors like luck or to their ability to deceive others.',
    difficulty: 2,
    context_id: 111
  },
  {
    id: 113,
    examen_id: 'VWO_English_2019_T2',
    vraag_nummer: 8,
    tekst_naam: 'Confirmation Bias',
    vraag_passage: '(1) Confirmation bias is the tendency to search for, interpret, favour, and recall information in a way that confirms or supports one\'s pre-existing beliefs or hypotheses. (2) It is a type of cognitive bias and a systematic error of inductive reasoning. (3) For example, a person who believes that left-handed people are more creative may pay special attention to creative left-handed individuals while ignoring the vast number of non-creative left-handers. (4) This mental shortcut is powerful and can lead to holding onto false beliefs firmly.',
    vraag_tekst: 'What function does sentence (3) have in the paragraph?',
    vraag_type: 'Function Question',
    kern_vaardigheid: 'Argument Analysis',
    max_score: 1,
    correctie_model: 'It provides a specific example to illustrate the concept of confirmation bias defined in the previous sentences.',
    difficulty: 1
  },
  {
    id: 114,
    examen_id: 'VWO_English_2019_T2',
    vraag_nummer: 9,
    tekst_naam: 'Confirmation Bias',
    vraag_tekst: 'Based on the passage, what is a negative consequence of confirmation bias?',
    vraag_type: 'Comprehension Question',
    kern_vaardigheid: 'Argument Analysis',
    max_score: 1,
    correctie_model: 'It can lead to holding onto false beliefs.',
    difficulty: 2,
    context_id: 113
  },
  {
    id: 115,
    examen_id: 'VWO_English_2018_T1',
    vraag_nummer: 2,
    tekst_naam: 'The Art of Persuasion',
    vraag_passage: 'Aristotle outlined three primary modes of persuasion over two thousand years ago: ethos, pathos, and logos. Ethos appeals to authority and credibility; we trust experts. Pathos appeals to emotion, seeking to evoke a feeling in the audience. Logos appeals to logic and reason, using facts and figures to construct a sound argument. A truly persuasive message, Aristotle argued, must skillfully weave all three together.',
    vraag_tekst: 'Which mode of persuasion would a scientific paper primarily rely on?',
    vraag_type: 'Application Question',
    kern_vaardigheid: 'Argument Analysis',
    max_score: 1,
    correctie_model: 'Logos, because a scientific paper is based on logic, reason, facts, and figures.',
    difficulty: 2
  }
];

export const natuurkundeExamQuestions: Question[] = [
  {
    id: 201,
    examen_id: 'VWO_Natuurkunde_Voorbeeld_1',
    vraag_nummer: 1,
    tekst_naam: 'Mechanica',
    vraag_passage: 'Een bal met een massa van 0.5 kg wordt vanaf de grond recht omhoog geschoten met een beginsnelheid van 20 m/s. De luchtweerstand wordt verwaarloosd. (g = 9.81 m/s²)',
    vraag_tekst: 'Bereken de maximale hoogte die de bal bereikt.',
    vraag_type: 'Berekeningsvraag',
    kern_vaardigheid: 'Energie en Beweging',
    max_score: 3,
    correctie_model: 'Gebruik de wet van behoud van energie: E_kinetisch = E_potentieel. 0.5 * m * v² = m * g * h. h = v² / (2 * g) = 20² / (2 * 9.81) = 20.4 meter.',
    difficulty: 2,
  },
   {
    id: 202,
    examen_id: 'VWO_Natuurkunde_Voorbeeld_1',
    vraag_nummer: 2,
    tekst_naam: 'Elektriciteit',
    vraag_tekst: 'Drie weerstanden (R1=10Ω, R2=20Ω, R3=30Ω) zijn in serie geschakeld op een spanningsbron van 12V. Wat is de totale stroomsterkte in de schakeling?',
    vraag_type: 'Berekeningsvraag',
    kern_vaardigheid: 'Schakelingen',
    max_score: 3,
    correctie_model: 'Eerst de totale weerstand (Rv) berekenen: Rv = R1 + R2 + R3 = 10 + 20 + 30 = 60Ω. Dan de stroom (I) met de wet van Ohm: I = U / Rv = 12V / 60Ω = 0.2A.',
    difficulty: 1,
  },
];
export const biologieExamQuestions: Question[] = [
  {
    id: 301,
    examen_id: 'VWO_Biologie_Voorbeeld_1',
    vraag_nummer: 1,
    tekst_naam: 'Ecologie',
    vraag_tekst: 'Leg uit wat het verschil is tussen een ecosysteem en een populatie.',
    vraag_type: 'Uitlegvraag',
    kern_vaardigheid: 'Ecologie',
    max_score: 2,
    correctie_model: 'Een populatie is een groep organismen van dezelfde soort in een bepaald gebied. Een ecosysteem omvat alle levende (biotische) en niet-levende (abiotische) factoren in een gebied, inclusief meerdere populaties.',
    difficulty: 1,
  },
  {
    id: 302,
    examen_id: 'VWO_Biologie_Voorbeeld_1',
    vraag_nummer: 2,
    tekst_naam: 'Genetica',
    vraag_tekst: 'Wat is de functie van mRNA tijdens de eiwitsynthese?',
    vraag_type: 'Kennisvraag',
    kern_vaardigheid: 'Moleculaire Biologie',
    max_score: 2,
    correctie_model: 'mRNA (messenger RNA) fungeert als een boodschapper die de genetische code van het DNA in de celkern overbrengt naar de ribosomen in het cytoplasma, waar de code wordt vertaald naar een eiwit.',
    difficulty: 2,
  },
];
export const economieExamQuestions: Question[] = [
  {
    id: 401,
    examen_id: 'VWO_Economie_Voorbeeld_1',
    vraag_nummer: 1,
    tekst_naam: 'Vraag en Aanbod',
    vraag_tekst: 'Een stijging van de prijs van koffiebonen leidt tot een hogere prijs voor een kop koffie in een café. Welk effect heeft dit op de vraag- en aanbodcurve voor koffie?',
    vraag_type: 'Analysevraag',
    kern_vaardigheid: 'Marktanalyse',
    max_score: 2,
    correctie_model: 'De aanbodcurve verschuift naar links (of omhoog), omdat de productiekosten zijn gestegen. Bij elke prijs wordt er minder aangeboden. De vraagcurve verandert niet direct door de productiekosten.',
    difficulty: 2,
  },
   {
    id: 402,
    examen_id: 'VWO_Economie_Voorbeeld_1',
    vraag_nummer: 2,
    tekst_naam: 'Ruil',
    vraag_tekst: 'Leg het concept van comparatief voordeel uit.',
    vraag_type: 'Uitlegvraag',
    kern_vaardigheid: 'Internationale Handel',
    max_score: 2,
    correctie_model: 'Een land heeft een comparatief voordeel in de productie van een goed als het dat goed kan produceren tegen lagere alternatieve kosten (opportunity costs) dan een ander land. Dit is de basis voor wederzijds voordelige handel.',
    difficulty: 3,
  },
];