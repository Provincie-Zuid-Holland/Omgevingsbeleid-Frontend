/**
 * @prop {string} activeTab contains the name of the current active tab
 * @prop {string} tabName contains the name of this tab
 * @prop {function} setActiveTab function to change the active tab
 * @prop {boolean} showLength if true show the length of the arrayLength
 * @prop {integer} arrayLength length of relation array, needed to show the length in a notification
 */

interface SwitchToTabbladButtonProps {
    activeTab: string
    tabName: string
    setActiveTab: (tabName: string) => void
    showLength?: boolean
    arrayLength?: number
}

function SwitchToTabbladButton({
    activeTab,
    tabName,
    setActiveTab,
    showLength,
    arrayLength,
}: SwitchToTabbladButtonProps) {
    const tabbladTitle = tabName.charAt(0).toUpperCase() + tabName.slice(1)
    const isActive = activeTab === tabName
    const showNotification = showLength && arrayLength

    return (
        <li
            className={`py-1 px-5 text-lg text-pzh-blue relative inline-block font-bold border-pzh-blue ${
                isActive
                    ? 'border-b-2'
                    : 'cursor-pointer hover:border-b-2 hover:border-opacity-20'
            }
            ${showNotification ? 'pr-8' : ''}`}
            onClick={() => {
                if (isActive) return
                setActiveTab(tabName)
            }}
            data-testid="SwitchToTabbladButton test li">
            {tabbladTitle}
            {showNotification ? (
                <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 py-1 ml-2 text-sm text-white rounded-full bg-pzh-green text-bold">
                    <span className="mt-1">{arrayLength}</span>
                </div>
            ) : null}
        </li>
    )
}

export default SwitchToTabbladButton
