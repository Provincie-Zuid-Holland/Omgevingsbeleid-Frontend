import { Text } from '@pzh-ui/components'

import {
    useWerkingsgebiedViewModuleObjectLatest,
    useWerkingsgebiedViewObjectLatest,
} from '@/api/fetchers'
import { LeafletTinyViewer } from '@/components/Leaflet'
import Modal from '@/components/Modal'
import useAuth from '@/hooks/useAuth'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const ObjectAreaModal = () => {
    const { user } = useAuth()

    const modalState = useModalStore(
        state => state.modalStates['objectArea']
    ) as ModalStateMap['objectArea']

    const {
        data: moduleData,
        isSuccess,
        isError,
    } = useWerkingsgebiedViewModuleObjectLatest(
        parseInt(modalState?.moduleId),
        parseInt(modalState?.id),
        {
            query: {
                enabled: !!modalState?.moduleId && !!modalState?.id && !!user,
            },
        }
    )

    const { data: validData } = useWerkingsgebiedViewObjectLatest(
        parseInt(modalState?.id),
        {
            query: {
                enabled:
                    (!modalState?.moduleId && !!modalState?.id) ||
                    (!!modalState?.moduleId &&
                        !!modalState?.id &&
                        !moduleData &&
                        isSuccess) ||
                    isError,
            },
        }
    )

    const data = modalState?.moduleId && isSuccess ? moduleData : validData

    return (
        <Modal id="objectArea" size="xl" title="Gebiedsaanwijzing">
            <div className="flex gap-4">
                <div className="flex w-1/2 flex-col gap-4">
                    <div>
                        <Text>Gebiedengroep</Text>
                        <Text bold>{modalState?.label}</Text>
                    </div>
                    <div>
                        <Text>Type gebiedsaanwijzing</Text>
                        <Text bold>{modalState?.gebiedsaanwijzingtype}</Text>
                    </div>
                    <div>
                        <Text>Gebiedsaanwijzinggroep</Text>
                        <Text bold>{modalState?.gebiedengroep}</Text>
                    </div>
                </div>
                <div className="h-[360px] w-full overflow-hidden rounded-lg">
                    {data?.Area_UUID && (
                        <LeafletTinyViewer uuid={data.Area_UUID} />
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default ObjectAreaModal
