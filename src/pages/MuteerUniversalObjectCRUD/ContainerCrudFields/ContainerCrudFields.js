import React from 'react'

// Import Context
import APIcontext from './../APIContext'

// Import Components
import ContainerMain from './../../../components/ContainerMain'
import ContainerFormSection from './../../../components/ContainerFormSection'
import FormFieldTextInput from './../../../components/FormFieldTextInput'
import FormFieldTextArea from './../../../components/FormFieldTextArea'
import FormFieldWeblink from './../../../components/FormFieldWeblink'
import FormFieldDate from './../../../components/FormFieldDate'
import FormFieldTags from './../../../components/FormFieldTags'
import FormFieldSelect from './../../../components/FormFieldSelect'
import FormFieldBeleidsrelatie from './../../../components/FormFieldBeleidsrelatie'
import FormFieldWerkingsgebiedrelatie from './../../../components/FormFieldWerkingsgebiedrelatie'
import FormFieldWerkingsgebiedKoppeling from './../../../components/FormFieldWerkingsgebiedKoppeling'
import FormFieldSelectUserGroup from './../../../components/FormFieldSelectUserGroup'
import FormFieldUniverseleRelatieKoppeling from './../../../components/FormFieldUniverseleRelatieKoppeling'
import FormFieldBeleidsrelatieKoppeling from '../../../components/FormFieldBeleidsrelatieKoppeling/FormFieldBeleidsrelatieKoppeling'

