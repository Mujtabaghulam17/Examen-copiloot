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
    },
    Geschiedenis: {
        syllabus: {
            title: 'Syllabus Geschiedenis VWO',
            content: `
### Historische Contexten
- **De Republiek:** De Opstand en de Gouden Eeuw (1515-1648).
- **Verlichtingsideeën en de Democratische Revoluties:** (1650-1848).
- **Duitsland in Europa:** (1918-1991).
- **De Koude Oorlog:** (1945-1991).

### Kenmerkende Aspecten
- De tien tijdvakken met hun kenmerkende aspecten vormen de basis van het examen.
- Vaardigheden in het verbinden van gebeurtenissen aan deze aspecten worden getoetst.
`
        },
        components: {
            title: 'Examenonderdelen Geschiedenis VWO',
            content: `
Het Centraal Examen Geschiedenis VWO bestaat uit open vragen, vaak gebaseerd op historische bronnen.

### Vraagtypen
- **Bronanalyse:** Vragen over de betrouwbaarheid, representativiteit en het doel van een historische bron.
- **Kennisvragen:** Het reproduceren van kennis over historische gebeurtenissen en personen.
- **Contextvragen:** Het plaatsen van een gebeurtenis of bron in de juiste historische context.

*Let op: Het examen vereist zowel feitenkennis als het vermogen om historisch te redeneren en bronnen kritisch te analyseren.*
`
        }
    },
    Scheikunde: {
        syllabus: {
            title: 'Syllabus Scheikunde VWO',
            content: `
### Hoofddomeinen
- **Materie:** Atoombouw, bindingen, molecuulstructuren, stofeigenschappen.
- **Reacties:** Reactiesnelheid, chemisch evenwicht, redoxchemie, zuren en basen.
- **Industriële processen:** Blokschema's, duurzaamheid en groene chemie.
- **Koolstofchemie:** Systematische naamgeving, reactietypes en polymeren.
`
        },
        components: {
            title: 'Examenonderdelen Scheikunde VWO',
            content: `
Het Centraal Examen Scheikunde VWO bestaat uit open vragen.

### Vraagtypen
- **Rekenopgaven:** O.a. molrekenen, pH-berekeningen en evenwichtsvoorwaarden.
- **Reactievergelijkingen:** Het opstellen en afmaken van reactievergelijkingen.
- **Uitlegvragen:** Het verklaren van waarnemingen op moleculair niveau (microniveau).

*Let op: Net als bij Natuurkunde is het correct gebruiken van Binas en het uitvoeren van berekeningen met de juiste significantie van groot belang.*
`
        }
    },
    Bedrijfseconomie: {
        syllabus: {
            title: 'Syllabus Bedrijfseconomie VWO',
            content: `
### Hoofddomeinen
- **Financiële zelfredzaamheid:** Persoonlijke financiële planning.
- **Onderneming en Organisatie:** Rechtsvormen, marketing, strategie.
- **Financiering:** Vermogensbehoefte, eigen en vreemd vermogen, financiële markten.
- **Verslaggeving:** De balans, resultatenrekening, analyse van financiële overzichten.
`
        },
        components: {
            title: 'Examenonderdelen Bedrijfseconomie VWO',
            content: `
Het Centraal Examen Bedrijfseconomie VWO bevat contextrijke opgaven, vaak met uitgebreide bronnen.

### Vraagtypen
- **Berekeningen:** O.a. kostprijsberekeningen, balans- en resultatenrekening opstellen.
- **Analyse:** Het interpreteren van financiële gegevens en kengetallen.
- **Redeneervragen:** Het onderbouwen van een bedrijfsmatige beslissing.

*Let op: Het examen test je vermogen om bedrijfseconomische problemen in een realistische context op te lossen. Zorgvuldigheid en een gestructureerde aanpak zijn essentieel.*
`
        }
    },
    'Wiskunde A': {
        syllabus: {
            title: 'Syllabus Wiskunde A VWO',
            content: `
### Hoofddomeinen
- **Algebra en verbanden:** Formules, functies, grafieken en vergelijkingen.
- **Statistiek en kansrekening:** Data analyseren,än statistische methoden,änänänänänänänänänänänänänänänänänänänänän kansmodellen enänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänänän t oetsen.
- **Rijen en praktische rekenkunde:** Rekenkundige en meetkundige rijen, financiële berekeningen.
`
        },
        components: {
            title: 'Examenonderdelen Wiskunde A VWO',
            content: `
Het Centraal Examen Wiskunde A VWO bestaat uit open vragen in contextrijke opgaven.

### Vraagtypen
- **Modelering:** Het opstellen van een wiskundig model (formule) voor een gegeven situatie.
- **Berekeningen:** Algebraïsche en statistische berekeningen.
- **Redeneren:** Het wiskundig onderbouwen van een conclusie.

*Let op: De nadruk ligt op de toepassing van wiskunde in realistische contexten. Het gebruik van de grafische rekenmachine is essentieel.*
`
        }
    },
    'Wiskunde B': {
        syllabus: {
            title: 'Syllabus Wiskunde B VWO',
            content: `
### Hoofddomeinen
- **Algebra en getallen:** Vaardigheden met algebra, machten, logaritmen.
- **Analyse:** Differentiëren, integreren, functies en grafieken.
- **Meetkunde:** Goniometrie, analytische meetkunde, vectoren.
`
        },
        components: {
            title: 'Examenonderdelen Wiskunde B VWO',
            content: `
Het Centraal Examen Wiskunde B VWO richt zich op abstracte wiskunde en exacte berekeningen.

### Vraagtypen
- **Exacte berekeningen:** Algebraïsche oplossingen zonder rekenmachine.
- **Bewijsvragen:** Het leveren van een formeel wiskundig bewijs.
- **Analyse en meetkunde:** Het toepassen van calculus en meetkundige principes.

*Let op: De nadruk ligt op abstract redeneren en algebraïsche vaardigheden. Veel opgaven moeten exact worden opgelost.*
`
        }
    },
    Frans: {
        syllabus: {
            title: 'Syllabus Frans VWO',
            content: `
### Domein A: Leesvaardigheid
- **Tekstbegrip:** Begrijpen van de hoofdgedachte en details van authentieke Franse teksten (C1-niveau).
- **Tekstsoorten:** Om kunnen gaan met diverse tekstsoorten zoals nieuwsartikelen, recensies en opiniestukken.
- **Woordenschat en idioom:** Beschikken over een brede woordenschat.
`
        },
        components: {
            title: 'Examenonderdelen Frans VWO',
            content: `
Het Centraal Examen Frans VWO is, net als Engels, volledig gericht op leesvaardigheid.

### Teksten met vragen
- **Weging:** 100% van de totale score.
- **Inhoud:** Een examenboekje met diverse Franstalige teksten.
- **Vraagtypen:** Grotendeels meerkeuzevragen, gericht op tekstbegrip, woordenschat en analyse van de tekststructuur.

*Let op: Een goede woordenschat en het vermogen om de structuur van een Franse tekst te doorgronden zijn cruciaal.*
`
        }
    },
    Duits: {
        syllabus: {
            title: 'Syllabus Duits VWO',
            content: `
### Domein A: Leesvaardigheid
- **Tekstbegrip:** Begrijpen van de hoofdgedachte en details van authentieke Duitse teksten (C1-niveau).
- **Tekstsoorten:** Om kunnen gaan met diverse tekstsoorten zoals nieuwsartikelen, recensies en opiniestukken.
- **Woordenschat en grammatica:** Beschikken over een brede woordenschat en grammaticale kennis.
`
        },
        components: {
            title: 'Examenonderdelen Duits VWO',
            content: `
Het Centraal Examen Duits VWO is, net als Engels en Frans, volledig gericht op leesvaardigheid.

### Teksten met vragen
- **Weging:** 100% van de totale score.
- **Inhoud:** Een examenboekje met diverse Duitstalige teksten.
- **Vraagtypen:** Grotendeels meerkeuzevragen, gericht op tekstbegrip, woordenschat en het herkennen van grammaticale verbanden.

*Let op: Kennis van signaalwoorden en grammaticale structuren helpt enorm bij het ontleden van complexe Duitse zinnen.*
`
        }
    }
};
