import { BackLink, Button, Heading } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { Helmet } from 'react-helmet'

import { Container } from '@/components/Container'
import { FormBasicInfo } from '@/components/Modules/ModuleForm'

const ModuleCreate = () => {
    const handleSubmit = () => {}

    return (
        <div className="pb-20">
            <Helmet>
                <title>Omgevingsbeleid - Module aanmaken</title>
            </Helmet>

            <Formik onSubmit={handleSubmit} initialValues={{}}>
                <>
                    <div className="py-2 bg-pzh-gray-100 sticky z-20 top-[97px]">
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
                            <FormBasicInfo />
                        </Container>
                    </Form>
                </>
            </Formik>
        </div>
    )
}

export default ModuleCreate
