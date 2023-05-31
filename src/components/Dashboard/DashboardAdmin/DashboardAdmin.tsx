import { Badge, Button, Heading, Text } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useModulesGet } from '@/api/fetchers'
import { Module } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import * as models from '@/config/objects'
import { Model } from '@/config/objects/types'
import getModuleStatusColor from '@/utils/getModuleStatusColor'

const DashboardAdmin = () => {
    const navigate = useNavigate()

    const { data: modules, isLoading: modulesLoading } = useModulesGet({
        only_active: false,
        only_mine: false,
    })

    const sortedModules = useMemo(
        () => modules?.sort((a, b) => Number(a.Closed) - Number(b.Closed)),
        [modules]
    )

    return (
        <div className="grid grid-cols-6">
            <div className="col-span-6 lg:col-span-3 mb-4">
                <Heading as="2" level="3" className="mb-3">
                    Onderdelen
                </Heading>
                <Text type="body">
                    Als beheerder kan je alle onderdelen van het digitaal
                    omgevingsbeleid inzien en waar nodig aanpassen. Hieronder
                    vind je een lijst van de onderdelen die voor jou als
                    beheerder relevant zijn.
                </Text>
            </div>
            <div className="col-span-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-4">
                    {Object.keys(models).map(key => {
                        const model = models[key as keyof typeof models]

                        return <ModelTile key={`model-${key}`} model={model} />
                    })}
                </div>

                <div className="mt-10">
                    <div className="mb-4 flex items-center justify-between">
                        <Heading as="2" level="3">
                            Modules
                        </Heading>
                        <Button
                            variant="cta"
                            size="small"
                            onPress={() => navigate('/muteer/modules/nieuw')}
                            data-testid="dashboard-new-module">
                            Nieuwe module
                        </Button>
                    </div>

                    <div className="grid grid-cols-8 px-3 py-2">
                        <div className="col-span-5">
                            <Text type="body-bold">Titel</Text>
                        </div>
                        <div className="col-span-3">
                            <Text type="body-bold">Status</Text>
                        </div>
                    </div>

                    <div className="w-full h-px mb-3 bg-pzh-blue" />

                    <div className="grid grid-cols-1 gap-y-2">
                        {modulesLoading ? (
                            <>
                                <LoaderCard height="62" mb="" />
                                <LoaderCard height="62" mb="" />
                                <LoaderCard height="62" mb="" />
                            </>
                        ) : (
                            sortedModules?.map(module => (
                                <ModuleTile
                                    key={`module-${module.Module_ID}`}
                                    {...module}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const ModelTile = ({ model }: { model: Model }) => {
    const { icon: Icon, plural, pluralCapitalize } = model.defaults

    return (
        <Link to={`/muteer/${plural}`} data-testid="dashboard-model-tile">
            <div className="flex items-center justify-between px-5 py-4 border border-pzh-gray-200 rounded-[4px] group">
                <div className="flex items-center">
                    <Icon size={20} className="mr-3 text-pzh-blue" />
                    <Heading as="3" level="4" className="-mb-[6px]">
                        {pluralCapitalize}
                    </Heading>
                </div>
                <div className="transition group-hover:translate-x-1">
                    <AngleRight size={18} className="text-pzh-green" />
                </div>
            </div>
        </Link>
    )
}

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

export default DashboardAdmin
