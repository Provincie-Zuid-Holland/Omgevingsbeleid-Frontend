import { BackLink, Button, Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { getModulesGetQueryKey, useModulesPost } from '@/api/fetchers'
import { ModuleCreate as ModuleCreateSchema } from '@/api/fetchers.schemas'
import { Container } from '@/components/Container'
import { FormBasicInfo } from '@/components/Modules/ModuleForm'
import { toastNotification } from '@/utils/toastNotification'
import * as modules from '@/validation/modules'

const ModuleCreate = () => {
    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const { mutate, isLoading } = useModulesPost({
        mutation: {
            onError: () => {
                toastNotification('error')
            },
            onSuccess: res => {
                queryClient
                    .invalidateQueries(getModulesGetQueryKey(), {
                        refetchType: 'all',
                    })
                    .then(() => navigate(`/muteer/modules/${res.Module_ID}`))

                toastNotification('moduleCreated')
            },
        },
    })

    const handleSubmit = (payload: ModuleCreateSchema) => {
        mutate({ data: payload })
    }

    return (
        <div className="pb-20">
            <Helmet title="Module aanmaken" />

            <Formik
                onSubmit={handleSubmit}
                initialValues={modules.EMPTY_CREATE_MODULE}
                validationSchema={toFormikValidationSchema(modules.SCHEMA)}>
                <Form>
                    <div className="py-2 bg-pzh-gray-100 sticky z-20 top-[97px]">
                        <div className="pzh-container flex justify-between items-center">
                            <BackLink to="/muteer" label="Terug naar modules" />
                            <Button
                                variant="cta"
                                type="submit"
                                isDisabled={isLoading}
                                isLoading={isLoading}>
                                Opslaan
                            </Button>
                        </div>
                    </div>

                    <Container className="pt-10">
                        <div className="col-span-6 mb-8">
                            <Heading level="1">Module aanmaken</Heading>
                        </div>
                    </Container>

                    <Container>
                        <FormBasicInfo />
                    </Container>
                </Form>
            </Formik>
        </div>
    )
}

export default ModuleCreate
