import { Form, Formik, FormikProps } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { GetTokeninfo200Identifier } from '@/api/fetchers.schemas'
import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { ContainerMain } from '@/components/Container'
import allDimensies from '@/constants/dimensies'
import { MutateWriteObjects } from '@/types/dimensions'
import { checkIfUserIsAllowedOnPage } from '@/utils/checkIfUserIsAllowedOnPage'
import { createEmptyWriteObject } from '@/utils/createEmptyWriteObject'
import { createWriteObjectFromReadObject } from '@/utils/createWriteObjectFromReadObject'
import formatConnectionsForAPI from '@/utils/formatConnectionsForAPI'
import formatDatesForAPI from '@/utils/formatDatesForAPI'
import formatGeldigheidDatesForUI from '@/utils/formatGeldigheidDatesForUI'
import {
    getFetcherForPolicyLineage,
    getMutationForPolicyLineage,
    getPostForPolicy,
} from '@/utils/getFetchers'
import { getLatestObjectFromLineage } from '@/utils/getLatestObjectFromLineage'
import { toastNotification } from '@/utils/toastNotification'

import ContainerCrudHeader from './../MuteerUniversalObjectCRUD/ContainerCrudHeader'
import FieldsAmbities from './Fields/FieldsAmbities'
import FieldsBelang from './Fields/FieldsBelang'
import FieldsBeleidsdoel from './Fields/FieldsBeleidsdoel'
import FieldsBeleidskeuze from './Fields/FieldsBeleidskeuze'
import FieldsBeleidsmodule from './Fields/FieldsBeleidsmodule'
import FieldsBeleidsprestatie from './Fields/FieldsBeleidsprestatie'
import FieldsBeleidsregel from './Fields/FieldsBeleidsregel'
import FieldsMaatregel from './Fields/FieldsMaatregel'
import FieldsThema from './Fields/FieldsThema'
import FieldsVerordening from './Fields/FieldsVerordening'

type filteredDimensieConstants = Exclude<
    typeof allDimensies[keyof typeof allDimensies],
    | typeof allDimensies['VERORDENINGSARTIKEL']
    | typeof allDimensies['BELEIDSRELATIES']
>
export interface MutatePolicyPageProps {
    dimensieConstants: filteredDimensieConstants
    authUser?: GetTokeninfo200Identifier
}

const redirectIfUserIsNotAllowed = (
    objFromApi: any,
    history: any,
    authUser?: GetTokeninfo200Identifier
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
    const history = useHistory()
    const formRef = useRef<FormikProps<MutateWriteObjects>>(null)
    const { single: objectID, modus } =
        useParams<{ single: string; modus: string | undefined }>()

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titlePlural = dimensieConstants.TITLE_PLURAL
    const objectSlugOverviewPage = dimensieConstants.SLUG_OVERVIEW

    const [initialValues, setInitialValues] = useState<MutateWriteObjects>(
        createEmptyWriteObject(titleSingular)
    )

    const useGetLineage = getFetcherForPolicyLineage(titleSingular)
    const useMutatePolicyLineage = getMutationForPolicyLineage(titleSingular)
    const usePostPolicy = getPostForPolicy(titleSingular)

    const { isLoading: lineageIsLoading, data: lineage } = useGetLineage(
        parseInt(objectID)
    )

    const mutatePolicyLineage = useMutatePolicyLineage({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: data => {
                history.push(
                    `/muteer/${objectSlugOverviewPage}/${data.ID}${
                        location.hash === '#mijn-beleid' ? '#mijn-beleid' : ''
                    }`
                )
                toastNotification({ type: 'saved' })
            },
        },
    })

    const postPolicy = usePostPolicy({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: data => {
                history.push(
                    `/muteer/${objectSlugOverviewPage}/${data.ID}${
                        location.hash === '#mijn-beleid' ? '#mijn-beleid' : ''
                    }`
                )
                toastNotification({ type: 'saved' })
            },
        },
    })

    const isLoading = lineageIsLoading
    const editStatus = true

    const handleFormSubmit = (formState: MutateWriteObjects) => {
        const formattedFormState = formatConnectionsForAPI(
            formatDatesForAPI(formState),
            titleSingular
        )

        if (objectID) {
            // PATCH Lineage
            mutatePolicyLineage.mutate({
                lineageid: parseInt(objectID),
                data: formattedFormState,
            })
        } else {
            // POST new policy
            postPolicy.mutate({ data: formattedFormState })
        }
    }

    /** Get the object from the lineage and set it in state  */
    useEffect(() => {
        if (!lineage) return

        redirectIfUserIsNotAllowed(lineage[0], history, authUser)

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
                        isLoading={isLoading}
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
                            ) : titleSingular === 'Beleidsmodule' ? (
                                <FieldsBeleidsmodule />
                            ) : titleSingular === 'Belang' ? (
                                <FieldsBelang />
                            ) : titleSingular === 'Beleidsregel' ? (
                                <FieldsBeleidsregel />
                            ) : titleSingular === 'Beleidskeuze' ? (
                                <FieldsBeleidskeuze />
                            ) : titleSingular === 'Maatregel' ? (
                                <FieldsMaatregel />
                            ) : titleSingular === 'Beleidsdoel' ? (
                                <FieldsBeleidsdoel />
                            ) : titleSingular === 'Beleidsprestatie' ? (
                                <FieldsBeleidsprestatie />
                            ) : titleSingular === 'Thema' ? (
                                <FieldsThema />
                            ) : titleSingular === 'Verordening' ? (
                                <FieldsVerordening />
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