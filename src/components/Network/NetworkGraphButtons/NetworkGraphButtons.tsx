import { Divider } from '@pzh-ui/components'
import { Plus, Minus, RotateLeft } from '@pzh-ui/icons'
import classNames from 'classnames'

import useNetworkStore from '@/store/networkStore'

const NetworkGraphButtons = () => {
    const activeNode = useNetworkStore(state => state.activeNode)

    return (
        <div className="absolute right-5 top-5">
            <div className="flex flex-col shadow-card rounded-[4px] overflow-hidden">
                <button
                    className="w-8 h-8 flex items-center justify-center bg-white text-pzh-blue-dark hover:bg-pzh-gray-100"
                    data-d3="zoom-in"
                    type="button">
                    <Plus />
                    <span className="sr-only">Inzoomen</span>
                </button>
                <Divider className="my-0" />
                <button
                    className="w-8 h-8 flex items-center justify-center bg-white text-pzh-blue-dark hover:bg-pzh-gray-100"
                    data-d3="zoom-out"
                    type="button">
                    <Minus />
                    <span className="sr-only">Uitzoomen</span>
                </button>
            </div>

            <button
                data-d3="reset"
                className={classNames(
                    'mt-2 w-8 h-8 flex items-center justify-center rounded-[4px] shadow-card bg-pzh-red text-pzh-white hover:bg-pzh-red-dark',
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
