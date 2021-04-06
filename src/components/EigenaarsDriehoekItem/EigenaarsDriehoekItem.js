import React from 'react'

const EigenaarsDriehoekItem = ({ owner, eigenaarType }) => {
    if (!owner) return null

    return (
        <div className="w-full p-2 mb-2 bg-white rounded shadow-md">
            <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mr-2 border-2 border-gray-200 rounded-full bg-pzh-blue">
                    {owner ? (
                        <span className="mt-1 text-xl font-bold text-white">
                            {owner.Gebruikersnaam.substring(0, 1).toUpperCase()}
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
