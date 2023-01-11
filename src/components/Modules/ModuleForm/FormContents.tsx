import { Button, FormikInput, getHeadingStyles, Text } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { useState } from 'react'
import { useMedia } from 'react-use'

import ModuleContentsModal from '../ModuleContentsModal'
import ModulePart from '../ModulePart'

const FormContents = () => {
    const isMobile = useMedia('(max-width: 640px)')
    const [openModal, setOpenModal] = useState(false)

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
                <FormikInput
                    name="Onderdelen"
                    label="Onderdelen die wijzigen of worden verwijderd"
                    placeholder="Zoek op titel van beleidskeuze, maatregel, etc."
                    icon={MagnifyingGlass}
                />

                <div className="mt-4">
                    <ModulePart
                        type="beleidskeuze"
                        title="Waterveiligheid en wateroverlast"
                        status="Wijzigen"
                    />
                    <ModulePart
                        type="beleidskeuze"
                        title="Transitie naar Zero Emissie goederenvervoer over weg en water (verduurzamen van transport)"
                        status="Vervallen"
                        isLast
                    />
                </div>

                <div className="mt-8">
                    <Text type="body" className="font-bold">
                        Nieuwe onderdelen in deze module
                    </Text>
                    <Text type="body-small" className="mt-2 text-pzh-gray-600">
                        Er zijn nog geen nieuwe onderdelen toegevoegd
                    </Text>
                    <Button className="mt-4" onPress={() => setOpenModal(true)}>
                        Nieuw onderdeel toevoegen
                    </Button>
                </div>
            </div>

            <ModuleContentsModal
                isOpen={openModal}
                setIsOpen={setOpenModal}
                initialStep={2}
                initialValues={{ state: 'new', type: '' }}
            />
        </>
    )
}

export default FormContents
