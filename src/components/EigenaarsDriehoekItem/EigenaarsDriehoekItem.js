import React, { Component } from 'react'

const EigenaarsDriehoekItem = ({ UUID, eigenaarType }) => {
    return (
        <div className="w-full p-2 mb-2 bg-white rounded shadow-md">
            <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 mr-2 rounded-full bg-secondary">
                    {UUID ? (
                        <span className="text-xl font-bold text-white">
                            {UUID.Gebruikersnaam.substring(0, 1).toUpperCase()}
                        </span>
                    ) : null}
                </div>
                <div>
                    <span className="block text-sm text-gray-700">
                        {eigenaarType}
                    </span>
                    <span className="block text-sm font-bold text-gray-800">
                        {UUID ? UUID.Gebruikersnaam : null}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default EigenaarsDriehoekItem
