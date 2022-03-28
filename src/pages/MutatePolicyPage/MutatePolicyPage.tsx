import { Form, Formik, setIn } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import {
    getAmbitiesLineageid,
    getBelangenLineageid,
    getBeleidsdoelenLineageid,
    getBeleidskeuzesLineageid,
    getBeleidsmodulesLineageid,
    getBeleidsprestatiesLineageid,
    getBeleidsregelsLineageid,
    getMaatregelenLineageid,
    getThemasLineageid,
    getVerordeningenLineageid,
} from '@/api/fetchers'
import {
    AmbitiesRead,
    VerordeningenRead,
    BeleidskeuzesRead,
    BeleidsmodulesRead,
} from '@/api/fetchers.schemas'
import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { ContainerMain } from '@/components/Container'
import allDimensies from '@/constants/dimensies'
import { checkIfUserIsAllowedOnPage } from '@/utils/checkIfUserIsAllowedOnPage'
import {
    createEmptyWriteObject,
    possibleWriteObjects,
    getWriteObjectProperties,
} from '@/utils/createEmptyWriteObject'
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

const getFetcherForLineage = (
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR']
) => {
    switch (titleSingular) {
        case 'Ambitie':
            return getAmbitiesLineageid
        case 'Belang':
            return getBelangenLineageid
        case 'Beleidskeuze':
            return getBeleidskeuzesLineageid
        case 'Beleidsregel':
            return getBeleidsregelsLineageid
        case 'Beleidsprestatie':
            return getBeleidsprestatiesLineageid
        case 'Beleidsmodule':
            return getBeleidsmodulesLineageid
        case 'Beleidsdoel':
            return getBeleidsdoelenLineageid
        case 'Maatregel':
            return getMaatregelenLineageid
        case 'Thema':
            return getThemasLineageid
        case 'Verordening':
            return getVerordeningenLineageid
    }
}

type filteredDimensieConstants = Exclude<
    typeof allDimensies[keyof typeof allDimensies],
    | typeof allDimensies['VERORDENINGSARTIKEL']
    | typeof allDimensies['BELEIDSRELATIES']
>

interface MutatePolicyPageProps {
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
    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titlePlural = dimensieConstants.TITLE_PLURAL

    const objectSlugOverviewPage = dimensieConstants.SLUG_OVERVIEW
    const [initialValues, setInitialValues] = useState<possibleWriteObjects>(
        createEmptyWriteObject(titleSingular)
    )

    const dataLoaded = true
    const editStatus = true
    const handleFormSubmit = (values: possibleWriteObjects) => {
        console.log(typeof values.Begin_Geldigheid)
    }

    /** Get and set data if the user is editing an existing object */
    useEffect(() => {
        const getLineageFromApi = async (objectID: number) => {
            const fetcherForLineage = getFetcherForLineage(titleSingular)
            if (!fetcherForLineage) return
            try {
                const data = await fetcherForLineage(objectID)
                redirectIfUserIsNotAllowed(data[0], authUser, history)
                return data
            } catch (err) {
                console.log(err)
            }
        }

        const getObjectFromLineage = (
            lineage: Array<
                | AmbitiesRead
                | VerordeningenRead
                | BeleidskeuzesRead
                | BeleidsmodulesRead
            >
        ) => {
            const isMaatregelOrBeleidskeuze =
                titleSingular === 'Beleidskeuze' ||
                titleSingular === 'Maatregel'

            const isWijzigVigerendOrOntwerpMaken =
                (modus && modus === 'wijzig_vigerend') ||
                (modus && modus === 'ontwerp_maken')

            if (isWijzigVigerendOrOntwerpMaken) {
                return lineage.find(
                    e => 'Status' in e && e.Status === 'Vigerend'
                )
            } else if (isMaatregelOrBeleidskeuze) {
                return lineage.find(
                    e => 'Aanpassing_Op' in e && e.Aanpassing_Op === null
                )
            } else {
                return lineage[0]
            }
        }

        const createWriteObjectFromReadObject = (
            readObject:
                | AmbitiesRead
                | VerordeningenRead
                | BeleidskeuzesRead
                | BeleidsmodulesRead
        ) => {
            const writeProperties = getWriteObjectProperties(titleSingular)
            const writeObject: { [key: string]: any } = {}
            writeProperties.forEach(property => {
                writeObject[property] = readObject[property]
            })
            return writeObject
        }

        const formatObjectForForm = (writeObject: possibleWriteObjects) => {
            return formatGeldigheidDatesForUI(writeObject)
        }

        const getAndSetInitialValuesFromDatabase = async (objectID: number) => {
            const lineage = await getLineageFromApi(objectID)
            if (!lineage) return

            const readObjectFromLineage = getObjectFromLineage(lineage)
            if (!readObjectFromLineage) return

            const writeObject = createWriteObjectFromReadObject(
                readObjectFromLineage
            )
            if (!writeObject) return

            const formattedWriteObject = formatObjectForForm(writeObject)

            setInitialValues(formattedWriteObject)
        }

        if (objectID) {
            getAndSetInitialValuesFromDatabase(parseInt(objectID))
        }
    }, [objectID, titleSingular, authUser, history, modus])

    return (
        <div>
            <ContainerCrudHeader
                dataLoaded={dataLoaded}
                objectTitle={initialValues?.Titel || ''}
                editStatus={editStatus}
                titelMeervoud={titlePlural}
                overzichtSlug={objectSlugOverviewPage || ''}
                titleSingular={titleSingular}
                objectID={objectID}
            />
            <ContainerMain className="mt-16">
                <Formik
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
