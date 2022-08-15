import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import { AuthContext } from '@/context/AuthContext'

import RaadpleegObjectDetailMain from './RaadpleegObjectDetailMain'

describe('RaadpleegObjectDetailMain', () => {
    const defaultProps = {
        dataLoaded: true,
        dataObject: {
            ID: 370,
            UUID: '01341cc1-5803-4aa8-a8c0-5927b0eccee8',
            Begin_Geldigheid: '2021-08-07T00:00:00Z',
            Eind_Geldigheid: '9999-12-31T23:59:59Z',
            Created_By: {
                UUID: '01341cc1-5803-4aa8-a8c0-5927b0eccee8',
                Gebruikersnaam: 'John Doe',
                Rol: 'Beheerder',
                Status: 'Actief',
            },
            Created_Date: '2020-10-26T07:17:19.793000Z',
            Modified_By: {
                UUID: '01341cc1-5803-4aa8-a8c0-5927b0eccee8',
                Gebruikersnaam: 'Erik Verhaar',
                Rol: 'Beheerder',
                Status: 'Actief',
            },
            Modified_Date: '2021-08-09T07:32:29.417000Z',
            Titel: '1. Samen werken aan Zuid-Holland',
            Omschrijving:
                'De provincie vervult diverse rollen en taken als bestuurslaag midden tussen Europa, Rijk en gemeenten. De provincie is de bestuurslaag bij uitstek om bovenregionale vraagstukken op te pakken. Bijvoorbeeld op het gebied van milieu, recreatie en vervoer en voor alles wat de verbinding brengt tussen dorp en stad. De provincie is ook bij uitstek in staat om afstemming en verbinding tussen gemeenten te stimuleren. De provincie heeft vanuit haar bovenregionale rol overzicht op maatschappelijke vraagstukken en de onderlinge verbanden, trends en best practices.\r\n\r\nDe opgaven waar het openbaar bestuur voor gesteld staat, zijn de afgelopen jaren onmiskenbaar complexer geworden. Vooral de transitieopgaven (bijv. sociaal domein, energietransitie, landbouw en klimaatadaptatie) vragen om meer integraliteit en samenwerking tussen overheden en met de samenleving. Er wordt om oplossingen gevraagd, terwijl tegelijkertijd het probleem zich nog ontvouwt. Achteraf kunnen we pas vaststellen wat heeft gewerkt. Met de decentralisatie van taken (decentralisaties sociaal domein, straks Omgevingswet) zijn opgaven en bevoegdheden bovendien naar het lokale niveau gebracht. De (financiële) verantwoordelijkheid van gemeenten is hierdoor fors toegenomen. Dit vraagt ook op lokaal niveau om meer kennis, expertise, betrokkenheid van de samenleving en een solide financiële huishouding om een bijdrage te kunnen leveren aan de maatschappelijke opgaven. Zonder een goed functionerende democratie en bestuur en sterke gemeenten die hun taken goed kunnen uitvoeren gaat het niet lukken om de grote maatschappelijke opgaven aan te pakken.\r\n\r\nDe provincie investeert in het behoud en de verbetering van de kwaliteit van het openbaar bestuur en de democratie. Voor een goed werkende democratie zijn lokale en regionale media belangrijk. Zuid-Holland streeft ernaar dat het vertrouwen van inwoners in het openbaar bestuur groeit of op zijn minst gelijk blijft. Een goed openbaar bestuur begint bij de bestuursorganen zelf. Zuid-Holland staat voor effectief eigen bestuur,\r\nwaarbij effectieve samenwerking op alle niveaus (met collega-overheden, maatschappelijke organisaties, kennisinstellingen, inwoners, PS-GS, regionaal, landelijk en Europees) het uitgangspunt is. Het is een kwestie van samen vormgeven aan de identiteit van Zuid-Holland: veelzijdig, inclusief en vernieuwend. De provincie vindt het belangrijk om sneller tot uitvoering en resultaat te komen. De opgaven zijn vaak complex. Daarom\r\nbetrekt Zuid-Holland inwoners, organisaties en bedrijfsleven vroegtijdig bij besluitvorming. De provincie stelt zich open en met vertrouwen op voor initiatieven vanuit de samenleving en maakt ruimte voor verschil, experimenten en maatwerk. Participatie verschilt per onderwerp en rol die de provincie heeft. Zuid-Holland is constructief, maar ook duidelijk als iets niet kan. De volksvertegenwoordiging blijft het laatste woord houden. ',
            Weblink: 'http://idms/otcs/llisapi.dll/open/PZH-2021-771175798',
            Ref_Beleidskeuzes: [
                {
                    ID: 718,
                    UUID: '01341cc1-5803-4aa8-a8c0-5927b0eccee8',
                    Titel: 'Adequaat aanbod openbaar vervoer (In Inspraak Test)',
                },
            ],
        },
        titleSingular: 'Ambitie',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: { UUID: '0001' } } as any}>
                    <RaadpleegObjectDetailMain {...props} />
                </AuthContext.Provider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(defaultProps.dataObject.Titel)
        expect(element).toBeTruthy()
    })
})
