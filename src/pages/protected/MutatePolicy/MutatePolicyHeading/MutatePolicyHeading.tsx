import { useLocation, useParams } from 'react-router-dom'

import ButtonBackToPage from '@/components/ButtonBackToPage'
import { LoaderMainTitle } from '@/components/Loader'

export interface MutatePolicyHeadingProps {
    userIsEditing?: boolean
    isLoading?: boolean
    objectTitle: string
    titleSingular: string
    overzichtSlug: string
    titlePlural: string
}

function MutatePolicyHeading({
    userIsEditing,
    isLoading,
    objectTitle,
    titleSingular,
    overzichtSlug,
    titlePlural,
}: MutatePolicyHeadingProps) {
    const { single: objectID } = useParams<{ single: string }>()
    const location = useLocation()

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

    const getBackUrl = () => {
        if (!objectID && location.hash === '#mijn-beleid') {
            // User is creating a new object and came from his/her own beleid
            return `/muteer/mijn-beleid`
        } else if (!objectID && location.hash !== '#mijn-beleid') {
            // User is creating a new object and came from an overview page
            return `/muteer/${overzichtSlug}`
        } else if (objectID && location.hash === '#mijn-beleid') {
            // User is editing an existing object and came from a detail page from his/her own beleid
            return `/muteer/${overzichtSlug}/${objectID}#mijn-beleid`
        } else if (objectID) {
            // User is editing an existing object and came from an detail page
            return `/muteer/${overzichtSlug}/${objectID}`
        } else {
            // Fallback
            return `/muteer/${overzichtSlug}`
        }
    }

    const mainTitle = getMainTitle()
    const backUrl = getBackUrl()

    return (
        <div className="relative w-full px-6 py-24 bg-pzh-blue edit-header">
            <div className="container flex items-center justify-center mx-auto lg:px-10">
                <div className="w-full pr-20">
                    <ButtonBackToPage
                        terugNaar={titlePlural.toLowerCase()}
                        color="text-white"
                        url={backUrl}
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
