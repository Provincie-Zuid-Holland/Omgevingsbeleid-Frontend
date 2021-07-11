import React from 'react'

/**
 *
 * @param {object} currentBeleidsmodule - Contains the beleidsmodule the user is viewing
 * @param {array} policies - Array containing all the policies that are in the currentBeleidsmodule
 * @returns Component that displays the amount of policies in the beleidsmodule
 */
function ModuleAmount({ currentBeleidsmodule, policies }) {
    return (
        <div className="px-6">
            <div
                className="block w-full px-3 py-2 my-4 rounded-md bg-pzh-blue-dark"
                style={{
                    backgroundColor: 'RGBA(39, 174, 96, 0.1)',
                }}
            >
                In de module '{currentBeleidsmodule.Titel}'{' '}
                {policies.length === 1 ? 'zit' : 'zitten'}{' '}
                <span className="font-bold">
                    {policies.length} beleidsstukken
                </span>
            </div>
        </div>
    )
}

export default ModuleAmount
