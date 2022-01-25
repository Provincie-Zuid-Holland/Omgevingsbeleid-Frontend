import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route } from 'react-router-dom'

import RelatiesKoppelingenVisualisatie from './RelatiesKoppelingenVisualisatie'

describe('RelatiesKoppelingenVisualisatie', () => {
    const defaultProps = {
        beleidsObject: {
            ID: 947,
            UUID: '463679D5-5257-4979-870F-8B5DDADC6CC1',
            Begin_Geldigheid: '2021-01-05T00:00:00Z',
            Eind_Geldigheid: '9999-12-31T23:00:00Z',
            Created_By: {
                UUID: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                Gebruikersnaam: 'Aiden Buis',
                Rol: 'Beheerder',
                Status: 'Actief',
            },
            Created_Date: '2021-02-16T13:19:35.170000Z',
            Modified_By: {
                UUID: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                Gebruikersnaam: 'Aiden Buis',
                Rol: 'Beheerder',
                Status: 'Actief',
            },
            Modified_Date: '2021-07-26T09:41:44.897000Z',
            Eigenaar_1: {
                UUID: 'C770B13D-025E-49EB-BF83-DEF1E2557B35',
                Gebruikersnaam: 'Alrik Kalsbeek',
                Rol: 'Behandelend Ambtenaar',
                Status: 'Actief',
            },
            Eigenaar_2: {
                UUID: 'E8BBC4F7-83CA-4DC0-90FB-17134713A18F',
                Gebruikersnaam: 'Alex de Roos',
                Rol: 'Behandelend Ambtenaar',
                Status: 'Actief',
            },
            Portefeuillehouder_1: {
                UUID: '8DD9BDB0-C2B7-40D3-825D-E78236606D58',
                Gebruikersnaam: 'Adri Bom-Lemstra',
                Rol: 'Portefeuillehouder',
                Status: 'Actief',
            },
            Portefeuillehouder_2: {
                UUID: '073D77C1-5A3F-45A3-83A0-D7E691FCEB82',
                Gebruikersnaam: 'Anne Koning',
                Rol: 'Portefeuillehouder',
                Status: 'Actief',
            },
            Opdrachtgever: {
                UUID: '27138AF8-C277-415B-82C8-E5E21E80A580',
                Gebruikersnaam: 'Albert Koffeman',
                Rol: 'Ambtelijk opdrachtgever',
                Status: 'Actief',
            },
            Status: 'Ontwerp GS',
            Titel: '#1 Revisieoverzicht (Bewerkt, nogmaals)',
            Omschrijving_Keuze:
                '<p>Adipiscing sociis facilisis iaculis nam leo interdum quis cubilia condimentum purus pulvinar, cursus habitant litora duis porta mus ultricies imperdiet sit. Felis iaculis suspendisse eget lacinia convallis neque vestibulum. Deze zin is op 30 juni toegevoegd.</p>',
            Omschrijving_Werking:
                '<p>Adipiscing sociis facilisis iaculis nam leo interdum quis cubilia condimentum purus pulvinar, cursus habitant litora duis porta mus ultricies imperdiet sit. Felis iaculis suspendisse eget lacinia convallis neque vestibulum fames ornare est lobortis, eleifend quisque consectetur netus justo luctus inceptos dictumst quis. Fames ornare est lobortis, eleifend quisque consectetur netus justo luctus inceptos dictumst quis. Adipiscing sociis facilisis iaculis nam leo interdum quis cubilia condimentum purus pulvinar, cursus habitant litora duis porta mus ultricies imperdiet sit. Felis iaculis suspendisse eget lacinia convallis neque vestibulum.</p>',
            Aanleiding:
                '<p>Adipiscing sociis facilisis iaculis nam leo interdum quis cubilia condimentum purus pulvinar, cursus habitant litora duis porta mus ultricies imperdiet sit. Felis iaculis suspendisse eget lacinia convallis neque vestibulum fames ornare est lobortis, eleifend quisque consectetur netus justo luctus inceptos dictumst quis. Fames ornare.</p>',
            Afweging: null,
            Provinciaal_Belang:
                '<p>Adipiscing sociis facilisis iaculis nam leo interdum quis cubilia condimentum purus pulvinar, cursus habitant litora duis porta mus ultricies imperdiet sit. Felis iaculis suspendisse eget lacinia convallis neque vestibulum fames ornare est lobortis, eleifend quisque consectetur netus justo luctus inceptos dictumst quis.</p><p><br></p><p>Adipiscing sociis facilisis iaculis nam leo interdum quis cubilia condimentum purus pulvinar, cursus habitant litora duis porta mus ultricies imperdiet sit.</p>',
            Weblink: 'https://www.nu.nl',
            Besluitnummer: '123456',
            Tags: null,
            Aanpassing_Op: null,
            Ambities: [
                {
                    Koppeling_Omschrijving: '123',
                    Object: {
                        ID: 370,
                        UUID: 'A21AB134-2C79-4786-A517-8FCBBB7B775A',
                        Begin_Geldigheid: '2020-10-07T00:00:00Z',
                        Eind_Geldigheid: '9999-12-31T23:00:00Z',
                        Created_By: '9D4F11BE-A502-4DCE-A6FA-24FB827FD6B7',
                        Created_Date: '2020-10-26T07:17:19.793000Z',
                        Modified_By: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                        Modified_Date: '2021-05-25T14:05:12.783000Z',
                        Titel: '1. Samen werken aan Zuid-Holland Bewerkt',
                        Omschrijving: 'Omschrijving',
                        Weblink: null,
                    },
                },
                {
                    Koppeling_Omschrijving: '',
                    Object: {
                        ID: 513,
                        UUID: '43D84451-F2F2-4D70-9DED-95D83022117C',
                        Begin_Geldigheid: '2021-02-03T00:00:00Z',
                        Eind_Geldigheid: '2021-08-03T00:00:00Z',
                        Created_By: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                        Created_Date: '2021-02-03T14:02:18.363000Z',
                        Modified_By: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                        Modified_Date: '2021-02-03T14:02:18.363000Z',
                        Titel: 'Test ambitie woensdag 3 februari 2021',
                        Omschrijving: 'Omschrijving',
                        Weblink: 'Weblink',
                    },
                },
            ],
            Belangen: [
                {
                    Koppeling_Omschrijving: 'Belang',
                    Object: {
                        ID: 139,
                        UUID: 'DBCD1E8D-3F87-48F3-845B-1F44A89EE5EE',
                        Begin_Geldigheid: '2021-02-03T00:00:00Z',
                        Eind_Geldigheid: '2021-08-03T00:00:00Z',
                        Created_By: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                        Created_Date: '2021-02-03T14:02:31.140000Z',
                        Modified_By: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                        Modified_Date: '2021-02-03T14:02:31.140000Z',
                        Titel: 'Test ambitie woensdag 3 februari 2021',
                        Omschrijving: 'Omschrijving',
                        Weblink: 'Weblink',
                        Type: 'Nationaal Belang',
                    },
                },
            ],
            Beleidsdoelen: [
                {
                    Koppeling_Omschrijving: '',
                    Object: {
                        ID: 528,
                        UUID: '15426333-BC9E-4D5C-BA41-9E019EC52039',
                        Begin_Geldigheid: '2021-02-03T00:00:00Z',
                        Eind_Geldigheid: '2021-08-03T00:00:00Z',
                        Created_By: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                        Created_Date: '2021-02-03T14:02:05.520000Z',
                        Modified_By: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                        Modified_Date: '2021-02-03T14:02:05.520000Z',
                        Titel: 'Test beleidsdoel woensdag 3 februari 2021',
                        Omschrijving: 'Omschrijving',
                        Weblink: 'Weblink',
                    },
                },
            ],
            Beleidsprestaties: [
                {
                    Koppeling_Omschrijving: '',
                    Object: {
                        ID: 974,
                        UUID: 'E4E0B703-9B28-463D-8BC3-9E9DF5C39DAC',
                        Begin_Geldigheid: '2021-02-03T00:00:00Z',
                        Eind_Geldigheid: '2021-08-03T00:00:00Z',
                        Created_By: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                        Created_Date: '2021-02-03T14:02:56.360000Z',
                        Modified_By: '359A9254-598E-4BFE-BCEC-AA521E95881A',
                        Modified_Date: '2021-02-03T14:02:56.360000Z',
                        Titel: 'Test beleidsregel woensdag 3 februari 2021',
                        Omschrijving: 'Omschrijving',
                        Weblink: 'Weblink',
                    },
                },
            ],
            Beleidsregels: [
                {
                    Koppeling_Omschrijving: '',
                    Object: {
                        ID: 1485,
                        UUID: '6BAD9E81-4688-4E20-BA77-043E5019F356',
                        Begin_Geldigheid: '2018-09-04T00:00:00Z',
                        Eind_Geldigheid: '2068-09-04T00:00:00Z',
                        Created_By: 'BDAF9E43-6026-4FE3-8D4E-BB5DDEC728E6',
                        Created_Date: '2020-03-10T14:32:19.747000Z',
                        Modified_By: 'BDAF9E43-6026-4FE3-8D4E-BB5DDEC728E6',
                        Modified_Date: '2020-03-10T14:32:19.747000Z',
                        Titel: 'Uitvoeringsregeling vaarwegprofielen Zuid-Holland 2015',
                        Omschrijving: null,
                        Weblink: 'weergeven/11821949021848468',
                        Externe_URL: null,
                    },
                },
            ],
            Maatregelen: [],
            Themas: [],
            Verordeningen: [
                {
                    Koppeling_Omschrijving: '',
                    Object: {
                        ID: 114,
                        UUID: '4EB04BEE-57EB-40F0-BDC5-7BDCA11EAC97',
                        Begin_Geldigheid: '2019-03-29T00:00:00Z',
                        Eind_Geldigheid: '2999-12-31T23:59:59Z',
                        Created_By: '1EFF5CDF-3B34-4C34-B3B7-DCF83961D9E6',
                        Created_Date: '2020-03-23T00:00:00Z',
                        Modified_By: '1EFF5CDF-3B34-4C34-B3B7-DCF83961D9E6',
                        Modified_Date: '2020-03-22T00:00:00Z',
                        Eigenaar_1: '669EDE3C-20BB-47ED-9E6D-7556B15532B6',
                        Eigenaar_2: '669EDE3C-20BB-47ED-9E6D-7556B15532B6',
                        Portefeuillehouder_1: null,
                        Portefeuillehouder_2: null,
                        Opdrachtgever: '675144F8-56ED-48DD-AB26-A43DC3FBF52C',
                        Titel: 'Bodemsanering',
                        Inhoud: '',
                        Weblink: null,
                        Status: 'Vigerend',
                        Volgnummer: '3.6',
                        Type: 'Afdeling',
                        Gebied: null,
                    },
                },
            ],
            Werkingsgebieden: [],
            Ref_Beleidsmodules: [],
        },
        connectionProperties: [
            'Ambities',
            'Belangen',
            'Beleidsregels',
            'Beleidsprestaties',
            'Maatregelen',
            'Beleidsdoelen',
            'Themas',
            'Verordeningen',
        ],
        connectionPropertiesColors: {
            MainObject: {
                hex: '#553c9a',
            },
            Ambities: {
                hex: '#AA0067',
            },
            Belangen: {
                hex: '#D11F3D',
            },
            Beleidsregels: {
                hex: '#7BADDE',
            },
            Beleidsprestaties: {
                hex: '#76BC21',
            },
            Maatregelen: {
                hex: '#00804D',
            },
            Beleidsdoelen: {
                hex: '#FF6B02',
            },
            Themas: {
                hex: '#847062',
            },
            Verordeningen: {
                hex: '#281F6B',
            },
            Beleidskeuzes: {
                hex: '#EFCC36',
            },
        },
        beleidsRelaties: [],
        titleSingular: 'Beleidskeuze',
        titleSingularPrefix: 'de',
    }

    const setup = (customProps?: any) => {
        const path = `/detail/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`
        const initialEntries = `/detail/beleidskeuzes/89154DA3-2E98-4685-AA9D-A3FB8B9BB596`

        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter initialEntries={[initialEntries]}>
                <Route path={path}>
                    <RelatiesKoppelingenVisualisatie {...props} />
                </Route>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Netwerkvisualisatie')
        expect(element).toBeTruthy()
    })
})
