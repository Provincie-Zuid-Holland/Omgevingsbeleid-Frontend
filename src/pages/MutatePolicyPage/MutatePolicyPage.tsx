import { Form, Formik, setIn } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { getAmbitiesLineageid } from '@/api/fetchers'
import { AmbitiesWrite } from '@/api/fetchers.schemas'
import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { ContainerFormSection, ContainerMain } from '@/components/Container'
import allDimensies from '@/constants/dimensies'
import { checkIfUserIsAllowedOnPage } from '@/utils/checkIfUserIsAllowedOnPage'
import formatGeldigheidDatesForAPI from '@/utils/formatGeldigheidDatesForAPI'
import formatGeldigheidDatesForUI from '@/utils/formatGeldigheidDatesForUI'
import { toastNotification } from '@/utils/toastNotification'

import ContainerCrudHeader from './../MuteerUniversalObjectCRUD/ContainerCrudHeader'
import FormFieldContainerAmbities from './../MuteerUniversalObjectCRUD/FormFieldContainers/FormFieldContainerAmbities'
import FieldsAmbities from './Fields/FieldsAmbities'

/**
 * Component receives 'authUser' and 'dimensieConstants' as properties
 *
 * # Broad To Do:
 * - Optional: Implement Yup for schema validation of form objects:
 *      https://github.com/jquense/yup
 *      https://react-hook-form.com/get-started#SchemaValidation
 *
 * Component needs to:
 * (1) Initialize the Component
 *  - [ ] Check if the user is editing or creating an object
 *      - If editing, get the object from the database
 *      - If creating, create a new object
 *
 * Functions needed:
 * (1) Initializing
 *     - IF formActionType === "creating":
 *         - Initialize object with empty object
 *
 */

/**
 * Idea: extract form value into a seperate reducerComponent
 */

const getFetcherForLineage = (titleSingular: 'Ambitie') => {
    switch (titleSingular) {
        case 'Ambitie':
            return getAmbitiesLineageid
        default:
            break
    }
}

interface MutatePolicyPageProps {
    authUser: any
    dimensieConstants: typeof allDimensies[keyof typeof allDimensies]
}

const generateInitialValues = (titleSingular: string) => {
    switch (titleSingular) {
        case 'Ambitie':
            const initialValuesAmbities: AmbitiesWrite = {
                Titel: '',
                Omschrijving: '',
                Weblink: '',
                Begin_Geldigheid: '',
                Eind_Geldigheid: '',
            }
            return initialValuesAmbities

        default:
            return {}
    }
}

const getObjectFromDatabase = async (
    objectID: number,
    titleSingular: string
) => {
    const fetcherForLineage = getFetcherForLineage('Ambitie')

    if (!fetcherForLineage) return

    try {
        const data = await fetcherForLineage(objectID)
        return data
    } catch (err) {
        console.log(err)
    }
}

const getInitialValuesFromResponse = (
    response: any,
    titleSingular: string,
    modus: string | undefined
) => {
    let crudObject = {}

    const isMaatregelOrBeleidskeuze =
        titleSingular === 'Maatregel' || titleSingular === 'Beleidskeuze'

    const isWijzigVigerendOrOntwerpMaken =
        (modus && modus === 'wijzig_vigerend') ||
        (modus && modus === 'ontwerp_maken')

    if (isMaatregelOrBeleidskeuze && isWijzigVigerendOrOntwerpMaken) {
        // Get the first object with a status of 'Vigerend'
        crudObject = response.find((e: any) => e.Status === 'Vigerend')
    } else if (
        titleSingular === 'Beleidskeuze' ||
        titleSingular === 'Maatregel'
    ) {
        crudObject = response.find((e: any) => e.Aanpassing_Op === null)
    } else {
        crudObject = response[0]
    }

    crudObject = formatGeldigheidDatesForUI(crudObject)
    createAndSetCrudObject(crudObject)
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
    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titlePlural = dimensieConstants.TITLE_PLURAL
    const objectSlugOverviewPage = dimensieConstants.SLUG_OVERVIEW

    const [initialValues, setInitialValues] = useState<AmbitiesWrite>(
        generateInitialValues(titleSingular)
    )

    const formRef = useRef<any>(null)
    const dataLoaded = true
    const editStatus = true
    const handleFormSubmit = (values: AmbitiesWrite) => {
        console.log(typeof values.Begin_Geldigheid)
    }

    useEffect(() => {
        if (objectID) {
            getObjectFromDatabase(parseInt(objectID), titleSingular).then(
                response => {
                    if (!response) return

                    redirectIfUserIsNotAllowed(response[0], authUser, history)

                    const initialValues = getInitialValuesFromResponse(
                        response,
                        titleSingular,
                        modus
                    )
                    setInitialValues(initialValues)
                }
            )
        }
    }, [objectID, titleSingular, authUser, modus, history])

    return (
        <div>
            <ContainerCrudHeader
                dataLoaded={dataLoaded}
                objectTitle={formRef.current?.values?.Titel || ''}
                editStatus={editStatus}
                titelMeervoud={titlePlural}
                overzichtSlug={objectSlugOverviewPage || ''}
                titleSingular={titleSingular}
                objectID={objectID}
            />
            <ContainerMain>
                <Formik
                    innerRef={formRef}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={handleFormSubmit}>
                    {({ values }) => (
                        <Form className="w-full">
                            {titleSingular === 'Ambitie' ? (
                                <FieldsAmbities />
                            ) : null}
                            <ButtonSubmitFixed
                                submit={() => handleFormSubmit(values)}
                            />
                        </Form>
                    )}
                </Formik>
            </ContainerMain>
        </div>
    )
}

export default MutatePolicyPage
