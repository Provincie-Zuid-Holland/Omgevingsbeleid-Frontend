import {
    Badge,
    Button,
    Divider,
    Heading,
    Hyperlink,
    Text,
} from '@pzh-ui/components'
import { Helmet } from 'react-helmet'

import { Container } from '@/components/Container'

const ModuleDetail = () => {
    return (
        <>
            <Helmet>
                <title>Omgevingsbeleid - Module</title>
            </Helmet>

            <Container className="pt-10">
                <div className="col-span-6 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <Text type="body">Module</Text>
                        <Hyperlink
                            to="/muteer/modules/1/bewerk"
                            text="Module bewerken"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center">
                                <Heading level="1">Koers 2022</Heading>
                                <Badge
                                    text="Inactief"
                                    upperCase={false}
                                    className="-mt-2 ml-2"
                                    variant="gray"
                                />
                            </div>
                            <Text type="body">
                                De module Koers 2022 zorgt voor het aanpassen
                                van de leefomgeving rondom de havens in
                                Rotterdam. Als er meer tekst is dan zal deze
                                worden afgekapt
                            </Text>
                        </div>
                        <div className="flex">
                            <img
                                src="https://via.placeholder.com/46x46"
                                alt=""
                                className="rounded-full border border-pzh-gray-600"
                            />
                            <img
                                src="https://via.placeholder.com/46x46"
                                alt=""
                                className="rounded-full border border-pzh-gray-600 -ml-2"
                            />
                        </div>
                    </div>
                    <Divider className="mt-3" />
                </div>

                <div className="col-span-4">
                    <Text type="body" className="font-bold">
                        Alle onderdelen in deze module
                    </Text>
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
        </>
    )
}

export default ModuleDetail
