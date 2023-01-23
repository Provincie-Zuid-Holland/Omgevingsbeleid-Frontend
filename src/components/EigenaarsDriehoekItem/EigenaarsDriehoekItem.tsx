/**
 * Displays an item within the EigenaarsDriehoek component.
 * It receives the variables owner and eigenaarType and uses the owner variable in a conditionary operator to check if it contains value and to set the second part of the Gebruikersnaam in uppercase and in furter to display the Gebruikersnaam fully.
 * The eigenaarType variable is used to display what kind of owner the owner variable is linked to.
 * This component is used by the component EigenaarsDriehoek.
 *
 * @param {object} owner - Contains the collection of information of the owner.
 * @param {string} eigenaarType - Displays the type of owner in the component.
 */

import { GebruikerInline } from '@/api/fetchers.schemas'

interface EigenaarsDriehoekItem {
    owner: GebruikerInline
    eigenaarType?: string
}

const EigenaarsDriehoekItem = ({
    owner,
    eigenaarType,
}: EigenaarsDriehoekItem) => {
    if (!owner) return null

    return (
        <div className="w-full p-2 mb-2 bg-white rounded shadow-md">
            <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mr-2 border-4 border-gray-200 rounded-full bg-pzh-blue">
                    {owner ? (
                        <span className="text-xl font-bold text-white">
                            {owner.Gebruikersnaam?.substring(
                                0,
                                1
                            ).toUpperCase()}
                        </span>
                    ) : null}
                </div>
                <div>
                    <span className="block text-sm text-gray-700">
                        {eigenaarType}
                    </span>
                    <span className="block text-sm font-bold text-gray-800">
                        {owner ? owner.Gebruikersnaam : null}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default EigenaarsDriehoekItem
