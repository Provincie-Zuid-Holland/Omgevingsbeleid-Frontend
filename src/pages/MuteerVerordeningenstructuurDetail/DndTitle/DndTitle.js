import React, { Component } from 'react'

function DndTitle({ item, hoofdstukVolgnummer, subVolgnummer }) {
    const volgnummer =
        subVolgnummer && item.Type !== 'Artikel'
            ? `${hoofdstukVolgnummer}.${subVolgnummer}.${item.Volgnummer}`
            : `${hoofdstukVolgnummer}.${item.Volgnummer}`

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

            {item.Inhoud ? (
                <p className="block pl-5 pb-3">{item.Inhoud}</p>
            ) : null}
        </div>
    )
}

DndTitle.propTypes = {}

DndTitle.defaultProps = {}

export default DndTitle
