import React from "react"
import { Link } from "react-router-dom"

import getDimensionsConstants from "./../../../utils/getDimensionsConstants"

function getExcerpt(text) {
    if (!text) {
        return ""
    } else if (text.length > 250) {
        return text.substring(0, 250) + "..."
    } else {
        return text
    }
}

function SearchResultItem({ item, searchQuery }) {
    function getContent() {
        const params = new URLSearchParams(
            document.location.search.substring(1)
        )

        // Get everything past the '=' of '?query=artikel'
        const query = params.get("query")

        const omschrijving = item.Omschrijving
            ? getExcerpt(item.Omschrijving)
            : ""

        const markedOmschrijving = omschrijving.replace(
            new RegExp(query, "g"),
            `<mark class="marked-red">${query}</mark>`
        )

        return {
            setInnerHTML: true,
            content: {
                __html: markedOmschrijving,
            },
        }
    }

    const content = {
        Titel: item.Titel,
        Omschrijving: getContent(),
    }

    const type = item.Type
    const dimensieContants = getDimensionsConstants(type)
    const overzichtURL = dimensieContants.SLUG_OVERVIEW
    const titleSingular = dimensieContants.TITLE_SINGULAR

    // Fallback for verordeningsitems that have not been found in the vigerende structure
    if (
        (item &&
            item.positionInStructure &&
            item.positionInStructure[0] === null) ||
        (item &&
            item.positionInStructure &&
            item.positionInStructure.length === 0)
    ) {
        return null
    }

    return (
        <li
            className={`py-4 md:pr-8 transition-colors duration-100 ease-in bg-white border-gray-300 group`}
            key={item.UUID}
        >
            <Link
                className="group"
                to={
                    item.Type === "Verordeningen"
                        ? `/detail/verordeningen/1/${item.UUID}?hoofdstuk=${
                              item.positionInStructure[0] !== undefined
                                  ? item.positionInStructure[0]
                                  : "null"
                          }&nest_1=${
                              item.positionInStructure[1] !== undefined
                                  ? item.positionInStructure[1]
                                  : "null"
                          }&nest_2=${
                              item.positionInStructure[2] !== undefined
                                  ? item.positionInStructure[2]
                                  : "null"
                          }&nest_3=${
                              item.positionInStructure[3] !== undefined
                                  ? item.positionInStructure[3]
                                  : "null"
                          }#${searchQuery}`
                        : `/detail/${overzichtURL}/${item.UUID}#${searchQuery}`
                }
            >
                <span
                    className="block text-sm opacity-75 text-pzh-blue"
                    data-test="search-result-type"
                >
                    {titleSingular}
                </span>
                <h2 className="block mt-1 text-lg font-bold group-hover:text-pzh-green text-pzh-blue group-hover:underline">
                    {content.Titel}
                </h2>
                {content.Omschrijving.setInnerHTML ? (
                    <p
                        className="mt-2"
                        dangerouslySetInnerHTML={content.Omschrijving.content}
                    ></p>
                ) : content.Omschrijving.content &&
                  content.Omschrijving.content.length > 0 ? (
                    <p className="mt-2">{content.Omschrijving.content}</p>
                ) : (
                    <p className="mt-2 italic">
                        Er is nog geen omschrijving voor deze
                        {" " + titleSingular.toLowerCase()}
                    </p>
                )}
            </Link>
        </li>
    )
}

export default SearchResultItem
