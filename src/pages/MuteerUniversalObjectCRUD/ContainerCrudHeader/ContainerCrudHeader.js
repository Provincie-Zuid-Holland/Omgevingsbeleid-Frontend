import React from 'react'

import ButtonBackToPage from './../../../components/ButtonBackToPage'

function ContainerCrudHeader(props) {
    let mainTitle = ''

    if (
        props.editStatus &&
        props.titelEnkelvoud.toLowerCase() !== 'beleidsregel'
    ) {
        mainTitle = `Wijzig een ${props.titelEnkelvoud.toLowerCase()}`
    } else if (
        !props.editStatus &&
        props.titelEnkelvoud.toLowerCase() !== 'beleidsregel'
    ) {
        mainTitle = `Voeg een nieuwe ${props.titelEnkelvoud.toLowerCase()} toe`
    } else if (
        props.editStatus &&
        props.titelEnkelvoud.toLowerCase() === 'beleidsregel'
    ) {
        mainTitle = `Beheer ${props.titelEnkelvoud.toLowerCase()}`
    } else if (
        !props.editStatus &&
        props.titelEnkelvoud.toLowerCase() === 'beleidsregel'
    ) {
        mainTitle = `Voeg een nieuwe ${props.titelEnkelvoud.toLowerCase()} toe`
    }

    return (
        <div className="w-full py-24 px-6 mbg-color edit-header relative">
            <div className="lg:px-10 container mx-auto flex justify-center items-center">
                <div className="w-full pr-20">
                    {props.editStatus === false ? (
                        <ButtonBackToPage
                            terugNaar={props.titelMeervoud.toLowerCase()}
                            color="text-white"
                            url={`/muteer/${props.overzichtSlug}`}
                        />
                    ) : (
                        <ButtonBackToPage
                            terugNaar={props.titelEnkelvoud.toLowerCase()}
                            color="text-white"
                            url={`/muteer/${props.overzichtSlug}/${props.objectID}`}
                        />
                    )}
                    <h1 className="text-4xl font-semibold text-white">
                        {mainTitle}
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default ContainerCrudHeader
