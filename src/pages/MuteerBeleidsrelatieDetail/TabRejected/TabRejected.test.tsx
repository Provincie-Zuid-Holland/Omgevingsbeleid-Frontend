import { render, screen, fireEvent } from '@testing-library/react'

import TabRejected from './TabRejected'

import { MemoryRouter } from 'react-router-dom'

describe('TabRejected', () => {
    const toggleMotivationPopup = jest.fn()

    const defaultProps = {
        loaded: true,
        rejected: [
            {
                UUID: 'AFDE147B-7421-4156-9FD9-B8AA47D3678C',
                Titel: 'Test title',
                Datum_Akkoord: '2021-05-25T14:42:56.113000Z',
                Modified_Date: '2021-05-25T14:42:56.113000Z',
                Status: 'NietAkkoord',
                Van_Beleidskeuze: {
                    ID: 740,
                    UUID: '13204976-84AC-4CB1-952F-3D4D2D8E6C97',
                    Begin_Geldigheid: '2020-11-13T00:00:00Z',
                    Eind_Geldigheid: '2023-12-31T00:00:00Z',
                    Created_By: '9D4F11BE-A502-4DCE-A6FA-24FB827FD6B7',
                    Created_Date: '2020-09-25T15:17:33.677000Z',
                    Modified_By: '57A461EE-3922-4171-8506-A73F2BB6638F',
                    Modified_Date: '2020-11-13T10:19:13.380000Z',
                    Eigenaar_1: '57A461EE-3922-4171-8506-A73F2BB6638F',
                    Eigenaar_2: null,
                    Portefeuillehouder_1:
                        'ED0C9205-A06A-413E-A376-AFF786DE25DC',
                    Portefeuillehouder_2: null,
                    Opdrachtgever: 'C1F2D842-1618-4D8E-8765-20C427686AA1',
                    Status: 'Ontwerp GS Concept',
                    Titel: 'Human Capital, een beroepsbevolking met de juiste vaardigheden en kennis',
                    Omschrijving_Keuze:
                        '1.\tWat wil de provincie bereiken?  \nDe aanwezigheid van voldoende Human Capital, zowel in kwantitatieve als in kwalitatieve zin, is een belangrijke randvoorwaarde voor een goed functionerende regionale economie. Een adaptief, adequaat en goed opgeleid arbeidspotentieel, goed onderwijs om nieuwe instroom te realiseren en om bestaande werknemers bij en om te scholen alsmede een goed werkende arbeidsmarkt zijn daarmee essentieel voor een slimmer, schoner, sterker Zuid-Holland.\nDaarnaast is er een persoonlijk belang voor de mensen die het \u2018menselijk kapitaal\u2019 vormen. Werk is tenslotte meer dan inkomen. Het vervult een belangrijke sociale en maatschappelijk functie en voorziet in de mogelijkheid om je te kunnen ontplooien, deel te kunnen nemen en bij te kunnen dragen aan de maatschappij. \n2.\tEn hoe gaan we dat bereiken?\nDoor het door samen met de EBZ ge\u00efnitieerde Human Capital akkoord uit te voeren, waarin kwantitatieve doelstellingen benoemd zijn nodig om tot die gewenste situatie te komen. Een akkoord dat inmiddels door meer dan 100 partijen in Zuid-Holland is onderschreven en daarnaast door te investeren in een programmateam en te zorgen voor cofinanciering van concrete projecten.\n',
                    Omschrijving_Werking:
                        'Willen beleidskeuzes gerealiseerd kunnen worden, is daar in alle gevallen kwantitatief en kwalitatief geschikt personeel voor nodig. Dat geldt voor vrijwel alle beleidskeuzes, maar zeker voor de economische beleidskeuzes als het stimuleren van innovatie, de transities van de Greenports en het Havencomplex en de transitities naar een digitaal en circulair Zuid-Holland.',
                    Aanleiding:
                        '1.\tWelk probleem/dreiging of welke kans ligt ten grondslag aan deze beleidskeuze?  \nIn het vooraf uitgevoerde onderzoek naar de Arbeidsmarkt Zuid-Holland worden vier belangrijke knelpunten benoemd:\n1.\tZuid-Holland kampt met de grootste arbeidstekorten van Nederland: 1 op de 5 bedrijven kan onvoldoende gekwalificeerd personeel krijgen en dreigt daarmee economisch gezien niet te kunnen groeien;\n2.\tDe arbeidsmarkt in Zuid-Holland is versnipperd en werknemers stappen niet snel over naar andere sectoren en regio\u2019s. De veerkracht van de arbeidsmarkt neemt daarmee af doordat transities van werk naar werk onvoldoende plaatsvinden;\n3.\tZuid-Holland scoort slecht op het activeren van onbenut arbeidspotentieel: zowel niet werkende mensen als deeltijdwerkers;\n4.\tEr is gebrek aan organiserend vermogen en uitvoeringskracht op provinciaal niveau. Dit belemmert Zuid-Holland om deze knelpunten aan te pakken\n\n2.\tWelke context heeft de lezer nodig om deze beleidskeuze te begrijpen?  \nBovenstaande punten zijn pre-corona opgesteld, maar gelden daar waar het de structurele problemen betreft nog steeds. De arbeidsmarkttekorten zijn of zullen in sommige sectoren verminderd of zullen verminderen, maar in andere en voor de noodzakelijke en gewenste transities van de Zuid-Hollandse economie gelden ze veelal nog steeds. Bovendien maakt de huidige situatie de noodzaak om de veerkracht te verbeteren, het potentieel te benutten en het organiserend vermogen te verbeteren alleen maar groter. ',
                    Afweging: '',
                    Provinciaal_Belang:
                        'Gezien de economische dynamiek wordt het vermogen om snel in te spelen op de veranderingen die zich voordoen, mede bepalend voor de concurrentiekracht. Dat gold tot voor kort in de situatie waarin veel sectoren met oplopende tekorten werden geconfronteerd en dat geldt de komende periode waarin vanwege de Coronacrisis een aanzienlijk aantal werknemers naar een andere werkomgeving zullen moeten gaan omzien. Dit alles tegen een achtergrond van een economie die transitieopgaven kent richting een duurzame, circulaire en digitale economie. Beide aspecten, baanwisselingen en de opkomst van een nieuwe economie met daarin ook nieuwe sectoren, vragen om een opleidingsstelsel dat in kan spelen op deze trends en ontwikkelen. Er ontstaat immers een vraag naar nieuwe en/ of andere vaardigheden en competenties (21ste century skills) waar scholing (publiek of privaat) een belangrijke rol bij heeft.\nNiet alleen het onderwijs heeft echter een rol. Ook Rijk, gemeenten en het bedrijfsleven hebben verantwoordelijkheden om bij te dragen aan een goed functionerend ecosysteem waarin alle betrokken partijen vanuit hun rol en kracht een bijdrage leveren aan de voorliggende opgave. De provincie is daarbij een schaalgrootte die past om te komen tot een gerichte, geco\u00f6rdineerde en gezamenlijke aanpak.\nMeer dan 100 partijen hebben dit onderkend en hebben onder de regie van de EBZ en de provincie medio 2019 hun handtekening gezet onder het Human Capital akkoord Zuid-Holland. Daarin zijn doelstellingen geformuleerd die nodig zijn om te komen tot die goed opgeleide beroepsbevolking en die veerkrachtige arbeidsmarkt waarin de aanwezige potentie optimaal wordt benut. Zaken die juist ook in veranderende economische tijden van cruciaal belang zijn.',
                    Weblink:
                        'http://idms/otcs/llisapi.dll?func=ll&objId=692108463&objAction=browse&viewType=1 ',
                    Besluitnummer: 'PZH-2019-692108463',
                    Tags: '',
                    Aanpassing_Op: null,
                },
                Naar_Beleidskeuze: {
                    ID: 733,
                    UUID: '051A28CA-A767-4251-8A7B-77E7DE9E3FF6',
                    Begin_Geldigheid: '1753-01-01T00:00:00Z',
                    Eind_Geldigheid: '9999-12-31T23:59:59Z',
                    Created_By: '9D4F11BE-A502-4DCE-A6FA-24FB827FD6B7',
                    Created_Date: '2020-09-25T15:03:46.447000Z',
                    Modified_By: '9D4F11BE-A502-4DCE-A6FA-24FB827FD6B7',
                    Modified_Date: '2020-10-15T12:09:53.730000Z',
                    Eigenaar_1: '94682F9A-3DC7-4940-9544-B0801D923730',
                    Eigenaar_2: '92499C5E-2BF9-4348-AF4F-6DCA948D104A',
                    Portefeuillehouder_1:
                        '8DD9BDB0-C2B7-40D3-825D-E78236606D58',
                    Portefeuillehouder_2: null,
                    Opdrachtgever: 'C1F2D842-1618-4D8E-8765-20C427686AA1',
                    Status: 'Ontwerp GS Concept',
                    Titel: 'Versnelling transitie Greenports',
                    Omschrijving_Keuze:
                        'De provincie Zuid-Holland versnelt de transitie naar toekomstbestendige en duurzame Greenports die op mondiale schaal toonaangevend en innovatief opereren.',
                    Omschrijving_Werking:
                        'De Provincie Zuid-Holland versterkt samen met andere overheden, ondernemers en kennisinstellingen Zuid-Holland als economische topregio. Dit doet zij door de kennisinfrastructuur en innovatiekracht te versterken, groei en vernieuwing van het bedrijfsleven te stimuleren en een transitie vorm te geven naar een duurzame en digitale economie.  \nZuid-Holland kent een diversiteit aan Greenports: de Duin- en Bollenstreek met bollenteelt en sierteelt, het tuinbouwcluster met vruchtgroente, bloemen en potplanten in West-Holland, het sierteeltcluster in de Greenport Aalsmeer en de boomteelt in de regio Boskoop. Deze Greenports vormen een belangrijke motor voor de Zuid-Hollandse en de Nederlandse economie. De combinatie van excellente teelt, de nabijheid van twee Mainports, een effici\u00ebnt logistiek systeem en de inzet op kennis en innovatie maakt dat Zuid-Holland internationaal een toppositie heeft als productie- en handelsgebied voor vers- en sierteeltproducten. \nDe tuinbouw in Zuid-Holland is internationaal leidend voor wat betreft de ontwikkeling van nieuwe groente-, fruit- en plantensoorten en met de effectieve inzet van ruimte, energie en water. De sector is volop in beweging, met de ontwikkeling van nieuwe energiebronnen als aardwarmte, met verticaal telen, sensortechnologie\u00ebn en robotica. Ook streeft men naar het sluiten van kringlopen door middel van biobased toepassingen van groene reststromen en verminderen van het gebruik van kunststoffen. Deze nieuwe ontwikkelingen zorgen ervoor dat de sector zijn concurrentiekracht kan behouden en nieuwe verdienmodellen kan ontwikkelen.\nOm de toppositie te behouden  is nodig dat de Greenports de transitie doormaken naar een duurzame en digitale economie, gericht op kwalitatief beter (duurzaam) productieareaal, schaalvergroting, energietransitie, verbetering van de waterkwaliteit en verduurzaming van de gietwatervoorziening, bovenregionale triple helix samenwerking, ketenintegratie en nieuwe verdienmodellen, zoals de biobased economy. De provincie Zuid-Holland voert meerjarig beleid op de versnelling van deze transitie. Daarbij zet de provincie Zuid-Holland  in op circulariteit in de tuinbouwketen door te experimenteren en stimuleren van het optimaal verwaarden van reststromen en het voorkomen van verspilling en het sluiten van de kunststofketen.  Ook wordt in het meerjarige beleid rekening gehouden met aanpassing aan de gevolgen van klimaatverandering in de vorm van extremer weer, zoals meer en langere droge en hete perioden, intensivering van neerslag en bodemdaling.\nHet garanderen van een duurzame, innovatieve toekomst voor deze belangrijke economische sector van Zuid-Holland vraagt inzet van ondernemers, kennisinstellingen \u00e9n overheden. De provincie pakt haar rol in het versterken van het netwerk en in het zorgdragen voor, ontwikkelen, stimuleren en faciliteren van de transitie. \nHiervoor heeft de provincie een brede opgave ge\u00efdentificeerd met verschillende maatregelen en bijdragen, zowel regulerend via de verordening, als algemeen en gebiedsspecifiek. De Greenports zijn een sector welke gevoelig is voor klimaatverandering.',
                    Aanleiding:
                        'Greenports en tuinbouw zijn al lange tijd onderdeel van provinciaal beleid en provinciale doelstellingen, vanwege het grote belang ervan voor de regionale (en nationale/internationale) economie, de energietransitie, de waterhuishouding, het ruimtegebruik en de logistieke netwerken. \n\nDe provincie heeft vanwege haar positie in het netwerk, haar bevoegdheden en haar instrumentarium een belangrijke regulerende, ontwikkelende, stimulerende en faciliterende rol in het versnellen van de transitie van de Greenports. De Greenports vormen een belangrijk economisch cluster in Zuid-Holland, vanwege het aandeel in de regionale economie, de ruimtelijke impact, het gebruik van fossiele brandstoffen, impact op het watersysteem, de energietransitie en de logistieke netwerken.',
                    Afweging: '',
                    Provinciaal_Belang:
                        'De tuinbouw, de sierteelt en agrologistieke concepten vormen een belangrijk en herkenbaar exportproduct voor Zuid-Holland en voor Nederland. De economische positie hiervan staat in internationaal opzicht onder druk. Een nauwe samenwerking tussen de greenports onderling en met de mainports is nodig en transities moeten gedragen worden door ondernemers, kennisinstellingen en overheden samen. Omdat regionale en bovenregionale afstemming onvoldoende tot stand kwamen, innovaties hierdoor achterbleven en marktimperfecties leidden tot onwenselijk ruimtebeslag heeft de provincie een actieve rol genomen in het versterken van het netwerk en de realisatiekracht op regionaal en op nationaal niveau. Dit doet de provincie onder andere door uitvoering te geven aan de Nationale Tuinbouwagenda 2019-2030, die de provincie samen met ondernemers, kennisinstellingen en mede-overheden heeft ondertekend. Hiermee geeft de provincie een impuls aan transities die nodig zijn om als gezamenlijke Greenports een leidende positie in de wereld te houden. \nDe Greenportgebieden in Zuid-Holland bestrijken ruimtelijk het gebied van meerdere gemeenten. De provincie is verantwoordelijk voor een goede ruimtelijke ordening op regionaal niveau.',
                    Weblink: '',
                    Besluitnummer: '',
                    Tags: '',
                    Aanpassing_Op: null,
                },
            },
        ],
        motivationPopUp: '',
        setMotivationPopUp: toggleMotivationPopup,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <TabRejected {...props} />
            </MemoryRouter>
        )
    }

    it('should render', () => {
        setup()
        const element = screen.getByText('Bekijk motivering')
        expect(element).toBeTruthy
    })

    it('Should display the PopupMotivation component when motivationPopUp contains a value', () => {
        setup({ motivationPopUp: defaultProps.rejected[0].UUID })
        const element = screen.getByText('Deze relatie heeft geen motivering')
        expect(element).toBeTruthy
    })

    it('User should be able to click on the "Bekijk motivering"', () => {
        setup()
        const motivatieBtn = screen.getByText('Bekijk motivering')
        fireEvent.click(motivatieBtn)
        expect(toggleMotivationPopup).toBeCalledTimes(1)
    })

    it('Should display a "Loading..." text when loaded is false', () => {
        setup({ loaded: false })
        const element = screen.getAllByText('Loading...')
        expect(element).toBeTruthy
    })

    it('Should display a default text if there are no beleidsrelaties that are rejected', () => {
        setup({ rejected: [] })
        const element = screen.getByText(
            'Er zijn nog geen afgewezen beleidsrelaties'
        )
        expect(element).toBeTruthy
    })
})
