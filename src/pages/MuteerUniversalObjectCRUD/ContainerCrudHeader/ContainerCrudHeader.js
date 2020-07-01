import React from 'react'
import { withRouter } from 'react-router-dom'

import ButtonBackToPage from './../../../components/ButtonBackToPage'
import LoaderMainTitle from '../../../components/LoaderMainTitle'

function ContainerCrudHeader(props) {
    let mainTitle = ''

    if (props.editStatus && props.dataLoaded) {
        // Als de gebruiker een bestaand object bewerkt
        mainTitle = props.objectTitel
    } else {
        // Als de gebruiker een nieuw object aanmaakt
        mainTitle = `Voeg een nieuwe ${props.titelEnkelvoud.toLowerCase()} toe`
    }

    // if (
    //     props.editStatus &&
    //     props.titelEnkelvoud.toLowerCase() !== 'beleidsregel'
    // ) {
    //     mainTitle = `Wijzig een ${props.titelEnkelvoud.toLowerCase()}`
    // } else if (
    //     !props.editStatus &&
    //     props.titelEnkelvoud.toLowerCase() !== 'beleidsregel'
    // ) {
    //     mainTitle = `Voeg een nieuwe ${props.titelEnkelvoud.toLowerCase()} toe`
    // } else if (
    //     props.editStatus &&
    //     props.titelEnkelvoud.toLowerCase() === 'beleidsregel'
    // ) {
    //     mainTitle = `Beheer ${props.titelEnkelvoud.toLowerCase()}`
    // } else if (
    //     !props.editStatus &&
    //     props.titelEnkelvoud.toLowerCase() === 'beleidsregel'
    // ) {
    //     mainTitle = `Voeg een nieuwe ${props.titelEnkelvoud.toLowerCase()} toe`
    // }

    return (
        <div className="relative w-full px-6 py-24 mbg-color edit-header">
            <div className="container flex items-center justify-center mx-auto lg:px-10">
                <div className="w-full pr-20">
                    {props.editStatus === false ? (
                        props.location.hash === '#mijn-beleid' ? (
                            <ButtonBackToPage
                                terugNaar={props.titelMeervoud.toLowerCase()}
                                color="text-white"
                                url={`/muteer/mijn-beleid`}
                            />
                        ) : (
                            <ButtonBackToPage
                                terugNaar={props.titelMeervoud.toLowerCase()}
                                color="text-white"
                                url={`/muteer/${props.overzichtSlug}`}
                            />
                        )
                    ) : props.location.hash === '#mijn-beleid' ? (
                        <ButtonBackToPage
                            terugNaar={props.titelEnkelvoud.toLowerCase()}
                            color="text-white"
                            url={`/muteer/${props.overzichtSlug}/${props.objectID}#mijn-beleid`}
                        />
                    ) : (
                        <ButtonBackToPage
                            terugNaar={props.titelEnkelvoud.toLowerCase()}
                            color="text-white"
                            url={`/muteer/${props.overzichtSlug}/${props.objectID}`}
                        />
                    )}

                    {props.dataLoaded ? (
                        <h1 className="text-4xl font-semibold text-white">
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
