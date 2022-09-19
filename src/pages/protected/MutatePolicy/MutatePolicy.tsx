import { Form, Formik, FormikProps } from 'formik'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { useSearchParam } from 'react-use'
import { reach, SchemaDescription } from 'yup'

import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { ContainerMain } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import policyObjects from '@/constants/policyObjects'
import { AuthContext } from '@/context/AuthContext'
import { useFullMutateRights } from '@/hooks/useFullMutateRights'
import { MutateReadObjects, MutateWriteObjects } from '@/types/dimensions'
import { createWriteObjectFromReadObject } from '@/utils/createWriteObjectFromReadObject'
import formatConnectionsForAPI from '@/utils/formatConnectionsForAPI'
import formatDatesForAPI from '@/utils/formatDatesForAPI'
import formatGeldigheidDatesForUI from '@/utils/formatGeldigheidDatesForUI'
import formatWerkingsgebiedenForWrite from '@/utils/formatWerkingsgebiedenForWrite'
import { getLatestObjectFromLineage } from '@/utils/getLatestObjectFromLineage'
import scrollToFormikError from '@/utils/scrollToFormikError'
import setAanpassingOpValue from '@/utils/setAanpassingOpValue'
import setCorrectStatus from '@/utils/setCorrectStatus'
import { toastNotification } from '@/utils/toastNotification'

import FieldsAmbities from './Fields/FieldsAmbities'
import FieldsBelang from './Fields/FieldsBelang'
import FieldsBeleidsdoel from './Fields/FieldsBeleidsdoel'
import FieldsBeleidskeuze from './Fields/FieldsBeleidskeuze'
import FieldsBeleidsmodule from './Fields/FieldsBeleidsmodule'
import FieldsBeleidsprestatie from './Fields/FieldsBeleidsprestatie'
import FieldsBeleidsregel from './Fields/FieldsBeleidsregel'
import FieldsGebiedsprogramma from './Fields/FieldsGebiedsprogramma'
import FieldsMaatregel from './Fields/FieldsMaatregel'
import FieldsThema from './Fields/FieldsThema'
import MutateContext from './MutateContext'
import MutatePolicyHeading from './MutatePolicyHeading'

export interface MutatePolicyPageProps {
    policyConstants: typeof policyObjects[keyof typeof policyObjects]
}

const MutatePolicy = ({ policyConstants }: MutatePolicyPageProps) => {
    const navigate = useNavigate()
    const formRef = useRef<FormikProps<MutateWriteObjects>>(null)
    const { single: objectID } = useParams<{ single: string | undefined }>()
    const modus = useSearchParam('modus')
    const { user } = useContext(AuthContext)

    const titleSingular = policyConstants.META.title.singular
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
            return emptyWriteObject as MutateWriteObjects
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
        const formattedFormState = formatConnectionsForAPI(
            formatWerkingsgebiedenForWrite(
                formatDatesForAPI(formState) as MutateReadObjects
            ) as MutateReadObjects,
            titleSingular
        )

        if (!formattedFormState) return

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

        let writeObject = createWriteObjectFromReadObject(
            readObjectFromLineage,
            titleSingular
        )
        writeObject = setAanpassingOpValue(writeObject, titleSingular, modus)
        writeObject = setCorrectStatus(writeObject, modus)
        writeObject = formatGeldigheidDatesForUI(writeObject)

        if (!writeObject) return

        setInitialValues(writeObject)
    }, [lineage, user, navigate, modus, titleSingular])

    const isRequired = (field: string) =>
        (
            reach(policyConstants.SCHEMA, field).describe() as SchemaDescription
        )?.tests?.some(test => test.name === 'required')

    return (
        <MutateContext.Provider
            value={{
                userHasFullMutateRights,
                isVigerend,
                hideAdditionalInfo,
                isRequired,
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
                            policyObjectMeta={policyConstants.META}
                            userIsEditing={!!objectID}
                            isLoading={lineageIsLoading}
                            objectTitle={values?.Titel || ''}
                        />
                        <ContainerMain className="mt-8">
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
                                ) : titleSingular === 'gebiedsprogramma' ? (
                                    <FieldsGebiedsprogramma />
                                ) : titleSingular === 'beleidsprestatie' ? (
                                    <FieldsBeleidsprestatie />
                                ) : titleSingular === 'thema' ? (
                                    <FieldsThema />
                                ) : null}
                                <ButtonSubmitFixed
                                    scrollToError={() => {
                                        scrollToFormikError(errors, formRef)
                                    }}
                                    disabled={!isValid}
                                    submit={() => {
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
