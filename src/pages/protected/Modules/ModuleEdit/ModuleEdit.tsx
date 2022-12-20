import {
    BackLink,
    Button,
    Divider,
    FormikInput,
    FormikRte,
    FormikSelect,
    getHeadingStyles,
    Heading,
    Text,
} from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { Helmet } from 'react-helmet'
import { useMedia } from 'react-use'

import { Container } from '@/components/Container'

const ModuleEdit = () => {
    const isMobile = useMedia('(max-width: 640px)')

    const handleSubmit = () => {}

    return (
        <>
            <Helmet>
                <title>Omgevingsbeleid - Module aanvullen</title>
            </Helmet>

            <Formik onSubmit={handleSubmit} initialValues={{}}>
                <>
                    <div className="py-2 bg-pzh-gray-100">
                        <div className="pzh-container flex justify-between items-center">
                            <BackLink
                                to="/muteer/dashboard"
                                label="Terug naar modules"
                            />
                            <Button variant="cta" type="submit">
                                Opslaan
                            </Button>
                        </div>
                    </div>

                    <Container className="pt-10">
                        <div className="col-span-6 mb-8">
                            <Heading level="1">Module aanvullen</Heading>
                        </div>
                    </Container>

                    <Form>
                        <Container>
                            <div className="col-span-2">
                                <h2
                                    style={getHeadingStyles('3', isMobile)}
                                    className="mb-3">
                                    Algemene informatie
                                </h2>
                                <Text type="body">
                                    De algemene informatie bevat een duidelijke
                                    titel en moduletrekkers.
                                </Text>
                            </div>

                            <div className="col-span-4 pt-[48px]">
                                <FormikInput
                                    name="Titel"
                                    label="Titel"
                                    placeholder="Titel van de module"
                                    required
                                />
                                <div className="mt-6 grid grid-cols-2 gap-x-10">
                                    <div>
                                        <FormikSelect
                                            name="Moduletrekker1"
                                            label="Moduletrekker 1"
                                            placeholder="Selecteer een moduletrekker"
                                            options={[
                                                {
                                                    label: 'Erik Verhaar',
                                                    value: 1,
                                                },
                                                {
                                                    label: 'Tom van Gelder',
                                                    value: 2,
                                                },
                                            ]}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <FormikSelect
                                            name="Moduletrekker2"
                                            label="Moduletrekker 2"
                                            placeholder="Selecteer een moduletrekker"
                                            options={[
                                                {
                                                    label: 'Erik Verhaar',
                                                    value: 1,
                                                },
                                                {
                                                    label: 'Tom van Gelder',
                                                    value: 2,
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <FormikRte
                                        name="Omschrijving"
                                        label="Omschrijving"
                                        description="Geef een omschrijving van de module. Denk hierbij aan de aanpassingen die worden gedaan."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-span-6 my-10">
                                <Divider />
                            </div>

                            <div className="col-span-2">
                                <h2
                                    style={getHeadingStyles('3', isMobile)}
                                    className="mb-3">
                                    Inhoud module
                                </h2>
                                <Text type="body">
                                    Geef aan welke onderdelen van het
                                    omgevingsbeleid worden aangepast, verwijderd
                                    of toegevoegd in deze module
                                </Text>
                            </div>

                            <div className="col-span-4 pt-[48px]">
                                <FormikInput
                                    name="Onderdelen"
                                    label="Onderdelen die wijzigen of worden verwijderd"
                                    placeholder="Zoek op titel van beleidskeuze, maatregel, etc."
                                />
                            </div>
                        </Container>
                    </Form>
                </>
            </Formik>
        </>
    )
}

export default ModuleEdit
