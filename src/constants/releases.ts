const releases = [
    {
        title: 'Versie 2.0',
        date: 'Donderdag 24 augustus 2023',
        description:
            'Een grote aanpassing op versie 1.0! Normaal verwacht je een versie 1.1 en 1.2, etc. maar omdat we aan de structuur van de data en techniek zo’n grote aanpassing hebben gedaan, zijn we direct naar een versie 2.0 gegaan.',
        items: {
            Ontwikkelingen: [
                {
                    item: 'Modulair Werken is gerealiseerd.',
                    children: [
                        {
                            item: 'Alle wijzigingen aan het beleid gaan nu via modules, een groep onderdelen die tegelijkertijd de besluitvorming doorgaat.',
                        },
                        {
                            item: 'Deze functionaliteit is als voorbereiding om de (officiële) publicaties een stuk soepeler te laten verlopen.',
                        },
                    ],
                },
                {
                    item: 'De layout van de muteeromgeving (waar medewerkers in werken) is volledig aangepakt en voorbereid op groei.',
                },
                {
                    item: 'Zoeken geeft relevantere resultaten terug.',
                },
                {
                    item: 'Mogelijk gemaakt om aan het Omgevingsprogramma “Thematische programma’s” en “Gebiedsprogramma’s” toe te voegen',
                },
                {
                    item: 'Als er meer dan 20 resultaten terugkomen, wordt er gebruik gemaakt van paginering. Hierdoor laadt de pagina een stuk sneller!',
                },
            ],
        },
    },
    {
        title: 'Versie 1.0',
        date: 'Dinsdag 7 juni 2022',
        description:
            'Eerste volwaardige versie van het Digitaal Omgevingsbeleid van Zuid-Holland.',
        items: {
            Ontwikkelingen: [
                'De website voorzien van een nieuwe look zodat het er overzichtelijker uitziet en duidelijker wordt hoe de website in elkaar zit.',
                'Mogelijk gemaakt om ook ontwerp-beleid in te zien.',
                'Tijdlijn met informatie over de releases toegevoegd.',
                'Pagina met alle recente wijzigingen in beleid en informatie over het besluitvormingsproces toegevoegd.',
                'Mogelijkheid toegevoegd om uitgebreid te zoeken op de kaart, onder andere via het selecteren van een werkingsgebied.',
                'Een navigatiemenu “op deze pagina” toegevoegd bij beleid zodat eenvoudiger wordt om naar een ‘hoofdstuk’ te navigeren.',
                'Beleidsrelaties toegevoegd aan het beleidsnetwerk.',
                'Webpagina voor foutmeldingen toegevoegd.',
                'Toegankelijkheidsverklaring toegevoegd.',
                'Verlopen beleid wordt niet meer getoond in de muteeromgeving.',
                'Pop-up melding bij het eerste keer openen van de website verwijderd.',
            ],
            Bugfixes: [
                'Beleidsrelaties worden niet meer automatisch verwijderd wanneer een van de gekoppelde beleidsobjecten wijzigt.',
                'Limiet op het aantal resultaten bij het zoeken op de kaart verwijderd.',
                'Foute datum van inwerkingtreding wordt niet meer getoond bij het vergelijken van een beleidskeuze.',
                'Ervoor gezorgd dat vigerend beleid vindbaar blijft, ook wanneer er een nieuwe versie in de toekomst in werking treedt.',
                'Leden van de verordening verwijderd uit het beleidsnetwerk.',
                'De omschrijving van maatregelen wordt getoond bij de zoekresultaten.',
            ],
        },
    },
    {
        title: 'Versie 0.6',
        date: 'Dinsdag 8 maart 2022',
        description: 'Release om beleid beter vindbaar te maken.',
        items: {
            Ontwikkelingen: [
                'Mogelijk gemaakt om ook te zoeken op basis van tekst i.p.v. enkel op titels van beleid',
                'Pagination toegevoegd aan de zoekresultaten. Er worden maximaal 20 resultaten getoond, vervolgens is het mogelijk om meer resultaten te laden',
                'Mogelijk gemaakt om beleid op te zoeken in het beleidsnetwerk',
            ],
            Bugfixes: [
                'Vervallen beleid is niet meer zichtbaar in de muteeromgeving',
                'Vervallen beleid is niet meer te koppelen aan vigerend beleid',
                'Fix in de teller van het aantal keren dat beleid is gewijzigd',
            ],
        },
    },
    {
        title: 'Versie 0.5.2',
        date: 'Maandag 1 november 2021',
        description: 'Update voor het vernieuwen van de achtergrondkaart.',
        items: {
            Ontwikkelingen: [],
            Bugfixes: [
                'Achtergrondkaart PDOK zou verlopen; deze service is vernieuwd',
            ],
        },
    },
    {
        title: 'Versie 0.5.1',
        date: 'Maandag 27 september 2021',
        description:
            'Kleine release met de focus op het oplossen van twee bugs.',
        items: {
            Ontwikkelingen: [],
            Bugfixes: [
                'Beleid niet vindbaar via het zoeken op de kaart opgelost',
                'Vervallen beleid niet meer zichtbaar in het beleidsnetwerk',
            ],
        },
    },
    {
        title: 'Versie 0.5',
        date: 'Woensdag 22 september 2021',
        description:
            'In deze release werden het beleidsnetwerk, het revisie-overzicht en beleidsmodules voor het eerst geïntroduceerd.',
        items: {
            Ontwikkelingen: [
                'Beleidsnetwerk voor het complete omgevingsbeleid toegevoegd',
                'Mogelijk gemaakt om de koppelingen bij beleidsobjecten te zien',
                'Revisie-overzicht en het kunnen vergelijken van meerdere versies van één beleidsobject toegevoegd',
                'Eerste versie van beleidsmodules toegevoegd',
                'Mogelijk gemaakt om afbeeldingen toe te voegen aan beleidskeuzes',
                'Nieuwe huisstijl van de provincie doorgevoerd',
                'Veld gemaakt voor het toevoegen van een URL aan een beleidsregel',
            ],
            Bugfixes: [
                'Volgorde van de teksten van beleidskeuzes gewijzigd',
                'Laadtijd verbeterd door het optimaler zoeken van beleid',
                'Zoeken op de titel van beleid gerepareerd',
                'Probleem met het wijzigen van de achtergrond naar de satelliet-weergave opgelost',
                'Niet meer mogelijk om meerdere keren hetzelfde beleid te koppelen,',
            ],
        },
    },
    {
        title: 'Versie 0.4',
        date: 'Dinsdag 2 maart 2021',
        description:
            'Focus op gelijktrekken van de data met de beleidskeuzes en maatregelen en het besluitvormingsproces.',
        items: {
            Ontwikkelingen: [
                'Mogelijk gemaakt om bepaalde velden aan te passen zonder het besluitvormingsproces te hoeven doorlopen',
                'Feedback knop toegevoegd',
                'Beleidsdoelen en -prestaties toegevoegd',
                'Wijzigingen in beleidsrelaties worden direct doorgevoerd en tonen altijd de laatste versie',
                'Mogelijk gemaakt om afbeeldingen toe te voegen aan maatregelen',
                'Veld "Toelichting" aangepast naar "Omschrijving"',
            ],
            Bugfixes: [
                'Dubbele teksten bij vigerende beleidskeuzes verwijderd',
                'Fout bij het invullen van de datum bij beleidsrelaties opgelost',
                'Foutmelding bij het aanklikken van vigerende beleidskeuzes via de muteeromgeving opgelost',
            ],
        },
    },
]

export { releases }
