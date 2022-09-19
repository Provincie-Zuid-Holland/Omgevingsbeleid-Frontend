import { FormikDate, FormikInput, FormikRte } from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useContext } from 'react'

import { GebiedsprogrammasWrite } from '@/api/fetchers.schemas'
import { ContainerFormSection } from '@/components/Container'
import FormikRelationConnection from '@/components/Form/FormikRelationConnection'
import FormikSelectUserGroup from '@/components/Form/FormikSelectUserGroup'
import FormSpacer from '@/components/Form/FormSpacer'
import FormikImage from '@/components/FormikImage'

import MutateContext from '../../MutateContext'

export interface FieldsGebiedsprogrammaProps {}

function FieldsGebiedsprogramma({}: FieldsGebiedsprogrammaProps) {
    const { values } = useFormikContext<GebiedsprogrammasWrite>()
    const {
        userHasFullMutateRights,
        isVigerend,
        hideAdditionalInfo,
        isRequired,
    } = useContext(MutateContext)

    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel en eigenaren.">
                <FormikInput
                    label="Titel"
                    required={isRequired('Titel')}
                    description="Formuleer in enkele woorden de titel van het gebiedsprogramma."
                    name="Titel"
                    type="text"
                    disabled={isVigerend}
                />
                <FormikSelectUserGroup
                    className="mt-6"
                    disabled={isVigerend && !userHasFullMutateRights}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving gebiedsprogramma"
                beschrijving="Beschrijving van het gebied en een visuele presentatie.">
                <FormikRte
                    testId="formik-rte-omschrijving"
                    disabled={isVigerend}
                    label="Omschrijving"
                    description="Geef een beschrijving op van het gebiedsprogramma. Denk hierbij aan een omschrijving van de ligging."
                    name="Omschrijving"
                />
                <FormSpacer />
                <FormikImage name="Afbeelding" label="Afbeelding van gebied" />
            </ContainerFormSection>
            <ContainerFormSection
                titel="Koppelingen"
                beschrijving="De belangrijkste onderdelen in een gebiedsprogramma zijn de maatregelen. In dit gedeelte kunnen de maatregelen worden gekoppeld aan dit gebiedsprogramma.">
                <FormikRelationConnection
                    disabled={isVigerend}
                    placeholderTekst="Er is nog geen maatregel gekoppeld."
                    buttonTekst="Nieuwe koppeling"
                    titelMainObject={values['Titel'] || ''}
                    dataObjectProperty="Maatregelen"
                    label="Koppelingen"
                    description="Geef aan welke maatregelen onderdeel zijn van dit gebiedsprogramma."
                    titleSingular="Gebiedsprogramma"
                    connectionProperties={['maatregelen']}
                    crudObject={values}
                />
            </ContainerFormSection>

            <ContainerFormSection
                hide={hideAdditionalInfo}
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie die bij het gebiedsprogramma hoort.">
                <FormikDate
                    disabled={isVigerend}
                    name="Begin_Geldigheid"
                    label="Inwerkingtreding"
                    placeholder="dd-mm-jjjj"
                    description="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                    optimized={false}
                    required={isRequired('Begin_Geldigheid')}
                />
                <FormSpacer />
                <FormikDate
                    optimized={false}
                    disabled={isVigerend}
                    name="Eind_Geldigheid"
                    required={isRequired('Eind_Geldigheid')}
                    label="Uitwerkingtreding"
                    placeholder="dd-mm-jjjj"
                    description="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                />
            </ContainerFormSection>
        </>
    )
}

export default FieldsGebiedsprogramma
