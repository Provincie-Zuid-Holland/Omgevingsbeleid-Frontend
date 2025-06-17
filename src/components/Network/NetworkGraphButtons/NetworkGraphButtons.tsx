import { Button, Divider } from '@pzh-ui/components'
import { Minus, Plus, RotateLeft } from '@pzh-ui/icons'
import classNames from 'clsx'

import useNetworkStore from '@/store/networkStore'

const NetworkGraphButtons = () => {
    const activeNode = useNetworkStore(state => state.activeNode)

    return (
        <div className="absolute top-5 right-5">
            <div className="shadow-card flex flex-col rounded-md">
                <Button
                    variant="default"
                    size="small"
                    className="bg-pzh-white text-pzh-blue-900 hover:bg-pzh-gray-100 flex h-10 w-10 items-center justify-center rounded-t-md"
                    data-d3="zoom-in">
                    <Plus />
                    <span className="sr-only">Inzoomen</span>
                </Button>
                <Divider className="my-0" />
                <Button
                    variant="default"
                    className="bg-pzh-white text-pzh-blue-900 hover:bg-pzh-gray-100 flex h-10 w-10 items-center justify-center rounded-b-md"
                    data-d3="zoom-out">
                    <Minus />
                    <span className="sr-only">Uitzoomen</span>
                </Button>
            </div>

            <Button
                variant="default"
                data-d3="reset"
                className={classNames(
                    'bg-pzh-red-500 text-pzh-white shadow-card hover:bg-pzh-red-900 mt-2 flex h-10 w-10 items-center justify-center rounded',
                    {
                        hidden: !!!activeNode,
                    }
                )}>
                <RotateLeft />
                <span className="sr-only">Resetten</span>
            </Button>
        </div>
    )
}

export default NetworkGraphButtons
