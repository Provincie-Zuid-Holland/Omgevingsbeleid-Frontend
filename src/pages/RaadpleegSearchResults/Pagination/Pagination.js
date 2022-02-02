import React, { useState } from "react"
import { useSearchParam } from "react-use"

import axios from "../../../API/axios"
import LoaderSpinner from "../../../components/LoaderSpinner"

function Pagination({ searchResults, setSearchResults, setOnPageFilters }) {
    const [isLoading, setIsLoading] = useState(false)
    const [offset, setOffset] = useState(20)
    const [show, setShow] = useState(true)

    const paramTextQuery = useSearchParam("query")
    const paramOnly = useSearchParam("only")

    const getNewSearchResults = async () => {
        if (!paramTextQuery) return
        setIsLoading(true)
        // TODO: Replace with axios call
        const newSearchResults = await axios
            .get(
                `/search?query=${paramTextQuery}&offset=${offset}&limit=20${
                    paramOnly ? `&only=${paramOnly}` : ``
                }`
            )
            .then((res) => res.data)
        setOffset(offset + 20)
        setSearchResults([...searchResults, ...newSearchResults])
        setOnPageFilters({
            type: "updateFilters",
            searchResultItems: [...searchResults, ...newSearchResults],
        })
        setIsLoading(false)
        if (newSearchResults.length < 20) setShow(false)
    }

    if (!show) return null

    return (
        <div className="flex items-center justify-center mb-16">
            {isLoading ? (
                <div>
                    <LoaderSpinner />
                    <span className="ml-2">Resultaten worden geladen</span>
                </div>
            ) : (
                <button
                    className={`px-6 pt-2 pb-1 font-bold text-white transition-colors duration-100 ease-in rounded bg-pzh-blue hover:bg-pzh-blue-dark`}
                    onClick={getNewSearchResults}
                >
                    Meer resultaten Laden
                </button>
            )}
        </div>
    )
}

export default Pagination
