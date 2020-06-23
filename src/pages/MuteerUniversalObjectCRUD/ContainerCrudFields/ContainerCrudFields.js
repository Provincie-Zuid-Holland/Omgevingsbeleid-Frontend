import React from 'react'

// Import Components
import ContainerMain from './../../../components/ContainerMain'
import ContainerFormSection from './../../../components/ContainerFormSection'
import FormFieldTextInput from './../../../components/FormFieldTextInput'
import FormFieldTextArea from './../../../components/FormFieldTextArea'
import FormFieldWeblink from './../../../components/FormFieldWeblink'
import FormFieldDate from './../../../components/FormFieldDate'
import FormFieldSelect from './../../../components/FormFieldSelect'
import FormFieldSelectBeleidsbeslissing from './../../../components/FormFieldSelectBeleidsbeslissing'
import FormFieldWerkingsgebiedKoppeling from './../../../components/FormFieldWerkingsgebiedKoppeling'
import FormFieldWerkingsgebiedKoppelingSingle from './../../../components/FormFieldWerkingsgebiedKoppelingSingle'
import FormFieldSelectUserGroup from './../../../components/FormFieldSelectUserGroup'
import FormFieldUniverseleRelatieKoppeling from './../../../components/FormFieldUniverseleRelatieKoppeling'

