const releases = [
    {
        title: 'Versie 0.6',

        date: 'Dinsdag 8 maart 2022',

        description: 'Release om beleid beter vindbaar te maken.',

        items: {
            Ontwikkelingen: [
                'Mogelijk gemaakt om ook te zoeken op basis van tekst i.p.v. enkel op titels van beleid',

                'Pagination toegevoegd aan de zoekresultaten. Er worden maximaal 20 resultaten getoond, vervolgens is het mogelijk om meer resultaten te laden',

                'Mogelijk gemaakt om beleid op te zoeken in de netwerkvisualisatie',
            ],

            Bugfixes: [
                'Vervallen beleid is niet meer zichtbaar in de muteeromgeving',

                'Vervallen beleid is niet meer te koppelen aan vigerend beleid',

                'Fix in de teller van het aantal keren dat beleid is gewijzigd',
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

    {
        title: 'Versie 0.5',

        date: 'Woensdag 22 september 2021',

        description:
            'In deze release werden de netwerkvisualisatie, het revisie-overzicht en beleidsmodules voor het eerst geïntroduceerd.',

        items: {
            Ontwikkelingen: [
                'Netwerkvisualisatie voor het complete omgevingsbeleid toegevoegd',

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

                'Probleem met het wijzigden van de achtergrond naar de satelliet-weergave opgelost',

                'Niet meer mogelijk om meerdere keren hetzelfde beleid te koppelen,',
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

                'Vervallen beleid niet meer zichtbaar in de netwerkvisualisatie',
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
]

export { releases }
