import { Divider } from '@pzh-ui/components'
import { Minus, Plus, RotateLeft } from '@pzh-ui/icons'
import classNames from 'clsx'

import useNetworkStore from '@/store/networkStore'

const NetworkGraphButtons = () => {
    const activeNode = useNetworkStore(state => state.activeNode)

    return (
        <div className="absolute right-5 top-5">
            <div className="flex flex-col overflow-hidden rounded shadow-card">
                <button
                    className="flex h-8 w-8 items-center justify-center bg-pzh-white text-pzh-blue-900 hover:bg-pzh-gray-100"
                    data-d3="zoom-in"
                    type="button">
                    <Plus />
                    <span className="sr-only">Inzoomen</span>
                </button>
                <Divider className="my-0" />
                <button
                    className="flex h-8 w-8 items-center justify-center bg-pzh-white text-pzh-blue-900 hover:bg-pzh-gray-100"
                    data-d3="zoom-out"
                    type="button">
                    <Minus />
                    <span className="sr-only">Uitzoomen</span>
                </button>
            </div>

            <button
                data-d3="reset"
                className={classNames(
                    'mt-2 flex h-8 w-8 items-center justify-center rounded bg-pzh-red-500 text-pzh-white shadow-card hover:bg-pzh-red-900',
                    {
                        hidden: !!!activeNode,
                    }
                )}
                type="button">
                <RotateLeft />
                <span className="sr-only">Resetten</span>
            </button>
        </div>
    )
}

export default NetworkGraphButtons
