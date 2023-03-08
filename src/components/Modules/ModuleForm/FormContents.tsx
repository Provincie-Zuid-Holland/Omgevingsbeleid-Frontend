import {
    Button,
    FormikInput,
    FormikSelect,
    getHeadingStyles,
    Text,
} from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebounce, useMedia } from 'react-use'

import { useModulesModuleIdGet, useSearchGet } from '@/api/fetchers'
import * as modules from '@/constants/zod/modules'

import ModuleContentsModal from '../ModuleModals/ModuleContentsModal'
import ModulePart from '../ModulePart'

const FormContents = () => {
    const { id } = useParams()

    const isMobile = useMedia('(max-width: 640px)')
    const [openModal, setOpenModal] = useState(false)
    const [searchObjectQuery, setSearchObjectQuery] = useState('')
    const [debouncedValue, setDebouncedValue] = useState('')

    const { data: searchData } = useSearchGet(
        { query: debouncedValue },
        { query: { enabled: !!debouncedValue } }
    )

    console.log(searchData)

    /**
     * Debounce object search
     */
    useDebounce(() => setDebouncedValue(searchObjectQuery), 300, [
        searchObjectQuery,
    ])

    const { data: { Objects: objects } = {} } = useModulesModuleIdGet(
        parseInt(id!),
        {
            query: { enabled: !!id },
        }
    )

    const newObjects = useMemo(
        () => objects?.filter(object => object.Action === 'Toevoegen'),
        [objects]
    )

    const existingObjects = useMemo(
        () => objects?.filter(object => object.Action !== 'Toevoegen'),
        [objects]
    )

    return (
        <>
            <div className="col-span-2">
                <h2 style={getHeadingStyles('3', isMobile)} className="mb-3">
                    Inhoud module
                </h2>
                <Text type="body">
                    Geef aan welke onderdelen van het omgevingsbeleid worden
                    aangepast, verwijderd of toegevoegd in deze module
                </Text>
            </div>

            <div className="col-span-4 pt-[48px]">
                <FormikSelect
                    name="Onderdelen"
                    label="Onderdelen die wijzigen of worden verwijderd"
                    placeholder="Zoek op titel van beleidskeuze, maatregel, etc."
                    noOptionsMessage={() =>
                        'Zoek op titel van beleidskeuze, maatregel, etc.'
                    }
                    onInputChange={val => setSearchObjectQuery(val)}
                />
                <FormikInput
                    name="Onderdelen"
                    label="Onderdelen die wijzigen of worden verwijderd"
                    placeholder="Zoek op titel van beleidskeuze, maatregel, etc."
                    icon={MagnifyingGlass}
                />

                {!!existingObjects?.length && (
                    <div className="mt-4">
                        {existingObjects.map((object, index) => (
                            <ModulePart
                                key={object.UUID}
                                isLast={existingObjects.length === index + 1}
                                {...object}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-8">
                    <Text type="body" className="font-bold">
                        Nieuwe onderdelen in deze module
                    </Text>
                    {!!newObjects?.length ? (
                        <div className="mt-2">
                            {newObjects.map((object, index) => (
                                <ModulePart
                                    key={object.UUID}
                                    isLast={newObjects.length === index + 1}
                                    {...object}
                                />
                            ))}
                        </div>
                    ) : (
                        <Text
                            type="body-small"
                            className="mt-2 text-pzh-gray-600">
                            Er zijn nog geen nieuwe onderdelen toegevoegd
                        </Text>
                    )}

                    <Button className="mt-4" onPress={() => setOpenModal(true)}>
                        Nieuw onderdeel toevoegen
                    </Button>
                </div>
            </div>

            <ModuleContentsModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                initialStep={2}
                initialValues={{ ...modules.EMPTY_MODULE_OBJECT, state: 'new' }}
            />
        </>
    )
}

export default FormContents
