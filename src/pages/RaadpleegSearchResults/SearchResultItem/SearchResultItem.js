import { Link } from "react-router-dom"
import { useSearchParam } from "react-use"
import getDimensionsConstants from "./../getDimensionsConstants"

const SearchResultItem = ({ item, searchQuery }) => {
    const paramTextQuery = useSearchParam("query")

    const highlightString = (text, query) => {
        if (!text || !query) {
            return null
        }

        const regex = new RegExp(query, "gi")
        return {
            __html: text.replace(
                regex,
                `<mark class="marked-red" data-testid="marker">$&</mark>`
            ),
        }
    }

    const content = {
        Titel: highlightString(item.Titel, paramTextQuery),
        Omschrijving: highlightString(item.Omschrijving, paramTextQuery),
    }

    const type = item.Type
    if (!type) return null

    const dimensieContants = getDimensionsConstants(type)
    const overzichtURL = dimensieContants.SLUG_OVERVIEW
    const titleSingular = dimensieContants.TITLE_SINGULAR

    return (
        <li
            className={`py-4 md:pr-8 transition-colors duration-100 ease-in bg-white border-gray-300 group`}
            key={item.UUID}
        >
            <Link
                className="group"
                to={`/detail/${overzichtURL}/${item.UUID}#${searchQuery}`}
            >
                <span
                    className="block text-sm opacity-75 text-pzh-blue"
                    data-test="search-result-type"
                >
                    {titleSingular}
                </span>
                {content.Titel ? (
                    <h2
                        className="block mt-1 text-lg font-bold group-hover:text-pzh-green text-pzh-blue group-hover:underline"
                        dangerouslySetInnerHTML={content.Titel}
                    />
                ) : null}
                {content.Omschrijving ? (
                    <p
                        className="mt-2 line-clamp-4"
                        dangerouslySetInnerHTML={content.Omschrijving}
                    />
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
