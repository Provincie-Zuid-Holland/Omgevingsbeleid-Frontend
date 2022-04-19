import { Form, Formik, FormikProps } from 'formik'
import { useEffect, useContext, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, useHistory } from 'react-router-dom'
import { useSearchParam } from 'react-use'

import { GetTokeninfo200Identifier } from '@/api/fetchers.schemas'
import UserContext from '@/App/UserContext'
import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { ContainerMain } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import allDimensies from '@/constants/dimensies'
import { MutateWriteObjects, MutateReadObjects } from '@/types/dimensions'
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
import setAanpassingOpValue from '@/utils/setAanpassingOpValue'
import setCorrectStatus from '@/utils/setCorrectStatus'
import { toastNotification } from '@/utils/toastNotification'
import { useFullMutateRights } from '@/utils/useFullMutateRights'

import FieldsAmbities from './Fields/FieldsAmbities'
import FieldsBelang from './Fields/FieldsBelang'
import FieldsBeleidsdoel from './Fields/FieldsBeleidsdoel'
import FieldsBeleidskeuze from './Fields/FieldsBeleidskeuze'
import FieldsBeleidsmodule from './Fields/FieldsBeleidsmodule'
import FieldsBeleidsprestatie from './Fields/FieldsBeleidsprestatie'
import FieldsBeleidsregel from './Fields/FieldsBeleidsregel'
import FieldsMaatregel from './Fields/FieldsMaatregel'
import FieldsThema from './Fields/FieldsThema'
import MutateContext from './MutateContext'
import MutatePolicyHeading from './MutatePolicyHeading'

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
    const { single: objectID } = useParams<{ single: string | undefined }>()
    const modus = useSearchParam('modus')
    const { user } = useContext(UserContext)

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titlePlural = dimensieConstants.TITLE_PLURAL
    const objectSlugOverviewPage = dimensieConstants.SLUG_OVERVIEW

    const [initialValues, setInitialValues] = useState<MutateWriteObjects>(
        createEmptyWriteObject(titleSingular)
    )

    const userHasFullMutateRights = useFullMutateRights(user, initialValues)
    const isVigerend =
        'Status' in initialValues && initialValues.Status === 'Vigerend'

    const useGetLineage = getFetcherForPolicyLineage(titleSingular)
    const useMutatePolicyLineage = getMutationForPolicyLineage(titleSingular)
    const usePostPolicy = getPostForPolicy(titleSingular)
    const { isLoading: lineageIsLoading, data: lineage } = useGetLineage(
        parseInt(objectID!)
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

    const handleFormSubmit = (formState: MutateWriteObjects) => {
        const formattedFormState = formatConnectionsForAPI(
            formatDatesForAPI(formState) as MutateReadObjects,
            titleSingular
        )

        if (!formattedFormState) return

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

        setInitialValues({
            ...setAanpassingOpValue(
                setCorrectStatus(
                    formatGeldigheidDatesForUI(writeObject),
                    modus
                ),
                titleSingular,
                modus
            ),
        })
    }, [lineage, authUser, history, modus, titleSingular])

    return (
        <MutateContext.Provider
            value={{
                userHasFullMutateRights,
                isVigerend,
                hideAdditionalInfo:
                    user?.Rol !== 'Beheerder' &&
                    user?.Rol !== 'Functioneel beheerder' &&
                    user?.Rol !== 'Technisch beheerder' &&
                    user?.Rol !== 'Superuser',
            }}>
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={handleFormSubmit}>
                {({ values }) => (
                    <>
                        {lineageIsLoading ? <LoaderContent /> : null}
                        <Helmet>
                            <title>
                                {objectID
                                    ? `Omgevingsbeleid - ${values?.Titel || ''}`
                                    : `Omgevingsbeleid - Voeg een nieuwe ${titleSingular} toe`}
                            </title>
                        </Helmet>
                        <MutatePolicyHeading
                            userIsEditing={!!objectID}
                            isLoading={lineageIsLoading}
                            objectTitle={values?.Titel || ''}
                            titleSingular={titleSingular}
                            overzichtSlug={objectSlugOverviewPage || ''}
                            titlePlural={titlePlural}
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
                                ) : null}
                                <ButtonSubmitFixed
                                    submit={() => handleFormSubmit(values)}
                                />
                            </Form>
                        </ContainerMain>
                    </>
                )}
            </Formik>
        </MutateContext.Provider>
    )
}

export default MutatePolicyPage
