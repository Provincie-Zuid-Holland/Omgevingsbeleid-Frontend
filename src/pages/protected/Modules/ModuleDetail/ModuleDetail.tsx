import {
    Badge,
    Button,
    Divider,
    Heading,
    Hyperlink,
    Text,
} from '@pzh-ui/components'
import { useState } from 'react'
import { Helmet } from 'react-helmet'

import { Container } from '@/components/Container'
import ModuleContentsModal from '@/components/Modules/ModuleContentsModal'
import ModuleItem from '@/components/Modules/ModuleItem'

const ModuleDetail = () => {
    const [openModal, setOpenModal] = useState(false)

    return (
        <>
            <Helmet>
                <title>Omgevingsbeleid - Module</title>
            </Helmet>

            <Container className="pt-10 pb-20">
                <div className="col-span-6 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <Text type="body">Module</Text>
                        <Hyperlink
                            to="/muteer/modules/1/bewerk"
                            text="Module bewerken"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex-1 w-[85%]">
                            <div className="flex items-center">
                                <Heading level="1">Koers 2022</Heading>
                                <Badge
                                    text="Inactief"
                                    upperCase={false}
                                    className="-mt-2 ml-2"
                                    variant="gray"
                                />
                            </div>
                            <div>
                                <Text type="body" className="truncate">
                                    De module Koers 2022 zorgt voor het
                                    aanpassen van de leefomgeving rondom de
                                    havens in Rotterdam. Als er meer tekst is
                                    dan zal deze worden afgekapt
                                </Text>
                            </div>
                        </div>
                        <div className="flex">
                            <img
                                src="https://via.placeholder.com/46x46"
                                alt=""
                                className="rounded-full border border-pzh-gray-600 min-w-[46px]"
                            />
                            <img
                                src="https://via.placeholder.com/46x46"
                                alt=""
                                className="rounded-full border border-pzh-gray-600 -ml-2 min-w-[46px]"
                            />
                        </div>
                    </div>
                    <Divider className="mt-3" />
                </div>

                <div className="col-span-4">
                    <Text type="body" className="font-bold">
                        Alle onderdelen in deze module
                    </Text>
                    <div className="mb-4">
                        <ModuleItem
                            type="beleidskeuze"
                            status="Vervallen"
                            title="De provincie Zuid-Holland draagt bij aan het behoud van de wereldpositie die de Rotterdamse haven bezit"
                        />
                        <ModuleItem
                            type="maatregel"
                            status="Wijzigen"
                            title="Faciliteren van gemeenten bij besparen en overschakelen op schone energie"
                        />
                        <ModuleItem
                            type="beleidskeuze"
                            status="Wijzigen"
                            title="Gezonde leefomgeving"
                        />
                        <ModuleItem
                            type="gebiedsprogramma"
                            status="Toevoegen"
                            title="Zuid-Hollandse Eilanden"
                        />
                    </div>
                    <button
                        onClick={() => setOpenModal(true)}
                        className="underline text-pzh-green hover:text-pzh-green-dark">
                        Onderdeel toevoegen
                    </button>
                </div>

                <div className="col-span-2">
                    <div className="py-4 px-6 bg-pzh-ui-light-blue">
                        <Text type="body" className="mb-2 font-bold">
                            Module inactief
                        </Text>
                        <Text type="body" className="mb-3">
                            Deze module is nog niet actief. Andere gebruikers
                            kunnen deze module nog niet zien en kunnen nog geen
                            onderdelen uit deze module bewerken.
                        </Text>
                        <Button>Activeer module</Button>
                    </div>
                </div>
            </Container>

            <ModuleContentsModal
                isOpen={openModal}
                setIsOpen={setOpenModal}
                initialStep={1}
                initialValues={{ state: '', type: '' }}
            />
        </>
    )
}

export default ModuleDetail
