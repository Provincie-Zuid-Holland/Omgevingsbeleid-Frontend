import { Form, Formik, FormikProps } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import {
    VerordeningenWrite,
    ThemasWrite,
    MaatregelenWrite,
    BeleidsregelsWrite,
    BeleidsprestatiesWrite,
    BeleidsmodulesWrite,
    BeleidskeuzesWrite,
    BeleidsdoelenWrite,
    BelangenWrite,
    AmbitiesWrite,
} from '@/api/fetchers.schemas'
import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { ContainerMain } from '@/components/Container'
import allDimensies from '@/constants/dimensies'
import { checkIfUserIsAllowedOnPage } from '@/utils/checkIfUserIsAllowedOnPage'
import { createEmptyWriteObject } from '@/utils/createEmptyWriteObject'
import { createWriteObjectFromReadObject } from '@/utils/createWriteObjectFromReadObject'
import formatGeldigheidDatesForAPI from '@/utils/formatGeldigheidDatesForAPI'
import formatGeldigheidDatesForUI from '@/utils/formatGeldigheidDatesForUI'
import {
    getFetcherForLineage,
    getMutationForLineage,
} from '@/utils/getFetchers'
import { getLatestObjectFromLineage } from '@/utils/getLatestObjectFromLineage'
import { toastNotification } from '@/utils/toastNotification'

import ContainerCrudHeader from './../MuteerUniversalObjectCRUD/ContainerCrudHeader'
// import FormFieldContainerAmbities from './../MuteerUniversalObjectCRUD/FormFieldContainers/FormFieldContainerAmbities'
import FieldsAmbities from './Fields/FieldsAmbities'

type filteredDimensieConstants = Exclude<
    typeof allDimensies[keyof typeof allDimensies],
    | typeof allDimensies['VERORDENINGSARTIKEL']
    | typeof allDimensies['BELEIDSRELATIES']
>

type PossibleWriteObjects =
    | ThemasWrite
    | MaatregelenWrite
    | BeleidsregelsWrite
    | BeleidsprestatiesWrite
    | BeleidsmodulesWrite
    | BeleidskeuzesWrite
    | BeleidsdoelenWrite
    | BelangenWrite
    | AmbitiesWrite

export interface MutatePolicyPageProps {
    authUser: any
    dimensieConstants: filteredDimensieConstants
}

const redirectIfUserIsNotAllowed = (
    objFromApi: any,
    authUser: any,
    history: any
) => {
    /** Check if user is allowed */
    const isUserAllowed = checkIfUserIsAllowedOnPage({
        object: objFromApi,
        authUser,
    })
    if (!isUserAllowed) {
        toastNotification({
            type: 'user is not authenticated for this page',
        })
        history.push('/muteer/dashboard')
    }
}

const MutatePolicyPage = ({
    authUser,
    dimensieConstants,
}: MutatePolicyPageProps) => {
    const { single: objectID, modus } =
        useParams<{ single: string; modus: string | undefined }>()
    const history = useHistory()
    const formRef = useRef<FormikProps<PossibleWriteObjects>>(null)

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titlePlural = dimensieConstants.TITLE_PLURAL
    const objectSlugOverviewPage = dimensieConstants.SLUG_OVERVIEW

    const useGetLineage = getFetcherForLineage(titleSingular)
    const useMutateLineage = getMutationForLineage(titleSingular)
    const { isLoading: lineageIsLoading, data: lineage } = useGetLineage(
        parseInt(objectID)
    )
    const mutateLineage = useMutateLineage({
        mutation: {
            onError: (error, formState, context) => {
                // An error happened!
                console.log(`rolling back optimistic update with id`)
            },
            onSuccess: (data, formState, context) => {
                // Boom baby!
            },
        },
    })

    const [initialValues, setInitialValues] = useState<PossibleWriteObjects>(
        createEmptyWriteObject(titleSingular)
    )

    const dataLoaded = !lineageIsLoading
    const editStatus = true
    const handleFormSubmit = (formState: PossibleWriteObjects) => {
        const formattedFormState = formatGeldigheidDatesForAPI(formState)
        mutateLineage.mutate({
            lineageid: parseInt(objectID),
            data: formattedFormState,
        })
    }

    /** Get the object from the lineage and set it in state  */
    useEffect(() => {
        if (!lineage) return

        redirectIfUserIsNotAllowed(lineage[0], authUser, history)

        const readObjectFromLineage = getLatestObjectFromLineage(
            lineage,
            titleSingular,
            modus
        )
        if (!readObjectFromLineage) return

        const writeObject = createWriteObjectFromReadObject(
            readObjectFromLineage,
            titleSingular
        )
        if (!writeObject) return

        const formattedWriteObject = formatGeldigheidDatesForUI(writeObject)

        setInitialValues(formattedWriteObject)
    }, [lineage, authUser, history, modus, titleSingular])

    return (
        <Formik
            innerRef={formRef}
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={handleFormSubmit}>
            {({ values }) => (
                <>
                    <ContainerCrudHeader
                        dataLoaded={dataLoaded}
                        objectTitle={values?.Titel || ''}
                        editStatus={editStatus}
                        titelMeervoud={titlePlural}
                        overzichtSlug={objectSlugOverviewPage || ''}
                        titleSingular={titleSingular}
                        objectID={objectID}
                    />
                    <ContainerMain className="mt-16">
                        <Form className="w-full">
                            {titleSingular === 'Ambitie' ? (
                                <FieldsAmbities />
                            ) : null}
                            <ButtonSubmitFixed
                                submit={() => handleFormSubmit(values)}
                            />
                        </Form>
                    </ContainerMain>
                </>
            )}
        </Formik>
    )
}

export default MutatePolicyPage