// REFACTOR DEZE FILE
class ContainerCrudFields extends React.Component {
    render() {
        const titelEnkelvoud = this.props.titelEnkelvoud
        const editStatus = this.props.editStatus
        const crudObject = this.props.crudObject
        const handleChange = this.props.handleChange
        const handleSubmit = this.props.handleSubmit
        const voegKoppelingRelatieToe = this.props.voegKoppelingRelatieToe
        const wijzigKoppelingRelatie = this.props.wijzigKoppelingRelatie
        const verwijderKoppelingRelatie = this.props.verwijderKoppelingRelatie

        const verplichtProgrammaValues = [
            ['Ja', 'Ja'],
            ['Nee', 'Nee'],
        ]

        const SpecifiekOfGeneriekValues = [
            ['Gebiedsspecifiek', 'Gebiedsspecifiek'],
            ['Generiek', 'Generiek'],
        ]

        return (
            <ContainerMain>
                <div className="w-full inline-block flex-grow">
                    <div>
                        <form className="mt-12" onSubmit={handleSubmit}>
                            {/* 1. Beleidsbeslissingen sectie */}
                            {titelEnkelvoud === 'Beleidsbeslissing' ? (
                                <React.Fragment>
                                    <ContainerFormSection
                                        titel="Algemene informatie"
                                        beschrijving="De algemene informatie bevat een duidelijke titel en de betrokken personen."
                                    >
                                        {crudObject['Titel'] !== undefined ? (
                                            <FormFieldTextInput
                                                handleChange={handleChange}
                                                fieldValue={crudObject['Titel']}
                                                dataObjectProperty="Titel"
                                                fieldLabel="Titel"
                                                pValue="Formuleer in enkele woorden de titel van de beleidsbeslissing."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {crudObject['Opdrachtgever'] !==
                                            undefined ||
                                        crudObject['Portefeuillehouder_1'] !==
                                            undefined ||
                                        crudObject['Portefeuillehouder_2'] !==
                                            undefined ||
                                        crudObject['Eigenaar_1'] !==
                                            undefined ||
                                        crudObject['Eigenaar_2'] !==
                                            undefined ? (
                                            <React.Fragment>
                                                <FormFieldSelectUserGroup
                                                    handleChange={handleChange}
                                                    crudObject={crudObject}
                                                    marginRight={true}
                                                    fieldLabel="Personen"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    editStatus={editStatus}
                                                />
                                            </React.Fragment>
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Omschrijving beleidsbeslissing"
                                        beschrijving="Een beleidsbeslissing betreft een (politieke) beleidskeuze en heeft rechtsgevolgen voor derden."
                                    >
                                        {crudObject['Omschrijving_Keuze'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject[
                                                        'Omschrijving_Keuze'
                                                    ]
                                                }
                                                placeholderTekst="Wat wil de provincie bereiken?"
                                                fieldLabel="Wat wil de provincie bereiken?"
                                                dataObjectProperty="Omschrijving_Keuze"
                                                pValue="Formuleer in één of enkele zinnen een concrete doelstelling op tactisch niveau. Beschrijf hier het 'wat' en vanuit welke rol."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Omschrijving werking beleidsbeslissing"
                                        beschrijving="De werking van een beleidsbeslissing geeft aan in welke context en vanuit welke achtergrond de provincie hier beleid op voert."
                                    >
                                        {crudObject['Omschrijving_Werking'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject[
                                                        'Omschrijving_Werking'
                                                    ]
                                                }
                                                fieldLabel="Werking"
                                                dataObjectProperty="Omschrijving_Werking"
                                                pValue="Wat is de werking van de beleidsbeslissing?"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Motivering"
                                        beschrijving="De motivering is de reden waarom de provincie deze beleidskeuze maakt."
                                    >
                                        {crudObject['Aanleiding'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Aanleiding']
                                                }
                                                fieldLabel="Aanleiding"
                                                dataObjectProperty="Aanleiding"
                                                pValue="Wat was de aanleiding voor de beleidsbeslissing?"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                        {crudObject['Afweging'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Afweging']
                                                }
                                                fieldLabel="Afwegingen"
                                                dataObjectProperty="Afweging"
                                                pValue="Welke afwegingen hebben tot deze beleidsbeslissing geleid?"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                        {crudObject['Provinciaal_Belang'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject[
                                                        'Provinciaal_Belang'
                                                    ]
                                                }
                                                fieldLabel="Provinciaal belang"
                                                dataObjectProperty="Provinciaal_Belang"
                                                pValue="Beschrijf en motiveer het provinciaal belang"
                                                anchorText="(zie Artikel 2.3 van de Omgevingswet)"
                                                anchorLink="https://zoek.officielebekendmakingen.nl/stb-2016-156.html#d16e418"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                        {crudObject['Belangen'] !==
                                        undefined ? (
                                            <FormFieldUniverseleRelatieKoppeling
                                                placeholderTekst="Er is nog geen Nationaal belang of 'Wettelijke taken & bevoegdheden' gekoppeld."
                                                buttonTekst="Koppel belang of taak"
                                                titelMainObject={
                                                    crudObject['Titel']
                                                }
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Belangen']
                                                }
                                                fieldLabel="Nationaal Belang en Wettelijke taken & bevoegdheden"
                                                dataObjectProperty="Belangen"
                                                pValue="Indien deze beleidsbeslissing een nationaal belang dient of voortkomt uit een wettelijke taak of bevoegdheid, selecteer dit hieronder."
                                                titelEnkelvoud={titelEnkelvoud}
                                                wijzigKoppelingRelatie={
                                                    wijzigKoppelingRelatie
                                                }
                                                voegKoppelingRelatieToe={
                                                    voegKoppelingRelatieToe
                                                }
                                                verwijderKoppelingRelatie={
                                                    verwijderKoppelingRelatie
                                                }
                                                koppelingRelatieArray={[
                                                    'belangen',
                                                    'taken',
                                                ]}
                                                crudObject={JSON.parse(
                                                    JSON.stringify(crudObject)
                                                )}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Werkingsgebied"
                                        beschrijving="Het werkingsgebied geeft het gebied weer waarin de beleidsbeslissing werking heeft. Het gebied waar binnen bepaalde activiteiten gestimuleerd worden, of toegestaan zijn. Maar ook het gebied waar binnen bepaalde activiteiten juist niet zijn toegestaan. Heeft jouw beleidsbeslissing nog geen geschikt werkingsgebied, ontwikkel er dan een met iemand van Team GEO."
                                    >
                                        {crudObject['WerkingsGebieden'] !==
                                        undefined ? (
                                            <FormFieldWerkingsgebiedKoppeling
                                                handleChange={handleChange}
                                                titelEnkelvoud={titelEnkelvoud}
                                                fieldValue={
                                                    crudObject[
                                                        'WerkingsGebieden'
                                                    ]
                                                }
                                                fieldLabel="Selecteer werkingsgebied"
                                                dataObjectProperty="WerkingsGebieden"
                                                pValue="Selecteer hier het werkingsgebied wat bij deze beleidsbeslissing past."
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Koppelingen"
                                        beschrijving="Integraal Omgevingsbeleid betekent dat deze beleidsbeslissing koppelingen met andere onderdelen van het provinciale beleid heeft. Koppelingen leg je, eenzijdig, met andere beleidsobjecten, zoals een artikel uit de verordening of een ambitie."
                                        // titel="Koppelingen en relaties"
                                        // beschrijving="Integraal Omgevingsbeleid betekent dat deze beleidsbeslissing relaties en koppelingen met andere onderdelen van het provinciale beleid heeft. Een relatie ga je, met wederzijds goedkeuren, aan met andere beleidsbeslissingen. Koppelingen leg je, eenzijdig, met andere beleidsobjecten, zoals een artikel uit de verordening of een ambitie."
                                    >
                                        <FormFieldUniverseleRelatieKoppeling
                                            placeholderTekst="Er zijn nog geen relaties aangebracht voor deze beleidsbeslissing"
                                            buttonTekst="Nieuwe koppeling"
                                            titelMainObject={
                                                crudObject['Titel']
                                            }
                                            handleChange={handleChange}
                                            fieldValue={crudObject['Belangen']}
                                            fieldLabel="Koppelingen"
                                            dataObjectProperty="Koppelingen"
                                            pValue="Aan welke ambities, opgaven, artikelen uit de verordening, maatregelen en beleidsregels heeft deze beleidsbeslissing een koppeling?"
                                            titelEnkelvoud={titelEnkelvoud}
                                            voegKoppelingRelatieToe={
                                                voegKoppelingRelatieToe
                                            }
                                            wijzigKoppelingRelatie={
                                                wijzigKoppelingRelatie
                                            }
                                            verwijderKoppelingRelatie={
                                                verwijderKoppelingRelatie
                                            }
                                            koppelingRelatieArray={[
                                                'ambities',
                                                'opgaven',
                                                'themas',
                                                'beleidsregels',
                                                'doelen',
                                                'maatregelen',
                                                'verordening',
                                            ]}
                                            crudObject={JSON.parse(
                                                JSON.stringify(crudObject)
                                            )}
                                        />
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Aanvullende informatie"
                                        beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en het besluitnummer."
                                    >
                                        {/* Weblink */}
                                        {crudObject['Weblink'] !== undefined ? (
                                            <FormFieldWeblink
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Weblink']
                                                }
                                                dataObjectProperty="Weblink"
                                                fieldLabel="IDMS"
                                                pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Besluit Nummer */}
                                        {crudObject['Besluitnummer'] !==
                                        undefined ? (
                                            <FormFieldTextInput
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Besluitnummer']
                                                }
                                                fieldLabel="Besluitnummer"
                                                dataObjectProperty="Besluitnummer"
                                                notRequired={true}
                                                pValue="Geef hier het PZH besluitnummer."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            {crudObject['Begin_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Begin_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Datum inwerkingtreding"
                                                    notRequired={true}
                                                    dataObjectProperty="Begin_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}

                                            {/* Eind Geldigheid */}
                                            {crudObject['Eind_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    handleChange={handleChange}
                                                    notRequired={true}
                                                    fieldValue={
                                                        crudObject[
                                                            'Eind_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Datum uitwerkingtreding"
                                                    dataObjectProperty="Eind_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    </ContainerFormSection>
                                </React.Fragment>
                            ) : null}

                            {/* 2. Beleidsrelatie sectie */}
                            {titelEnkelvoud === 'Beleidsrelatie' ? (
                                <React.Fragment>
                                    <ContainerFormSection
                                        titel="Algemene informatie"
                                        beschrijving="De algemene informatie bevat een duidelijke titel en de betrokken personen."
                                    >
                                        {crudObject['Titel'] !== undefined ? (
                                            <FormFieldTextInput
                                                handleChange={handleChange}
                                                fieldValue={crudObject['Titel']}
                                                dataObjectProperty="Titel"
                                                fieldLabel="Titel"
                                                pValue="Formuleer in enkele woorden de titel van deze maatregel."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {crudObject['Omschrijving'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Omschrijving']
                                                }
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Omschrijving"
                                                pValue="Geef een korte omschrijving van deze beleidsregel"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            {crudObject['Begin_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Begin_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Inwerkingtreding"
                                                    dataObjectProperty="Begin_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}

                                            {/* Eind Geldigheid */}
                                            {crudObject['Eind_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    openUitwerkingstrede={true}
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Eind_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Uitwerkingtreding"
                                                    dataObjectProperty="Eind_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                        {/* Eind Geldigheid */}
                                        {crudObject['Van_Beleidsbeslissing'] !==
                                        undefined ? (
                                            <FormFieldSelectBeleidsbeslissing
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject[
                                                        'Van_Beleidsbeslissing'
                                                    ]
                                                }
                                                fieldLabel="Van Beleidsbeslissing"
                                                dataObjectProperty="Van_Beleidsbeslissing"
                                                // pValue="Beschrijving"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                        {/* Eind Geldigheid */}
                                        {crudObject[
                                            'Naar_Beleidsbeslissing'
                                        ] !== undefined ? (
                                            <FormFieldSelectBeleidsbeslissing
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject[
                                                        'Naar_Beleidsbeslissing'
                                                    ]
                                                }
                                                fieldLabel="Naar Beleidsbeslissing"
                                                dataObjectProperty="Naar_Beleidsbeslissing"
                                                // pValue="Beschrijving"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>
                                </React.Fragment>
                            ) : null}

                            {/* 3. Maatregel sectie */}
                            {titelEnkelvoud === 'Maatregel' ? (
                                <React.Fragment>
                                    <ContainerFormSection
                                        titel="Algemene informatie"
                                        beschrijving="De algemene informatie bevat een duidelijke titel en de mogelijkheid om aan te geven of het programma verplicht is en of het programma gebiedsspecifiek of generiek is."
                                    >
                                        {crudObject['Titel'] !== undefined ? (
                                            <FormFieldTextInput
                                                handleChange={handleChange}
                                                fieldValue={crudObject['Titel']}
                                                dataObjectProperty="Titel"
                                                fieldLabel="Titel"
                                                pValue="Formuleer in enkele woorden de titel van deze maatregel."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Verplicht_Programma */}
                                        {crudObject['Verplicht_Programma'] !==
                                        undefined ? (
                                            <FormFieldSelect
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject[
                                                        'Verplicht_Programma'
                                                    ]
                                                }
                                                fieldLabel="Verplicht Programma"
                                                dataObjectProperty="Verplicht_Programma"
                                                selectArray={
                                                    verplichtProgrammaValues
                                                }
                                                pValue="De maatregel behoort tot een verplicht programma?"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Specifiek_Of_Generiek */}
                                        {crudObject['Specifiek_Of_Generiek'] !==
                                        undefined ? (
                                            <FormFieldSelect
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject[
                                                        'Specifiek_Of_Generiek'
                                                    ]
                                                }
                                                fieldLabel="Specifiek of Generiek"
                                                dataObjectProperty="Specifiek_Of_Generiek"
                                                selectArray={
                                                    SpecifiekOfGeneriekValues
                                                }
                                                pValue="Is de maatregel te kwalificeren als gebiedsspecifiek of generiek?"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Omschrijving maatregel"
                                        beschrijving="Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid."
                                    >
                                        {crudObject['Omschrijving'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Omschrijving']
                                                }
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Omschrijving"
                                                pValue="Geef een korte omschrijving van deze maatregel"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Werkingsgebied"
                                        beschrijving="Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid."
                                    >
                                        {/* Gebied */}
                                        {crudObject['Gebied'] !== undefined ? (
                                            <FormFieldWerkingsgebiedKoppelingSingle
                                                handleChange={handleChange}
                                                titelEnkelvoud={titelEnkelvoud}
                                                fieldValue={
                                                    crudObject['Gebied']
                                                }
                                                fieldLabel="Selecteer werkingsgebied"
                                                dataObjectProperty="Gebied"
                                                pValue="Selecteer hier het werkingsgebied wat bij deze maatregel past."
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Aanvullende informatie"
                                        beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en het besluitnummer."
                                    >
                                        {/* Weblink */}
                                        {crudObject['Weblink'] !== undefined ? (
                                            <FormFieldWeblink
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Weblink']
                                                }
                                                dataObjectProperty="Weblink"
                                                fieldLabel="IDMS"
                                                pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            {crudObject['Begin_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Begin_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Inwerkingtreding"
                                                    dataObjectProperty="Begin_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}

                                            {/* Eind Geldigheid */}
                                            {crudObject['Eind_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    openUitwerkingstrede={true}
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Eind_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Uitwerkingtreding"
                                                    dataObjectProperty="Eind_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    </ContainerFormSection>
                                </React.Fragment>
                            ) : null}

                            {/* 4. Ambitie sectie */}
                            {titelEnkelvoud === 'Ambitie' ? (
                                <React.Fragment>
                                    <ContainerFormSection
                                        titel="Algemene informatie"
                                        beschrijving="De algemene informatie bevat een duidelijke titel."
                                    >
                                        {crudObject['Titel'] !== undefined ? (
                                            <FormFieldTextInput
                                                handleChange={handleChange}
                                                fieldValue={crudObject['Titel']}
                                                dataObjectProperty="Titel"
                                                fieldLabel="Titel"
                                                pValue="Formuleer in enkele woorden de titel van deze ambitie."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Omschrijving ambitie"
                                        beschrijving="Geef een korte omschrijving van deze ambitie"
                                    >
                                        {crudObject['Omschrijving'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Omschrijving']
                                                }
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Omschrijving"
                                                pValue="Geef een korte omschrijving van deze maatregel"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Aanvullende informatie"
                                        beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding."
                                    >
                                        {/* Weblink */}
                                        {crudObject['Weblink'] !== undefined ? (
                                            <FormFieldWeblink
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Weblink']
                                                }
                                                dataObjectProperty="Weblink"
                                                fieldLabel="IDMS"
                                                pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            {crudObject['Begin_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Begin_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Inwerkingtreding"
                                                    dataObjectProperty="Begin_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}

                                            {/* Eind Geldigheid */}
                                            {crudObject['Eind_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    openUitwerkingstrede={true}
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Eind_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Uitwerkingtreding"
                                                    dataObjectProperty="Eind_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    </ContainerFormSection>
                                </React.Fragment>
                            ) : null}

                            {/* 5. Opgave sectie */}
                            {titelEnkelvoud === 'Opgave' ? (
                                <React.Fragment>
                                    <ContainerFormSection
                                        titel="Algemene informatie"
                                        beschrijving="De algemene informatie bevat een duidelijke titel."
                                    >
                                        {crudObject['Titel'] !== undefined ? (
                                            <FormFieldTextInput
                                                handleChange={handleChange}
                                                fieldValue={crudObject['Titel']}
                                                dataObjectProperty="Titel"
                                                fieldLabel="Titel"
                                                pValue="Formuleer in enkele woorden de titel van deze opgave."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Omschrijving opgave"
                                        beschrijving="Een opgave bevindt zich op tactisch niveau, tussen het niveau van de ambities en de beleidsbeslissingen."
                                    >
                                        {crudObject['Omschrijving'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Omschrijving']
                                                }
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Omschrijving"
                                                pValue="Geef een korte omschrijving van deze opgave."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Aanvullende informatie"
                                        beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding."
                                    >
                                        {/* Weblink */}
                                        {crudObject['Weblink'] !== undefined ? (
                                            <FormFieldWeblink
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Weblink']
                                                }
                                                dataObjectProperty="Weblink"
                                                fieldLabel="IDMS"
                                                pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            {crudObject['Begin_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Begin_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Inwerkingtreding"
                                                    dataObjectProperty="Begin_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}

                                            {/* Eind Geldigheid */}
                                            {crudObject['Eind_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    openUitwerkingstrede={true}
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Eind_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Uitwerkingtreding"
                                                    dataObjectProperty="Eind_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    </ContainerFormSection>
                                </React.Fragment>
                            ) : null}

                            {/* 6. Beleidsregel sectie */}
                            {titelEnkelvoud === 'Beleidsregel' ? (
                                <React.Fragment>
                                    <ContainerFormSection
                                        titel="Algemene informatie"
                                        beschrijving="De algemene informatie bevat een duidelijke titel."
                                    >
                                        {crudObject['Titel'] !== undefined ? (
                                            <FormFieldTextInput
                                                handleChange={handleChange}
                                                fieldValue={crudObject['Titel']}
                                                dataObjectProperty="Titel"
                                                fieldLabel="Titel"
                                                pValue="Formuleer in enkele woorden de titel van deze beleidsregel."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Omschrijving opgave"
                                        beschrijving="Een beleidsregel geeft weer op welke wijze de provincie invulling geeft aan een medebewindstaak. "
                                    >
                                        {crudObject['Omschrijving'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Omschrijving']
                                                }
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Omschrijving"
                                                pValue="Geef een korte omschrijving van deze beleidsregel."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Aanvullende informatie"
                                        beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding."
                                    >
                                        {/* Weblink */}
                                        {crudObject['Weblink'] !== undefined ? (
                                            <FormFieldWeblink
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Weblink']
                                                }
                                                dataObjectProperty="Weblink"
                                                fieldLabel="IDMS"
                                                pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            {crudObject['Begin_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Begin_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Inwerkingtreding"
                                                    dataObjectProperty="Begin_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}

                                            {/* Eind Geldigheid */}
                                            {crudObject['Eind_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    openUitwerkingstrede={true}
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Eind_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Uitwerkingtreding"
                                                    dataObjectProperty="Eind_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    </ContainerFormSection>
                                </React.Fragment>
                            ) : null}

                            {/* 7. Nationaal belang of wettelijke taak sectie */}
                            {titelEnkelvoud === 'Belang' ? (
                                <React.Fragment>
                                    <ContainerFormSection
                                        titel="Algemene informatie"
                                        beschrijving="De algemene informatie bevat een duidelijke titel en de mogelijkheid om aan te geven of het om een nationaal belang gaat, of een wettelijke taak of bevoegdheid."
                                    >
                                        {crudObject['Titel'] !== undefined ? (
                                            <FormFieldTextInput
                                                handleChange={handleChange}
                                                fieldValue={crudObject['Titel']}
                                                dataObjectProperty="Titel"
                                                fieldLabel="Titel"
                                                pValue="Formuleer in enkele woorden de titel van dit nationaal belang of deze wettelijke taak."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                        {crudObject['Type'] !== undefined ? (
                                            <FormFieldSelect
                                                handleChange={handleChange}
                                                titelEnkelvoud={titelEnkelvoud}
                                                fieldValue={crudObject['Type']}
                                                selectArray={BelangTypeValues}
                                                fieldLabel="Type"
                                                dataObjectProperty="Type"
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Omschrijving nationaal belang of wettelijke taak"
                                        beschrijving="De nationale belangen zijn afkomstig uit de nationale omgevingsvisie, danwel aanvullende afspraken tussen rijk en provincies. De wettelijke taken refereren aan het betreffende wetsartikel waarin de provincie een medebewindstaak opgedragen krijgt."
                                    >
                                        {crudObject['Omschrijving'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Omschrijving']
                                                }
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Omschrijving"
                                                pValue="Geef een korte omschrijving van dit nationaal belang of deze wettelijke taak."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Aanvullende informatie"
                                        beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding."
                                    >
                                        {/* Weblink */}
                                        {crudObject['Weblink'] !== undefined ? (
                                            <FormFieldWeblink
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Weblink']
                                                }
                                                dataObjectProperty="Weblink"
                                                fieldLabel="IDMS"
                                                pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            {crudObject['Begin_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Begin_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Inwerkingtreding"
                                                    dataObjectProperty="Begin_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}

                                            {/* Eind Geldigheid */}
                                            {crudObject['Eind_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    openUitwerkingstrede={true}
                                                    handleChange={handleChange}
                                                    Begin_Geldigheid={
                                                        crudObject[
                                                            'Begin_Geldigheid'
                                                        ]
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Eind_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Uitwerkingtreding"
                                                    dataObjectProperty="Eind_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    </ContainerFormSection>
                                </React.Fragment>
                            ) : null}

                            {/* 8. Thema sectie */}
                            {titelEnkelvoud === 'Thema' ? (
                                <React.Fragment>
                                    <ContainerFormSection
                                        titel="Algemene informatie"
                                        beschrijving="De algemene informatie bevat een duidelijke titel."
                                    >
                                        {crudObject['Titel'] !== undefined ? (
                                            <FormFieldTextInput
                                                handleChange={handleChange}
                                                fieldValue={crudObject['Titel']}
                                                dataObjectProperty="Titel"
                                                fieldLabel="Titel"
                                                pValue="Beschrijf in een aantal woorden de titel van dit thema."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Omschrijving thema"
                                        beschrijving="Een thema wordt gebruikt om het beleid te categoriseren."
                                    >
                                        {crudObject['Omschrijving'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Omschrijving']
                                                }
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Omschrijving"
                                                pValue="Geef een korte omschrijving van dit thema."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}
                                    </ContainerFormSection>

                                    <ContainerFormSection
                                        titel="Aanvullende informatie"
                                        beschrijving="In deze sectie vragen we aanvullende informatie zoals (indien bekend) de datum van inwerkingtreding."
                                    >
                                        {/* Weblink */}
                                        {crudObject['Weblink'] !== undefined ? (
                                            <FormFieldWeblink
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject['Weblink']
                                                }
                                                dataObjectProperty="Weblink"
                                                fieldLabel="IDMS"
                                                pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            {crudObject['Begin_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Begin_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Inwerkingtreding"
                                                    dataObjectProperty="Begin_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}

                                            {/* Eind Geldigheid */}
                                            {crudObject['Eind_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
                                                    openUitwerkingstrede={true}
                                                    handleChange={handleChange}
                                                    fieldValue={
                                                        crudObject[
                                                            'Eind_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Uitwerkingtreding"
                                                    dataObjectProperty="Eind_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    </ContainerFormSection>
                                </React.Fragment>
                            ) : null}

                            {/* Submit */}
                            <div className="fixed bottom-0 right-0 px-6">
                                <div className="bg-white shadow px-4 py-4 inline-block rounded-t">
                                    <input
                                        id="form-submit"
                                        className="font-bold py-2 px-4 leading-tight text-sm rounded mbg-color text-white hover:underline cursor-pointer"
                                        type="submit"
                                        value="Opslaan"
                                    ></input>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </ContainerMain>
        )
    }
}

export default ContainerCrudFields
