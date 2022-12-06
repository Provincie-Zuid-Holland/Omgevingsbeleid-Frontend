import { Badge, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { Helmet } from 'react-helmet'

import { Container } from '@/components/Container'

const ModuleDetail = () => {
    return (
        <>
            <Helmet>
                <title>Omgevingsbeleid - Module</title>
            </Helmet>

            <Container className="pt-10">
                <div className="col-span-6">
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
                </div>
            </Container>
        </>
    )
}

export default ModuleDetail
