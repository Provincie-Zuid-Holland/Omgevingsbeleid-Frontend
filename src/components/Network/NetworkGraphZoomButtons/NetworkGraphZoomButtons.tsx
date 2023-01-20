import { faPlus, faMinus } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface NetworkGraphZoomButtonsProps {}

function NetworkGraphZoomButtons({}: NetworkGraphZoomButtonsProps) {
    return (
        <div className="flex flex-col items-end border rounded-md">
            <button
                className="px-3 py-1 bg-white border-b rounded-t-md text-pzh-blue-dark hover:bg-gray-50"
                id="d3-zoom-in"
                type="button">
                <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
                className="px-3 py-1 bg-white rounded-b-md text-pzh-blue-dark hover:bg-gray-50"
                id="d3-zoom-out"
                type="button">
                <FontAwesomeIcon icon={faMinus} />
            </button>
        </div>
    )
}

export default NetworkGraphZoomButtons
