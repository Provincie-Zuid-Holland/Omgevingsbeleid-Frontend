import { Button, Heading } from '@pzh-ui/components'
import { PlusLight } from '@pzh-ui/icons'

const VersionAdd = () => {
    return (
        <Button
            variant="default"
            className="flex h-16 w-full border-b border-pzh-gray-200 bg-pzh-gray-100 last:border-b-0 focus:ring-2 focus:ring-inset focus:ring-pzh-blue-100">
            <div className="flex h-[inherit] w-5/12 items-center border-r border-pzh-gray-200 pl-10 pr-6">
                <div className="flex h-[inherit] w-full border-l border-pzh-gray-200 pl-10">
                    <div className="flex w-full items-center justify-between border-l border-pzh-gray-200 pl-[67px]">
                        <div className="flex items-center gap-4">
                            <PlusLight
                                size={20}
                                className="text-pzh-green-500"
                            />
                            <Heading
                                level="3"
                                size="s"
                                color="text-pzh-green-500"
                                className="-mb-1">
                                Nieuwe versie
                            </Heading>
                        </div>
                    </div>
                </div>
            </div>
        </Button>
    )
}

export default VersionAdd
