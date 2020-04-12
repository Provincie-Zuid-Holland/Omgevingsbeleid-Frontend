import React, { Component } from 'react'

function DndTitle({ item, hoofdstukVolgnummer, subVolgnummer }) {
    const volgnummer = item.Volgnummer
    console.log(item)
    return (
        <div>
            <span
                className={`font-semibold block pl-5 py-3
            ${
                item.Type === 'Afdeling'
                    ? 'mbg-color mbg-color-darker-hover text-white'
                    : ''
            } 
            ${item.Type === 'Paragraaf' ? 'text-blood-red' : ''}`}
            >
                {item.Type === 'Afdeling' ? `Afdeling ${volgnummer} - ` : ''}
                {item.Type === 'Paragraaf' ? `§ ${volgnummer} ` : ''}
                {item.Type === 'Artikel' ? `Artikel ${volgnummer} ` : ''}

                {item.Titel}
            </span>

            <p className="block pb-3 pl-5 whitespace-pre-line">{item.Inhoud}</p>
        </div>
    )
}

DndTitle.propTypes = {}

DndTitle.defaultProps = {}

export default DndTitle
