import React from 'react'

/**
 * @prop {string} activeTab contains the name of the current active tab
 * @prop {string} tabName contains the name of this tab
 * @prop {function} setActiveTab function to change the active tab
 * @prop {boolean} showLength if true show the length of the arrayLength
 * @prop {integer} arrayLength length of relation array, needed to show the length in a notification
 */
function SwitchToTabbladButton({
    activeTab,
    tabName,
    setActiveTab,
    showLength,
    arrayLength,
}) {
    const tabbladTitle = tabName.charAt(0).toUpperCase() + tabName.slice(1)
    const isActive = activeTab === tabName
    const showNotification = showLength && arrayLength

    return (
        <li
            className={`py-1 px-5 text-lg text-pzh-blue inline-block font-bold border-pzh-blue ${
                isActive ? 'border-b-2' : 'cursor-pointer hover:border-b-2'
            }`}
            onClick={() => {
                if (isActive) return
                setActiveTab(tabName)
            }}
        >
            {tabbladTitle}
            {showNotification ? (
                <span className="px-2 py-1 ml-2 text-sm text-white bg-pzh-green rounded-full text-bold">
                    {arrayLength}
                </span>
            ) : null}
        </li>
    )
}

export default SwitchToTabbladButton
