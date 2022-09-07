import { useLocation, useParams } from 'react-router-dom'

import ButtonBackToPage from '@/components/ButtonBackToPage'
import { LoaderMainTitle } from '@/components/Loader'
import { PolicyObjectsMeta } from '@/constants/policyObjects'

export interface MutatePolicyHeadingProps {
    policyObjectMeta: PolicyObjectsMeta
    userIsEditing?: boolean
    isLoading?: boolean
    objectTitle: string
}

function MutatePolicyHeading({
    policyObjectMeta,
    userIsEditing,
    isLoading,
    objectTitle,
}: MutatePolicyHeadingProps) {
    const { single: objectID } = useParams<{ single: string }>()
    const location = useLocation()
    const titleSingular = policyObjectMeta.title.singular
    const titlePlural = policyObjectMeta.title.plural
    const overviewSlug = policyObjectMeta.slug.overview

    const getMainTitle = () => {
        if (titleSingular === 'Beleidsmodule' && !userIsEditing) {
            return 'Voeg een nieuwe module toe'
        } else if (titleSingular === 'Beleidsmodule' && userIsEditing) {
            return 'Bewerk module'
        } else if (!isLoading && objectTitle !== '') {
            return objectTitle
        } else if (!isLoading && objectTitle === '') {
            return `Voeg een nieuwe ${titleSingular.toLowerCase()} toe`
        } else {
            return ''
        }
    }

    const generateSlugPreviousPage = () => {
        if (titleSingular === 'Beleidskeuze' || titleSingular === 'Maatregel') {
            if (!userIsEditing && location.hash === '#mijn-beleid') {
                // User is creating a new object and came from his/her own beleid
                return `/muteer/mijn-beleid`
            } else if (!userIsEditing && location.hash !== '#mijn-beleid') {
                // User is creating a new object and came from an overview page
                return `/muteer/${overviewSlug}`
            } else if (userIsEditing && location.hash === '#mijn-beleid') {
                // User is editing an existing object and came from a detail page from his/her own beleid
                return `/muteer/${overviewSlug}/${objectID}#mijn-beleid`
            } else if (userIsEditing) {
                // User is editing an existing object and came from an detail page
                return `/muteer/${overviewSlug}/${objectID}`
            } else {
                return `/muteer/${overviewSlug}`
            }
        } else {
            if (location.hash === '#mijn-beleid') {
                return `/muteer/mijn-beleid`
            } else {
                return `/muteer/${overviewSlug}`
            }
        }
    }

    const mainTitle = getMainTitle()
    const previousPageSlug = generateSlugPreviousPage()

    return (
        <div className="relative w-full px-6 py-24 bg-pzh-blue edit-header">
            <div className="container flex items-center justify-center mx-auto lg:px-10">
                <div className="w-full pr-20">
                    <ButtonBackToPage
                        terugNaar={titlePlural.toLowerCase()}
                        color="text-white"
                        url={previousPageSlug}
                    />
                    {isLoading ? (
                        <LoaderMainTitle />
                    ) : (
                        <h1 className="text-4xl font-bold text-white">
                            {mainTitle}
                        </h1>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MutatePolicyHeading