class ContainerCrudFields extends React.Component {
    render() {
        const objectUUID = this.context.objectUUID
        const crudObject = this.context.crudObject
        const titelEnkelvoud = this.context.titelEnkelvoud

        const statusArrayValues = [
            ['Open', 'Open'],
            ['Akkoord', 'Akkoord'],
            ['NietAkkoord', 'Niet Akkoord'],
        ]

        const verplichtProgrammaValues = [['Ja', 'Ja'], ['Nee', 'Nee']]

        const SpecifiekOfGeneriekValues = [
            ['Gebiedsspecifiek', 'Gebiedsspecifiek'],
            ['Generiek', 'Generiek'],
        ]

        const VerordeningTypeValues = [
            ['Hoofdstuk', 'Hoofdstuk'],
            ['Afdeling', 'Afdeling'],
            ['Paragraaf', 'Paragraaf'],
            ['Artikel', 'Artikel'],
        ]

        const BelangTypeValues = [
            ['Nationaal Belang', 'Nationaal Belang'],
            ['Wettelijke Taak & Bevoegdheid', 'Wettelijke Taak & Bevoegdheid'],
        ]

        return (
            <React.Fragment>
                <ContainerMain>
                    <div className="w-full inline-block flex-grow">
                        <div>
                            <form
                                className="mt-12"
                                onSubmit={this.context.handleSubmit}
                            >
                                {/* 1. Beleidsbeslissingen sectie */}
                                {titelEnkelvoud === 'Beleidsbeslissing' ? (
                                    <React.Fragment>
                                        <ContainerFormSection
                                            titel="Algemene informatie"
                                            beschrijving="De algemene informatie bevat een duidelijke titel en de betrokken personen."
                                        >
                                            {crudObject['Titel'] !==
                                            undefined ? (
                                                <FormFieldTextInput
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Titel']
                                                    }
                                                    dataObjectProperty="Titel"
                                                    fieldLabel="Titel"
                                                    pValue="Formuleer in enkele woorden de titel van de beleidsbeslissing."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}

                                            {crudObject['Opdrachtgever'] !==
                                                undefined ||
                                            crudObject[
                                                'Portefeuillehouder_1'
                                            ] !== undefined ||
                                            crudObject[
                                                'Portefeuillehouder_2'
                                            ] !== undefined ||
                                            crudObject['Eigenaar_1'] !==
                                                undefined ||
                                            crudObject['Eigenaar_2'] !==
                                                undefined ? (
                                                <React.Fragment>
                                                    <FormFieldSelectUserGroup
                                                        handleChange={
                                                            this.context
                                                                .handleChange
                                                        }
                                                        crudObject={crudObject}
                                                        marginRight={true}
                                                        fieldLabel="Personen"
                                                        titelEnkelvoud={
                                                            titelEnkelvoud
                                                        }
                                                        editStatus={
                                                            this.context
                                                                .editStatus
                                                        }
                                                    />
                                                </React.Fragment>
                                            ) : null}
                                        </ContainerFormSection>

                                        <ContainerFormSection
                                            titel="Omschrijving beleidsbeslissing"
                                            beschrijving="Een beleidsbeslissing betreft een (politieke) beleidskeuze en heeft rechtsgevolgen voor derden."
                                        >
                                            {crudObject[
                                                'Omschrijving_Keuze'
                                            ] !== undefined ? (
                                                <FormFieldTextArea
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Omschrijving_Keuze'
                                                        ]
                                                    }
                                                    fieldLabel="Wat wil de provincie bereiken?"
                                                    dataObjectProperty="Omschrijving_Keuze"
                                                    pValue="Formuleer in één of enkele zinnen een concrete doelstelling op tactisch niveau. Beschrijf hier het 'wat' en vanuit welke rol."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    addObjectLabel={true}
                                                />
                                            ) : null}
                                        </ContainerFormSection>

                                        <ContainerFormSection
                                            titel="Omschrijving werking beleidsbeslissing"
                                            beschrijving="De werking van een beleidsbeslissing geeft aan in welke context en vanuit welke achtergrond de provincie hier beleid op voert."
                                        >
                                            {crudObject[
                                                'Omschrijving_Keuze'
                                            ] !== undefined ? (
                                                <FormFieldTextArea
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Omschrijving_Werking'
                                                        ]
                                                    }
                                                    fieldLabel="Werking"
                                                    dataObjectProperty="Omschrijving_Werking"
                                                    pValue="Wat is de werking van de beleidsbeslissing?"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    addObjectLabel={true}
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
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Aanleiding']
                                                    }
                                                    fieldLabel="Aanleiding"
                                                    addObjectLabel={true}
                                                    dataObjectProperty="Aanleiding"
                                                    pValue="Wat was de aanleiding voor de beleidsbeslissing?"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                            {crudObject['Afweging'] !==
                                            undefined ? (
                                                <FormFieldTextArea
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Afweging']
                                                    }
                                                    fieldLabel="Afwegingen"
                                                    addObjectLabel={true}
                                                    dataObjectProperty="Afweging"
                                                    pValue="Welke afwegingen hebben tot deze beleidsbeslissing geleid?"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                            {crudObject[
                                                'Provinciaal_Belang'
                                            ] !== undefined ? (
                                                <FormFieldTextArea
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Provinciaal_Belang'
                                                        ]
                                                    }
                                                    fieldLabel="Provinciaal belang"
                                                    addObjectLabel={true}
                                                    dataObjectProperty="Provinciaal_Belang"
                                                    pValue="Beschrijf en motiveer het provinciaal belang (zie Artikel 2.3 van de Omgevingswet)"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
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
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Belangen']
                                                    }
                                                    fieldLabel="Nationaal Belang en Wettelijke taken & bevoegdheden"
                                                    addObjectLabel={true}
                                                    dataObjectProperty="Belangen"
                                                    pValue="Indien deze beleidsbeslissing een nationaal belang dient of voortkomt uit een wettelijke taak of bevoegdheid, selecteer dit hieronder."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    wijzigKoppelingRelatie={
                                                        this.context
                                                            .wijzigKoppelingRelatie
                                                    }
                                                    voegKoppelingRelatieToe={
                                                        this.context
                                                            .voegKoppelingRelatieToe
                                                    }
                                                    verwijderKoppelingRelatieToe={
                                                        this.context
                                                            .verwijderKoppelingRelatieToe
                                                    }
                                                    koppelingRelatieArray={[
                                                        'belangen',
                                                        'taken',
                                                    ]}
                                                    crudObject={JSON.parse(
                                                        JSON.stringify(
                                                            crudObject
                                                        )
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
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'WerkingsGebieden'
                                                        ]
                                                    }
                                                    fieldLabel="Selecteer werkingsgebied"
                                                    dataObjectProperty="WerkingsGebieden"
                                                    pValue="Selecteer hier het werkingsgebied wat bij deze beleidsbeslissing past."
                                                    addObjectLabel={true}
                                                />
                                            ) : null}
                                        </ContainerFormSection>

                                        <ContainerFormSection
                                            titel="Koppelingen en relaties"
                                            beschrijving="Integraal Omgevingsbeleid betekent dat deze beleidsbeslissing relaties en koppelingen met andere onderdelen van het provinciale beleid heeft. Een relatie ga je, met wederzijds goedkeuren, aan met andere beleidsbeslissingen. Koppelingen leg je, eenzijdig, met andere beleidsobjecten, zoals een artikel uit de verordening of een ambitie."
                                        >
                                            <FormFieldBeleidsrelatieKoppeling
                                                objectUUID={objectUUID}
                                                placeholderTekst="Er zijn nog geen relaties aangebracht voor deze beleidsbeslissing"
                                                buttonTekst="Nieuwe koppeling"
                                                titelMainObject={
                                                    crudObject['Titel']
                                                }
                                                handleChange={
                                                    this.context.handleChange
                                                }
                                                fieldValue={
                                                    crudObject['Belangen']
                                                }
                                                fieldLabel="Relaties"
                                                addObjectLabel={true}
                                                dataObjectProperty="Beleidsrelaties"
                                                pValue="Met welke andere beleidsbeslissingen heeft deze beleidsbeslissing een relatie?"
                                                titelEnkelvoud={titelEnkelvoud}
                                                voegKoppelingRelatieToe={
                                                    this.context
                                                        .voegKoppelingRelatieToe
                                                }
                                                wijzigKoppelingRelatie={
                                                    this.context
                                                        .wijzigKoppelingRelatie
                                                }
                                                verwijderKoppelingRelatieToe={
                                                    this.context
                                                        .verwijderKoppelingRelatieToe
                                                }
                                                editStatus={
                                                    this.context.editStatus
                                                }
                                                koppelingRelatieArray={[
                                                    'beleidsbeslissing',
                                                ]}
                                                crudObject={JSON.parse(
                                                    JSON.stringify(crudObject)
                                                )}
                                            />
                                            <FormFieldUniverseleRelatieKoppeling
                                                placeholderTekst="Er zijn nog geen relaties aangebracht voor deze beleidsbeslissing"
                                                buttonTekst="Nieuwe koppeling"
                                                titelMainObject={
                                                    crudObject['Titel']
                                                }
                                                handleChange={
                                                    this.context.handleChange
                                                }
                                                fieldValue={
                                                    crudObject['Belangen']
                                                }
                                                fieldLabel="Koppelingen"
                                                addObjectLabel={true}
                                                dataObjectProperty="Koppelingen"
                                                pValue="Aan welke ambities, opgaven, artikelen uit de verordening, maatregelen en nadere beleidsregels heeft deze beleidsbeslissing een koppeling?"
                                                titelEnkelvoud={titelEnkelvoud}
                                                voegKoppelingRelatieToe={
                                                    this.context
                                                        .voegKoppelingRelatieToe
                                                }
                                                wijzigKoppelingRelatie={
                                                    this.context
                                                        .wijzigKoppelingRelatie
                                                }
                                                verwijderKoppelingRelatieToe={
                                                    this.context
                                                        .verwijderKoppelingRelatieToe
                                                }
                                                koppelingRelatieArray={[
                                                    'ambities',
                                                    'opgaven',
                                                    'beleidsregels',
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
                                            {crudObject['Weblink'] !==
                                            undefined ? (
                                                <FormFieldWeblink
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Weblink']
                                                    }
                                                    dataObjectProperty="Weblink"
                                                    fieldLabel="IDMS"
                                                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    addObjectLabel={true}
                                                />
                                            ) : null}

                                            {/* Besluit Nummer */}
                                            {crudObject['Besluitnummer'] !==
                                            undefined ? (
                                                <FormFieldTextInput
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Besluitnummer'
                                                        ]
                                                    }
                                                    fieldLabel="Besluitnummer"
                                                    dataObjectProperty="Besluitnummer"
                                                    notRequired={true}
                                                    pValue="Geef hier het PZH besluitnummer."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    addObjectLabel={true}
                                                />
                                            ) : null}

                                            {/* Geldigheid */}
                                            <div className="flex flex-wrap -mx-3">
                                                {/* Begin Geldigheid */}
                                                {crudObject[
                                                    'Begin_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
                                                        }
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
                                                {crudObject[
                                                    'Eind_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
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

                                            {/* Verordening Werkingsgebied */}
                                            {crudObject['Tags'] !==
                                            undefined ? (
                                                <FormFieldTags
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    fieldValue={
                                                        crudObject['Tags']
                                                    }
                                                    fieldLabel="Tags"
                                                    dataObjectProperty="Tags"
                                                    editStatus={
                                                        this.context.editStatus
                                                    }
                                                    pValue="Om deze beleidsbeslissing beter vindbaar te maken voor raadplegers, kunnen hier tags toegevoegd worden. Beperk het aantal tags enigszins en zorg dat ze zeer gerelateerd zijn aan het beleid. Een wildgroei van tags bij het beleid zorgt juist voor een slechtere vindbaarheid."
                                                    addObjectLabel={true}
                                                />
                                            ) : null}
                                        </ContainerFormSection>
                                    </React.Fragment>
                                ) : null}

                                {/* Maatregel sectie */}
                                {titelEnkelvoud === 'Maatregel' ? (
                                    <React.Fragment>
                                        <ContainerFormSection
                                            titel="Algemene informatie"
                                            beschrijving="De algemene informatie bevat een duidelijke titel en de mogelijkheid om aan te geven of het programma verplicht is en of het programma gebiedsspecifiek of generiek is."
                                        >
                                            {crudObject['Titel'] !==
                                            undefined ? (
                                                <FormFieldTextInput
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Titel']
                                                    }
                                                    dataObjectProperty="Titel"
                                                    fieldLabel="Titel"
                                                    pValue="Formuleer in enkele woorden de titel van deze maatregel."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
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
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Omschrijving'
                                                        ]
                                                    }
                                                    fieldLabel="Omschrijving"
                                                    dataObjectProperty="Omschrijving"
                                                    pValue="Geef een korte omschrijving van deze maatregel"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </ContainerFormSection>

                                        <ContainerFormSection
                                            titel="Werkingsgebied"
                                            beschrijving="Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid."
                                        >
                                            {/* Gebied */}
                                            {crudObject['Gebied'] !==
                                            undefined ? (
                                                <FormFieldWerkingsgebiedrelatie
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Gebied']
                                                    }
                                                    fieldLabel="Selecteer werkingsgebied"
                                                    dataObjectProperty="Gebied"
                                                    pValue="Selecteer hier het werkingsgebied wat bij deze maatregel past."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    editStatus={
                                                        this.context.editStatus
                                                    }
                                                />
                                            ) : null}
                                        </ContainerFormSection>

                                        <ContainerFormSection
                                            titel="Aanvullende informatie"
                                            beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en het besluitnummer."
                                        >
                                            {/* Weblink */}
                                            {crudObject['Weblink'] !==
                                            undefined ? (
                                                <FormFieldWeblink
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Weblink']
                                                    }
                                                    dataObjectProperty="Weblink"
                                                    fieldLabel="IDMS"
                                                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    addObjectLabel={true}
                                                />
                                            ) : null}

                                            {/* Geldigheid */}
                                            <div className="flex flex-wrap -mx-3">
                                                {/* Begin Geldigheid */}
                                                {crudObject[
                                                    'Begin_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
                                                        }
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
                                                {crudObject[
                                                    'Eind_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
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

                                            {/* Verordening Werkingsgebied */}
                                            {crudObject['Tags'] !==
                                            undefined ? (
                                                <FormFieldTags
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    fieldValue={
                                                        crudObject['Tags']
                                                    }
                                                    fieldLabel="Tags"
                                                    dataObjectProperty="Tags"
                                                    editStatus={
                                                        this.context.editStatus
                                                    }
                                                    pValue="Om deze maatregel vindbaar te maken voor de raadplegers, vragen we je om tags toe te voegen."
                                                    addObjectLabel={true}
                                                />
                                            ) : null}
                                        </ContainerFormSection>
                                    </React.Fragment>
                                ) : null}

                                {/* Ambitie sectie */}
                                {titelEnkelvoud === 'Ambitie' ? (
                                    <React.Fragment>
                                        <ContainerFormSection
                                            titel="Algemene informatie"
                                            beschrijving="De algemene informatie bevat een duidelijke titel."
                                        >
                                            {crudObject['Titel'] !==
                                            undefined ? (
                                                <FormFieldTextInput
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Titel']
                                                    }
                                                    dataObjectProperty="Titel"
                                                    fieldLabel="Titel"
                                                    pValue="Formuleer in enkele woorden de titel van deze ambitie."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
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
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Omschrijving'
                                                        ]
                                                    }
                                                    fieldLabel="Omschrijving"
                                                    dataObjectProperty="Omschrijving"
                                                    pValue="Geef een korte omschrijving van deze maatregel"
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </ContainerFormSection>

                                        <ContainerFormSection
                                            titel="Aanvullende informatie"
                                            beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding."
                                        >
                                            {/* Weblink */}
                                            {crudObject['Weblink'] !==
                                            undefined ? (
                                                <FormFieldWeblink
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Weblink']
                                                    }
                                                    dataObjectProperty="Weblink"
                                                    fieldLabel="IDMS"
                                                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    addObjectLabel={true}
                                                />
                                            ) : null}

                                            {/* Geldigheid */}
                                            <div className="flex flex-wrap -mx-3">
                                                {/* Begin Geldigheid */}
                                                {crudObject[
                                                    'Begin_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
                                                        }
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
                                                {crudObject[
                                                    'Eind_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
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

                                {/* Opgave sectie */}
                                {titelEnkelvoud === 'Opgave' ? (
                                    <React.Fragment>
                                        <ContainerFormSection
                                            titel="Algemene informatie"
                                            beschrijving="De algemene informatie bevat een duidelijke titel."
                                        >
                                            {crudObject['Titel'] !==
                                            undefined ? (
                                                <FormFieldTextInput
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Titel']
                                                    }
                                                    dataObjectProperty="Titel"
                                                    fieldLabel="Titel"
                                                    pValue="Formuleer in enkele woorden de titel van deze opgave."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
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
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Omschrijving'
                                                        ]
                                                    }
                                                    fieldLabel="Omschrijving"
                                                    dataObjectProperty="Omschrijving"
                                                    pValue="Geef een korte omschrijving van deze opgave."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </ContainerFormSection>

                                        <ContainerFormSection
                                            titel="Aanvullende informatie"
                                            beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding."
                                        >
                                            {/* Weblink */}
                                            {crudObject['Weblink'] !==
                                            undefined ? (
                                                <FormFieldWeblink
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Weblink']
                                                    }
                                                    dataObjectProperty="Weblink"
                                                    fieldLabel="IDMS"
                                                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    addObjectLabel={true}
                                                />
                                            ) : null}

                                            {/* Geldigheid */}
                                            <div className="flex flex-wrap -mx-3">
                                                {/* Begin Geldigheid */}
                                                {crudObject[
                                                    'Begin_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
                                                        }
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
                                                {crudObject[
                                                    'Eind_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
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

                                {/* Beleidsregel sectie */}
                                {titelEnkelvoud === 'Beleidsregel' ? (
                                    <React.Fragment>
                                        <ContainerFormSection
                                            titel="Algemene informatie"
                                            beschrijving="De algemene informatie bevat een duidelijke titel."
                                        >
                                            {crudObject['Titel'] !==
                                            undefined ? (
                                                <FormFieldTextInput
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Titel']
                                                    }
                                                    dataObjectProperty="Titel"
                                                    fieldLabel="Titel"
                                                    pValue="Formuleer in enkele woorden de titel van deze beleidsregel."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
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
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Omschrijving'
                                                        ]
                                                    }
                                                    fieldLabel="Omschrijving"
                                                    dataObjectProperty="Omschrijving"
                                                    pValue="Geef een korte omschrijving van deze beleidsregel."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </ContainerFormSection>

                                        <ContainerFormSection
                                            titel="Aanvullende informatie"
                                            beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding."
                                        >
                                            {/* Weblink */}
                                            {crudObject['Weblink'] !==
                                            undefined ? (
                                                <FormFieldWeblink
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Weblink']
                                                    }
                                                    dataObjectProperty="Weblink"
                                                    fieldLabel="IDMS"
                                                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    addObjectLabel={true}
                                                />
                                            ) : null}

                                            {/* Geldigheid */}
                                            <div className="flex flex-wrap -mx-3">
                                                {/* Begin Geldigheid */}
                                                {crudObject[
                                                    'Begin_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
                                                        }
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
                                                {crudObject[
                                                    'Eind_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
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

                                {/* Nationaal belang of wettelijke taak sectie */}
                                {titelEnkelvoud === 'Belang' ? (
                                    <React.Fragment>
                                        <ContainerFormSection
                                            titel="Algemene informatie"
                                            beschrijving="De algemene informatie bevat een duidelijke titel en de mogelijkheid om aan te geven of het om een nationaal belang gaat, of een wettelijke taak of bevoegdheid."
                                        >
                                            {crudObject['Titel'] !==
                                            undefined ? (
                                                <FormFieldTextInput
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Titel']
                                                    }
                                                    dataObjectProperty="Titel"
                                                    fieldLabel="Titel"
                                                    pValue="Formuleer in enkele woorden de titel van dit nationaal belang of deze wettelijke taak."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                            {crudObject['Type'] !==
                                            undefined ? (
                                                <FormFieldSelect
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    fieldValue={
                                                        crudObject['Type']
                                                    }
                                                    selectArray={
                                                        BelangTypeValues
                                                    }
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
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Omschrijving'
                                                        ]
                                                    }
                                                    fieldLabel="Omschrijving"
                                                    dataObjectProperty="Omschrijving"
                                                    pValue="Geef een korte omschrijving van dit nationaal belang of deze wettelijke taak."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </ContainerFormSection>

                                        <ContainerFormSection
                                            titel="Aanvullende informatie"
                                            beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding."
                                        >
                                            {/* Weblink */}
                                            {crudObject['Weblink'] !==
                                            undefined ? (
                                                <FormFieldWeblink
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Weblink']
                                                    }
                                                    dataObjectProperty="Weblink"
                                                    fieldLabel="IDMS"
                                                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    addObjectLabel={true}
                                                />
                                            ) : null}

                                            {/* Geldigheid */}
                                            <div className="flex flex-wrap -mx-3">
                                                {/* Begin Geldigheid */}
                                                {crudObject[
                                                    'Begin_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
                                                        }
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
                                                {crudObject[
                                                    'Eind_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
                                                        }
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

                                {/* Thema sectie */}
                                {titelEnkelvoud === 'Thema' ? (
                                    <React.Fragment>
                                        <ContainerFormSection
                                            titel="Algemene informatie"
                                            beschrijving="De algemene informatie bevat een duidelijke titel."
                                        >
                                            {crudObject['Titel'] !==
                                            undefined ? (
                                                <FormFieldTextInput
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Titel']
                                                    }
                                                    dataObjectProperty="Titel"
                                                    fieldLabel="Titel"
                                                    pValue="Beschrijf in een aantal woorden de titel van dit thema."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
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
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Omschrijving'
                                                        ]
                                                    }
                                                    fieldLabel="Omschrijving"
                                                    dataObjectProperty="Omschrijving"
                                                    pValue="Geef een korte omschrijving van dit thema."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </ContainerFormSection>

                                        <ContainerFormSection
                                            titel="Aanvullende informatie"
                                            beschrijving="In deze sectie vragen we aanvullende informatie zoals (indien bekend) de datum van inwerkingtreding."
                                        >
                                            {/* Weblink */}
                                            {crudObject['Weblink'] !==
                                            undefined ? (
                                                <FormFieldWeblink
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject['Weblink']
                                                    }
                                                    dataObjectProperty="Weblink"
                                                    fieldLabel="IDMS"
                                                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    addObjectLabel={true}
                                                />
                                            ) : null}

                                            {/* Geldigheid */}
                                            <div className="flex flex-wrap -mx-3">
                                                {/* Begin Geldigheid */}
                                                {crudObject[
                                                    'Begin_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
                                                        }
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
                                                {crudObject[
                                                    'Eind_Geldigheid'
                                                ] !== undefined ? (
                                                    <FormFieldDate
                                                        handleChange={
                                                            this.context
                                                                .handleChange
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

                                {/* Submit */}
                                <div className="fixed bottom-0 right-0 px-6">
                                    <div className="bg-white shadow px-4 py-4 inline-block rounded-t">
                                        <input
                                            id="form-submit"
                                            className="font-bold py-2 px-4 leading-tight text-sm rounded mbg-color text-white hover:underline"
                                            type="submit"
                                            value="Opslaan"
                                        ></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </ContainerMain>
            </React.Fragment>
        )
    }
}

ContainerCrudFields.contextType = APIcontext

export default ContainerCrudFields
