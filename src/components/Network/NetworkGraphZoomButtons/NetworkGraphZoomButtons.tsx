import { Plus, Minus } from '@pzh-ui/icons'

export interface NetworkGraphZoomButtonsProps {}

function NetworkGraphZoomButtons({}: NetworkGraphZoomButtonsProps) {
    return (
        <div className="flex flex-col items-end border rounded-md">
            <button
                className="p-3 bg-white border-b rounded-t-md text-pzh-blue-dark hover:bg-gray-50"
                id="d3-zoom-in"
                type="button">
                <Plus />
            </button>
            <button
                className="p-3 bg-white rounded-b-md text-pzh-blue-dark hover:bg-gray-50"
                id="d3-zoom-out"
                type="button">
                <Minus />
            </button>
        </div>
    )
}

export default NetworkGraphZoomButtons
