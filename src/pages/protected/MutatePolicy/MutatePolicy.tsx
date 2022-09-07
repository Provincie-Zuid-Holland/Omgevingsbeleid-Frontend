import { Form, Formik, FormikProps, yupToFormErrors } from 'formik'
import cloneDeep from 'lodash.clonedeep'
import { useEffect, useContext, useRef, useState, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'
import { useSearchParam } from 'react-use'

import {
    AmbitiesWrite,
    GetTokeninfo200Identifier,
} from '@/api/fetchers.schemas'
import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { ContainerMain } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import { filteredDimensieConstants } from '@/constants/dimensies'
// import { AMBITIES } from '@/constants/policyObjects'
import * as policyObjects from '@/constants/policyObjects'
import { AuthContext } from '@/context/AuthContext'
import { useFullMutateRights } from '@/hooks/useFullMutateRights'
import useIsWijzigVigerend from '@/hooks/useIsWijzigVigerend'
import { MutateWriteObjects, MutateReadObjects } from '@/types/dimensions'
import checkContainsRequiredUnfilledField from '@/utils/checkContainsRequiredUnfilledField'
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
import scrollToFormikError from '@/utils/scrollToFormikError'
import setAanpassingOpValue from '@/utils/setAanpassingOpValue'
import setCorrectStatus from '@/utils/setCorrectStatus'
import { toastNotification } from '@/utils/toastNotification'
import validateFormikValues from '@/utils/validateFormikValues'

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

export interface MutatePolicyPageProps {
    dimensieConstants?: filteredDimensieConstants
    policyConstants: typeof policyObjects[keyof typeof policyObjects]
}

const MutatePolicy = ({
    dimensieConstants,
    policyConstants,
}: MutatePolicyPageProps) => {
    const navigate = useNavigate()
    const formRef = useRef<FormikProps<MutateWriteObjects>>(null)
    const { single: objectID } = useParams<{ single: string | undefined }>()
    const modus = useSearchParam('modus')
    const { user } = useContext(AuthContext)

    // TODO: Refactor into formik check
    const isWijzigVigerend = useIsWijzigVigerend()

    // const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titleSingular = policyConstants.META.title.singular
    const titlePlural = policyConstants.META.title.plural
    const objectSlugOverviewPage = policyConstants.META.slug.overview
    const emptyWriteObject = policyConstants.EMPTY_WRITE_OBJECT
    const useGetLineage = policyConstants.META.query.useGetLineage
    const useMutatePolicyLineage = policyConstants.META.query.usePatchLineage
    const usePostPolicy = policyConstants.META.query.usePost

    const [initialValues, setInitialValues] = useState<MutateWriteObjects>(
        () => {
            if ('Status' in emptyWriteObject) {
                emptyWriteObject.Status = 'Ontwerp GS Concept'
            }
            return emptyWriteObject
        }
    )

    const userHasFullMutateRights = useFullMutateRights(user, initialValues)
    const isVigerend =
        'Status' in initialValues && initialValues.Status === 'Vigerend'

    const hideAdditionalInfo = useMemo(
        () =>
            user?.Rol !== 'Beheerder' &&
            user?.Rol !== 'Functioneel beheerder' &&
            user?.Rol !== 'Technisch beheerder' &&
            user?.Rol !== 'Superuser',
        [user]
    )

    const { isLoading: lineageIsLoading, data: lineage } = useGetLineage(
        parseInt(objectID!),
        undefined,
        {
            query: {
                cacheTime: 0,
            },
        }
    )

    const mutatePolicyLineage = useMutatePolicyLineage({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: data => {
                navigate(
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
                navigate(
                    `/muteer/${objectSlugOverviewPage}/${data.ID}${
                        location.hash === '#mijn-beleid' ? '#mijn-beleid' : ''
                    }`
                )
                toastNotification({ type: 'saved' })
            },
        },
    })

    const handleFormSubmit = (formState: MutateWriteObjects) => {
        // TODO: Remove this as it is now checked with the Yup schema
        // if (
        //     checkContainsRequiredUnfilledField(
        //         formState,
        //         dimensieConstants,
        //         isWijzigVigerend
        //     )
        // ) {
        //     return
        // }

        const formattedFormState = formatConnectionsForAPI(
            formatDatesForAPI(formState) as MutateReadObjects,
            titleSingular
        )
        console.log('1')
        if (!formattedFormState) return
        console.log('2')

        if (objectID) {
            mutatePolicyLineage.mutate({
                lineageid: parseInt(objectID),
                data: formattedFormState,
            })
        } else {
            postPolicy.mutate({ data: formattedFormState })
        }
    }

    /** Get the object from the lineage and set it in state  */
    useEffect(() => {
        if (!lineage) return

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

        setInitialValues(
            setAanpassingOpValue(
                setCorrectStatus(
                    formatGeldigheidDatesForUI(writeObject),
                    modus
                ),
                titleSingular,
                modus
            )
        )
    }, [lineage, user, navigate, modus, titleSingular])

    return (
        <MutateContext.Provider
            value={{
                userHasFullMutateRights,
                isVigerend,
                hideAdditionalInfo,
            }}>
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={policyConstants.SCHEMA}
                onSubmit={handleFormSubmit}
                enableReinitialize
                validateOnMount>
                {({ errors, values, isValid }) => (
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
                                {titleSingular === 'ambitie' ? (
                                    <FieldsAmbities />
                                ) : titleSingular === 'beleidsmodule' ? (
                                    <FieldsBeleidsmodule />
                                ) : titleSingular === 'belang' ? (
                                    <FieldsBelang />
                                ) : titleSingular === 'beleidsregel' ? (
                                    <FieldsBeleidsregel />
                                ) : titleSingular === 'beleidskeuze' ? (
                                    <FieldsBeleidskeuze />
                                ) : titleSingular === 'maatregel' ? (
                                    <FieldsMaatregel />
                                ) : titleSingular === 'beleidsdoel' ? (
                                    <FieldsBeleidsdoel />
                                ) : titleSingular === 'beleidsprestatie' ? (
                                    <FieldsBeleidsprestatie />
                                ) : titleSingular === 'thema' ? (
                                    <FieldsThema />
                                ) : null}
                                <ButtonSubmitFixed
                                    submit={() => {
                                        console.log({ isValid, errors, values })
                                        if (isValid) {
                                            handleFormSubmit(values)
                                        } else {
                                            scrollToFormikError(errors, formRef)
                                        }
                                    }}
                                />
                            </Form>
                        </ContainerMain>
                    </>
                )}
            </Formik>
        </MutateContext.Provider>
    )
}

export default MutatePolicy
