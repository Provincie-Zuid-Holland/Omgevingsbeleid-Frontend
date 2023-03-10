import {
    Badge,
    Breadcrumbs,
    Divider,
    Heading,
    Hyperlink,
    Text,
} from '@pzh-ui/components'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useModulesModuleIdGet, useUsersGet } from '@/api/fetchers'
import Avatar from '@/components/Avatar'
import { LoaderContent } from '@/components/Loader'
import ModuleInactiveCard from '@/components/Modules/ModuleInactiveCard'
import ModuleItem from '@/components/Modules/ModuleItem'
import ModuleLock from '@/components/Modules/ModuleLock'
import {
    ModuleActivateModal,
    ModuleContentsModal,
} from '@/components/Modules/ModuleModals'
import ModuleLockModal from '@/components/Modules/ModuleModals/ModuleLockModal'
import { ModuleModalActions } from '@/components/Modules/ModuleModals/types'
import ModuleTimeline from '@/components/Modules/ModuleTimeline'
import ModuleVersionCard from '@/components/Modules/ModuleVersionCard'
import MutateLayout from '@/templates/MutateLayout'
import getModuleStatusColor from '@/utils/getModuleStatusColor'
import * as modules from '@/validation/modules'

const ModuleDetail = () => {
    const { id } = useParams()
    const pathName = location.pathname || ''

    const [moduleModal, setModuleModal] = useState<ModuleModalActions>({
        isOpen: false,
    })

    const {
        data: {
            Module: module,
            Objects: objects,
            StatusHistory: statusHistory,
        } = {},
        isLoading,
    } = useModulesModuleIdGet(parseInt(id!), {
        query: { enabled: !!id },
    })
    const { data: users } = useUsersGet()

    const manager1 = useMemo(
        () =>
            module?.Module_Manager_1_UUID &&
            users?.find(user => user.UUID === module.Module_Manager_1_UUID),
        [module?.Module_Manager_1_UUID, users]
    )
    const manager2 = useMemo(
        () =>
            module?.Module_Manager_2_UUID &&
            users?.find(user => user.UUID === module.Module_Manager_2_UUID),
        [module?.Module_Manager_2_UUID, users]
    )

    const breadcrumbPaths = [
        { name: 'Muteeromgeving', path: '/muteer/dashboard' },
        { name: 'Modules', path: '/muteer/dashboard' },
        { name: module?.Title || '', path: pathName },
    ]

    if (isLoading || !module) return <LoaderContent />

    return (
        <MutateLayout title={module.Title}>
            <div className="col-span-6 mb-6">
                <div className="flex items-center justify-between mb-4 whitespace-nowrap">
                    <Breadcrumbs items={breadcrumbPaths} />
                    <Hyperlink
                        to={`/muteer/modules/${module.Module_ID}/bewerk`}
                        text="Module bewerken"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex-1 w-[85%]">
                        <div className="flex items-center">
                            <Heading level="1">{module.Title}</Heading>
                            <Badge
                                text={module.Status?.Status || ''}
                                upperCase={false}
                                className="-mt-2 ml-2"
                                variant={getModuleStatusColor(
                                    module.Status?.Status
                                )}
                            />
                        </div>
                        <div>
                            <Text type="body" className="truncate">
                                {module.Description}
                            </Text>
                        </div>
                    </div>
                    <div className="flex">
                        {manager1 && <Avatar name={manager1.Gebruikersnaam} />}
                        {manager2 && (
                            <Avatar
                                name={manager2.Gebruikersnaam}
                                className="-ml-2"
                            />
                        )}
                    </div>
                </div>
                {module.Activated ? (
                    <ModuleLock
                        locked={module.Temporary_Locked}
                        setModuleModal={setModuleModal}
                    />
                ) : (
                    <Divider className="mt-3" />
                )}
            </div>

            <div className="col-span-4">
                <Text type="body" className="font-bold">
                    Alle onderdelen in deze module
                </Text>
                {!!objects?.length ? (
                    <div className="mb-4">
                        {objects.map(object => (
                            <ModuleItem key={object.UUID} {...object} />
                        ))}
                    </div>
                ) : (
                    <p className="italic mb-4">
                        Er zijn nog geen onderdelen toegevoegd aan deze module
                    </p>
                )}
                <button
                    onClick={() =>
                        setModuleModal({
                            isOpen: true,
                            action: 'addContents',
                        })
                    }
                    className="underline text-pzh-green hover:text-pzh-green-dark">
                    Onderdeel toevoegen
                </button>
            </div>

            <div className="col-span-2">
                {!module.Activated && (
                    <ModuleInactiveCard setModuleModal={setModuleModal} />
                )}

                {module.Activated && module.Temporary_Locked && (
                    <ModuleVersionCard currentStatus={module.Status} />
                )}

                {module.Activated && statusHistory && (
                    <ModuleTimeline statusHistory={statusHistory} />
                )}
            </div>

            <ModuleContentsModal
                isOpen={
                    moduleModal.isOpen && moduleModal.action === 'addContents'
                }
                onClose={() => setModuleModal({ isOpen: false })}
                initialStep={1}
                initialValues={{
                    ...modules.EMPTY_MODULE_OBJECT,
                    state: 'new',
                }}
            />

            <ModuleActivateModal
                isOpen={moduleModal.isOpen && moduleModal.action === 'activate'}
                onClose={() => setModuleModal({ isOpen: false })}
            />

            <ModuleLockModal
                isOpen={moduleModal.isOpen && moduleModal.action === 'lock'}
                onClose={() => setModuleModal({ isOpen: false })}
            />
        </MutateLayout>
    )
}

export default ModuleDetail
