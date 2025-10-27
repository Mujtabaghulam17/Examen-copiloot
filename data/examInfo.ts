interface InfoContent {
    title: string;
    content: string;
}

interface ExamInfo {
    [subject: string]: {
        syllabus: InfoContent;
        components: InfoContent;
    };
}

export const examInfo: ExamInfo = {
    Nederlands: {
        syllabus: {
            title: 'Syllabus Nederlands VWO',
            content: `
### Domein A: Leesvaardigheid
- Analyseren en interpreteren van diverse tekstsoorten (o.a. betogende, beschouwende en uiteenzettende teksten).
- Herkennen van tekststructuren, hoofdgedachten en functies van tekstgedeelten.
- Beoordelen van de betrouwbaarheid en representativiteit van informatie.

### Domein B: Argumentatieve vaardigheden
- Herkennen en analyseren van argumentatieschema's en redeneringen.
- Beoordelen van de aanvaardbaarheid van argumentatie.
- Herkennen en benoemen van drogredenen.

### Domein C: Mondelinge taalvaardigheid
- (Niet getoetst in het Centraal Examen, wel in het schoolexamen)

### Domein D: Schrijfvaardigheid
- (Niet getoetst in het Centraal Examen, wel in het schoolexamen)
`
        },
        components: {
            title: 'Examenonderdelen Nederlands VWO',
            content: `
Het Centraal Examen Nederlands VWO bestaat doorgaans uit:

### 1. Teksten met open vragen
- **Weging:** Ongeveer 70-80% van de totale score.
- **Inhoud:** Je krijgt 3 tot 4 teksten van uiteenlopende aard (bijv. krantenartikelen, essays, wetenschappelijke stukken).
- **Vragen:** De vragen toetsen je lees- en argumentatievaardigheid. Dit omvat vragen over de hoofdgedachte, de functie van alinea's, het herkennen van argumentatie en het kritisch beoordelen van de tekst.

### 2. Samenvattingsopdracht (indien van toepassing)
- **Weging:** Ongeveer 20-30% van de totale score.
- **Inhoud:** Je wordt gevraagd een van de examenteksten samen te vatten volgens specifieke instructies en binnen een strikt woordlimiet.
- **Vaardigheden:** Toetst het vermogen om hoofdzaken van bijzaken te onderscheiden en informatie correct en beknopt weer te geven.

*Let op: De exacte vorm en weging kunnen per jaar licht verschillen. Raadpleeg altijd de meest recente informatie van het College voor Toetsen en Examens (CvTE).*
`
        }
    },
    Engels: {
        syllabus: {
            title: 'Syllabus Engels VWO',
            content: `
### Domein A: Leesvaardigheid
- **Tekstbegrip:** Begrijpen van de hoofdgedachte en details van authentieke Engelse teksten.
- **Tekstsoorten:** Om kunnen gaan met diverse tekstsoorten zoals nieuwsartikelen, recensies, opiniestukken en literaire fragmenten.
- **Woordenschat:** Beschikken over een brede woordenschat om teksten op C1-niveau te kunnen begrijpen.
- **Analyse:** Herkennen van de toon, het doel en de structuur van een tekst.

### Overige domeinen
- Mondelinge taalvaardigheid, schrijfvaardigheid en kennis van land en letterkunde worden voornamelijk in het schoolexamen getoetst.
`
        },
        components: {
            title: 'Examenonderdelen Engels VWO',
            content: `
Het Centraal Examen Engels VWO is volledig gericht op leesvaardigheid.

### Teksten met vragen
- **Weging:** 100% van de totale score.
- **Inhoud:** Je krijgt een examenboekje met ongeveer 10-12 verschillende teksten. Deze teksten variëren in lengte en onderwerp.
- **Vraagtypen:** De vragen zijn grotendeels meerkeuzevragen, met af en toe een open vraag. Ze toetsen verschillende aspecten van leesvaardigheid:
    - Begrip van de hoofdgedachte.
    - Specifieke informatie vinden.
    - De betekenis van woorden uit de context afleiden.
    - De functie van zinnen of alinea's bepalen.
    - De toon of mening van de schrijver herkennen.

*Let op: De focus ligt op het efficiënt en accuraat verwerken van een grote hoeveelheid tekstuele informatie. Er is geen samenvattingsopdracht zoals bij Nederlands.*
`
        }
    },
    Natuurkunde: {
        syllabus: {
            title: 'Syllabus Natuurkunde VWO',
            content: `
### Hoofddomeinen
- **Mechanica:** Kinematica, dynamica, arbeid en energie, trillingen en golven.
- **Elektriciteit en Magnetisme:** Elektrische circuits, velden, inductie.
- **Thermodynamica:** Warmte, temperatuur, gassen en de hoofdwetten.
- **Golven en Straling:** Elektromagnetisch spectrum, optica, kwantumfysica.
- **Medische Beeldvorming:** Toepassingen van natuurkundige principes in de medische wereld.
`
        },
        components: {
            title: 'Examenonderdelen Natuurkunde VWO',
            content: `
Het Centraal Examen Natuurkunde VWO bestaat uit open vragen, vaak onderverdeeld in deelvragen.

### Vraagtypen
- **Rekenopgaven:** Het toepassen van formules (Binas!) om een eindantwoord te berekenen. Correcte eenheden zijn cruciaal.
- **Uitlegvragen:** Het verklaren van een verschijnsel aan de hand van natuurkundige principes.
- **Redeneervragen:** Het logisch afleiden van een conclusie op basis van gegeven informatie.

*Let op: Het examen toetst zowel rekenvaardigheid als conceptueel begrip. Het correct gebruiken van Binas is een essentiële vaardigheid.*
`
        }
    },
    Biologie: {
        syllabus: {
            title: 'Syllabus Biologie VWO',
            content: `
### Hoofddomeinen
- **Celbiologie:** Celstructuur, stofwisseling (fotosynthese, dissimilatie), enzymen.
- **Genetica en Evolutie:** DNA, eiwitsynthese, erfelijkheidswetten, evolutietheorie.
- **Zelfregulatie:** Hormoonstelsel, zenuwstelsel, afweersysteem.
- **Zelforganisatie:** Ecosystemen, populatiedynamiek, kringlopen, biodiversiteit.
`
        },
        components: {
            title: 'Examenonderdelen Biologie VWO',
            content: `
Het Centraal Examen Biologie VWO bestaat uit een mix van vraagtypen, vaak in de context van een casus of bron (tekst, afbeelding, grafiek).

### Vraagtypen
- **Kennisvragen:** Directe reproductie van biologische feiten en concepten.
- **Inzichtvragen:** Het leggen van verbanden tussen verschillende concepten.
- **Contextopgaven:** Het toepassen van biologische kennis op een nieuwe, onbekende situatie die in een bron wordt beschreven.

*Let op: Het kunnen analyseren van bronnen (Binas, teksten, etc.) en het verbinden van informatie uit die bronnen met je parate kennis is de sleutel tot succes.*
`
        }
    },
    Economie: {
        syllabus: {
            title: 'Syllabus Economie VWO',
            content: `
### Hoofddomeinen
- **Schaarste, Ruil en Handel:** Kern van economie, alternatieve kosten, specialisatie.
- **Markten:** Vraag en aanbod, elasticiteit, marktvormen en marktfalen.
- **Ruil over de Tijd:** Sparen, lenen, investeren.
- **Samenwerken en Onderhandelen:** Speltheorie, contracten.
- **Risico en Informatie:** Verzekeren, risico, asymmetrische informatie.
- **Welvaart en Groei:** BBP, conjunctuur, economische groei.
`
        },
        components: {
            title: 'Examenonderdelen Economie VWO',
            content: `
Het Centraal Examen Economie VWO bevat contextrijke opgaven, vaak gebaseerd op actuele economische situaties.

### Vraagtypen
- **Berekeningsvragen:** Bijvoorbeeld het berekenen van elasticiteiten, marktevenwicht, of winst.
- **Redeneervragen:** Het economisch verklaren van een verschijnsel of het doorredeneren van de gevolgen van een beleidswijziging.
- **Tekenopgaven:** Het tekenen of aanpassen van grafieken (bijv. vraag- en aanbodlijnen).

*Let op: Het examen legt een sterke nadruk op het toepassen van economische concepten en modellen op realistische scenario's. Het kunnen onderbouwen van je antwoord met economische aannames is essentieel.*
`
        }
    }
};
