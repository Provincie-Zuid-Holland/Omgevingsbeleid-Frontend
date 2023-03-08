import { BackLink, Button, Divider, Heading } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'

import { useModulesModuleIdGet } from '@/api/fetchers'
import { Module } from '@/api/fetchers.schemas'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import { FormBasicInfo, FormContents } from '@/components/Modules/ModuleForm'
import * as modules from '@/constants/zod/modules'
import useModules from '@/hooks/useModules'
import { formatEditModuleData } from '@/utils/formatModuleData'

const ModuleEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: { Module: module } = {}, isLoading } = useModulesModuleIdGet(
        parseInt(id!),
        {
            query: { enabled: !!id },
        }
    )

    const { useEditModule } = useModules()
    const { mutate } = useEditModule(parseInt(id!), () =>
        navigate(`/muteer/modules/${id}`)
    )

    const handleSubmit = (payload: Module) => {
        const data = formatEditModuleData(payload)

        mutate({ moduleId: parseInt(id!), data })
    }

    if (isLoading || !module) return <LoaderContent />

    return (
        <div className="pb-20">
            <Helmet>
                <title>Omgevingsbeleid - Module aanvullen</title>
            </Helmet>

            <Formik
                onSubmit={handleSubmit}
                initialValues={module || {}}
                validate={withZodSchema(modules.SCHEMA)}>
                <Form>
                    <div className="py-2 bg-pzh-gray-100 sticky z-20 top-[97px]">
                        <div className="pzh-container flex justify-between items-center">
                            <BackLink
                                to={`/muteer/modules/${id}`}
                                label="Terug naar de module"
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

                    <Container>
                        <FormBasicInfo />

                        <div className="col-span-6 my-10">
                            <Divider />
                        </div>

                        <FormContents />
                    </Container>
                </Form>
            </Formik>
        </div>
    )
}

export default ModuleEdit
