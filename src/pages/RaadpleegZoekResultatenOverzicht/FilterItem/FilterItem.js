import React from "react"

import Text from "./../../../components/Text"

import getDimensionsConstants from "./../../../utils/getDimensionsConstants"

const FilterItem = ({ handleFilter, checked, item, count }) => {
    const dimensieContants = getDimensionsConstants(item)
    const titleSingular = dimensieContants.TITLE_SINGULAR

    const capitilizeFirstCharacter = () =>
        titleSingular.charAt(0).toUpperCase() + titleSingular.slice(1)

    const getItemTitle = (item) => {
        return item === "Verordeningen"
            ? "Artikelen"
            : capitilizeFirstCharacter()
    }
    const itemTitle = getItemTitle(item)

    return (
        <li key={item} className="mt-1 text-pzh-blue-dark">
            <label
                className="flex items-center cursor-pointer select-none"
                id={`filter-for-${titleSingular}`}
            >
                <input
                    className="mr-2 leading-tight text-indigo-600 cursor-pointer text-pzh-green hover:text-pzh-green-dark form-checkbox"
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleFilter(e)}
                    name={item}
                />
                <Text type="span" className="pt-1">
                    {itemTitle} ({count})
                </Text>
            </label>
        </li>
    )
}

export default FilterItem
