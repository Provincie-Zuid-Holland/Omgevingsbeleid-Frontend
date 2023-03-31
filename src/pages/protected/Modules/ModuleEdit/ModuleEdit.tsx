import { BackLink, Button, Divider, Heading } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { useModulesModuleIdGet } from '@/api/fetchers'
import { Module } from '@/api/fetchers.schemas'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import {
    FormBasicInfo,
    FormContents,
    FormDelete,
} from '@/components/Modules/ModuleForm'
import useModule from '@/hooks/useModule'
import { formatEditModuleData } from '@/utils/formatModuleData'
import * as modules from '@/validation/modules'

const ModuleEdit = () => {
    const { moduleId } = useParams()
    const navigate = useNavigate()

    const { data: { Module: module } = {}, isLoading } = useModulesModuleIdGet(
        parseInt(moduleId!),
        {
            query: { enabled: !!moduleId },
        }
    )

    const { useEditModule } = useModule()
    const { mutate, isLoading: mutateLoading } = useEditModule(
        'moduleEdit',
        () => navigate(`/muteer/modules/${moduleId}`)
    )

    const handleSubmit = (payload: Module) => {
        const data = formatEditModuleData(payload)

        mutate({ moduleId: parseInt(moduleId!), data })
    }

    if (isLoading || !module) return <LoaderContent />

    return (
        <div className="pb-20">
            <Helmet title="Module aanvullen" />

            <Formik
                onSubmit={handleSubmit}
                initialValues={module || {}}
                validationSchema={toFormikValidationSchema(modules.SCHEMA)}>
                <Form>
                    <div className="py-2 bg-pzh-gray-100 sticky z-20 top-[97px]">
                        <div className="pzh-container flex justify-between items-center">
                            <BackLink
                                to={`/muteer/modules/${moduleId}`}
                                label="Terug naar de module"
                            />
                            <Button
                                variant="cta"
                                type="submit"
                                isDisabled={mutateLoading}
                                isLoading={mutateLoading}>
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

                        <div className="col-span-6 my-10">
                            <Divider />
                        </div>
                    </Container>
                </Form>
            </Formik>

            <Container>
                <FormDelete />
            </Container>
        </div>
    )
}

export default ModuleEdit
