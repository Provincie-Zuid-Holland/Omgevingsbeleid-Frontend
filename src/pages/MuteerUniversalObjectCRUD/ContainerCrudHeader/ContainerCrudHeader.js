import React from 'react'
import { withRouter, useLocation } from 'react-router-dom'

import ButtonBackToPage from './../../../components/ButtonBackToPage'
import LoaderMainTitle from '../../../components/LoaderMainTitle'

function ContainerCrudHeader({
    editStatus,
    dataLoaded,
    objectTitle,
    titleSingular,
    overzichtSlug,
    objectID,
    titelMeervoud,
}) {
    const location = useLocation()

    const getMainTitle = () => {
        if (editStatus && dataLoaded) {
            // Als de gebruiker een bestaand object bewerkt
            return objectTitle
        } else if (dataLoaded) {
            // Als de gebruiker een nieuw object aanmaakt
            return `Voeg een nieuwe ${titleSingular.toLowerCase()} toe`
        } else {
            return ''
        }
    }

    const getBackUrl = () => {
        if (!editStatus && location.hash === '#mijn-beleid') {
            // User is creating a new object and came from his/her own beleid
            return `/muteer/mijn-beleid`
        } else if (!editStatus && location.hash !== '#mijn-beleid') {
            // User is creating a new object and came from an overview page
            return `/muteer/${overzichtSlug}`
        } else if (editStatus && location.hash === '#mijn-beleid') {
            // User is editing an existing object and came from a detail page from his/her own beleid
            return `/muteer/${overzichtSlug}/${objectID}#mijn-beleid`
        } else if (editStatus) {
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
                        terugNaar={titelMeervoud.toLowerCase()}
                        color="text-white"
                        url={backUrl}
                    />

                    {dataLoaded ? (
                        <h1 className="text-4xl font-bold text-white">
                            {mainTitle}
                        </h1>
                    ) : (
                        <LoaderMainTitle />
                    )}
                </div>
            </div>
        </div>
    )
}

export default withRouter(ContainerCrudHeader)
