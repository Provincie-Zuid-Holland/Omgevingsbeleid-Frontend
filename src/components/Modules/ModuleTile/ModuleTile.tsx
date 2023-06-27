import { Badge, Heading } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import { Module } from '@/api/fetchers.schemas'
import getModuleStatusColor from '@/utils/getModuleStatusColor'

const ModuleTile = ({ Title, Status, Module_ID, Closed }: Module) => {
    const Wrapper = Closed ? 'div' : Link

    return (
        <Wrapper
            to={!Closed ? `/muteer/modules/${Module_ID}` : ''}
            data-testid="dashboard-module-tile">
            <div className="grid grid-cols-8 px-3 py-2 border border-pzh-gray-200 rounded-[4px] group">
                <div className="col-span-5">
                    <Heading as="3" level="4" className="-mb-[6px]">
                        {Title}
                    </Heading>
                </div>
                <div className="col-span-2">
                    <Badge
                        text={Status?.Status.replace('-', ' ') || ''}
                        variant={getModuleStatusColor(Status?.Status)}
                        upperCase={false}
                        className="-mt-1"
                    />
                </div>
                {!Closed && (
                    <div className="col-span-1 flex items-center justify-end">
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
