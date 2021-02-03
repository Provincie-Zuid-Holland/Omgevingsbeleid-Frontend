import React, { Component } from 'react'

function DndTitle({ item, hoofdstukVolgnummer, subVolgnummer }) {
    const volgnummer = item.Volgnummer

    const getStylesBasedOnType = () => {
        switch (item.Type) {
            case 'Afdeling':
                return 'mbg-color mbg-color-darker-hover text-white'
            case 'Paragraaf':
                return 'text-blood-red'
            default:
                return ''
        }
    }

    const getTitlePrepend = () => {
        switch (item.Type) {
            case 'Afdeling':
                return `Afdeling ${volgnummer} - `
            case 'Paragraaf':
                return `§ ${volgnummer} `
            case 'Artikel':
                return `Artikel ${volgnummer} `
            default:
                return null
        }
    }

    return (
        <div>
            <span
                className={`font-semibold block pl-5 py-3 ${getStylesBasedOnType()}`}
            >
                {getTitlePrepend()}

                {item.Titel}
            </span>

            <p className="block pb-3 pl-5 whitespace-pre-line">{item.Inhoud}</p>
        </div>
    )
}

export default DndTitle
