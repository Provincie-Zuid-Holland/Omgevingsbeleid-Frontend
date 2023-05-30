import { Badge, Button, Text, getHeadingStyles } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { Link, useNavigate } from 'react-router-dom'

import { useModulesGet } from '@/api/fetchers'
import { Module } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import * as models from '@/config/objects'
import { Model } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'
import getModuleStatusColor from '@/utils/getModuleStatusColor'

const DashboardAdmin = () => {
    const navigate = useNavigate()
    const { isMobile } = useBreakpoint()

    const { data: modules, isLoading: modulesLoading } = useModulesGet({
        only_active: false,
        only_mine: false,
    })

    return (
        <div className="grid grid-cols-6">
            <div className="col-span-6 lg:col-span-3 mb-4">
                <h2
                    className="mb-3 text-pzh-blue"
                    style={getHeadingStyles('3', isMobile)}>
                    Onderdelen
                </h2>
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
                        <h2
                            className="text-pzh-blue"
                            style={getHeadingStyles('3', isMobile)}>
                            Modules
                        </h2>
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
                            modules?.map(module => (
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
    const { isMobile } = useBreakpoint()

    const { icon: Icon, plural, pluralCapitalize } = model.defaults

    return (
        <Link to={`/muteer/${plural}`} data-testid="dashboard-model-tile">
            <div className="flex items-center justify-between px-5 py-4 border border-pzh-gray-200 rounded-[4px] group">
                <div className="flex items-center">
                    <Icon size={20} className="mr-3 text-pzh-blue" />
                    <h3
                        className="text-pzh-blue -mb-[6px]"
                        style={getHeadingStyles('4', isMobile)}>
                        {pluralCapitalize}
                    </h3>
                </div>
                <div className="transition group-hover:translate-x-1">
                    <AngleRight size={18} className="text-pzh-green" />
                </div>
            </div>
        </Link>
    )
}

const ModuleTile = ({ Title, Status, Module_ID, Closed }: Module) => {
    const { isMobile } = useBreakpoint()

    const Wrapper = Closed ? 'div' : Link

    return (
        <Wrapper
            to={!Closed ? `/muteer/modules/${Module_ID}` : ''}
            data-testid="dashboard-module-tile">
            <div className="grid grid-cols-8 px-3 py-2 border border-pzh-gray-200 rounded-[4px] group">
                <div className="col-span-5">
                    <h3
                        className="text-pzh-blue -mb-[6px]"
                        style={getHeadingStyles('4', isMobile)}>
                        {Title}
                    </h3>
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
