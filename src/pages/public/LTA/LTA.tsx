import { Badge, Heading, Text } from '@pzh-ui/components'
import { Outlet } from 'react-router-dom'

import { Container } from '@/components/Container'

import SubNavigation from './SubNavigation'

function LTA() {
    return (
        <Container className="pb-20 overflow-hidden">
            <div className="col-span-6 sm:col-span-2 mt-8">
                <Text type="body-small">Omgevingsbeleid</Text>
                <Heading as="2" level="3">
                    Lange Termijn Agenda
                </Heading>
                <Badge
                    variant="red"
                    upperCase={false}
                    text="Vastgesteld door PS"
                />

                <SubNavigation className="mt-6" ariaLabel="Sub navigatie">
                    <SubNavigation.List>
                        <SubNavigation.Link label="Inleiding" to="/lta" end />
                    </SubNavigation.List>

                    <SubNavigation.Header as="3">
                        Categoriën
                    </SubNavigation.Header>
                    <SubNavigation.List>
                        <SubNavigation.Link
                            label="Dit is een hele hele lange titel oh wat is die lang"
                            to="/lta/categorie/1-lange-titel"
                        />
                        <SubNavigation.Link
                            label="Dit is een hele hele lange titel oh wat is die lang"
                            to="/lta/categorie/1-verkenningen"
                        />
                        <SubNavigation.Link
                            label="Startnotities"
                            to="/lta/categorie/2-startnotities"
                        />
                    </SubNavigation.List>

                    <SubNavigation.Header as="3">
                        Kwartaaloverzichten
                    </SubNavigation.Header>
                    <SubNavigation.List>
                        <SubNavigation.Link
                            label="2023 - 1"
                            to="/lta/kwartaaloverzicht/2023/1"
                        />
                        <SubNavigation.Link
                            label="2023 - 2"
                            to="/lta/kwartaaloverzicht/2023/2"
                        />
                        <SubNavigation.Link
                            label="2023 - 3"
                            to="/lta/kwartaaloverzicht/2023/3"
                        />
                    </SubNavigation.List>
                </SubNavigation>
            </div>

            <div className="col-span-6 sm:col-span-4 xl:col-span-3">
                <Outlet />
            </div>
        </Container>
    )
}

export default LTA
