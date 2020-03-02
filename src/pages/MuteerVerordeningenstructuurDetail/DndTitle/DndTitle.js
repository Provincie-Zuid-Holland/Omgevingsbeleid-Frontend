import React, { Component } from 'react'

function DndTitle({ item, hoofdstukVolgnummer }) {
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
                {item.Type === 'Afdeling'
                    ? `Afdeling ${hoofdstukVolgnummer}.${item.Volgnummer} - `
                    : ''}
                {item.Type === 'Paragraaf'
                    ? `§ ${hoofdstukVolgnummer}.${item.Volgnummer} `
                    : ''}
                {item.Type === 'Artikel'
                    ? `Artikel ${hoofdstukVolgnummer}.${item.Volgnummer} `
                    : ''}

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
