import { Badge, Heading } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import { Module } from '@/api/fetchers.schemas'
import { getModuleStatusColor } from '@/utils/module'

const ModuleTile = ({ Title, Status, Module_ID, Closed }: Module) => {
    const Wrapper = Closed ? 'div' : Link

    return (
        <Wrapper
            to={!Closed ? `/muteer/modules/${Module_ID}` : ''}
            data-testid="dashboard-module-tile">
            <div className="group grid grid-cols-8 rounded border border-pzh-gray-200 p-4">
                <div className="order-1 col-span-7 flex items-center sm:col-span-5">
                    <Heading level="3" size="s">
                        {Title}
                    </Heading>
                </div>
                <div className="order-3 col-span-8 mt-2 sm:order-2 sm:col-span-2 sm:mt-0">
                    <Badge
                        text={Status?.Status.replace('-', ' ') || ''}
                        variant={getModuleStatusColor(Status?.Status)}
                        upperCase={false}
                        className="-mt-1 whitespace-nowrap"
                    />
                </div>
                {!Closed && (
                    <div className="order-2 col-span-1 flex items-center justify-end sm:order-3">
                        <div className="transition group-hover:translate-x-1">
                            <AngleRight size={18} className="text-pzh-green" />
                        </div>
                    </div>
                )}
            </div>
        </Wrapper>
    )
}

export default ModuleTile
