import { BackLink, Button, Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { getModulesGetQueryKey, useModulesPost } from '@/api/fetchers'
import { ModuleCreate as ModuleCreateSchema } from '@/api/fetchers.schemas'
import { Container } from '@/components/Container'
import { FormBasicInfo } from '@/components/Modules/ModuleForm'
import * as modules from '@/constants/zod/modules'
import { toastNotification } from '@/utils/toastNotification'

const ModuleCreate = () => {
    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const createModule = useModulesPost({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: res => {
                Promise.all([
                    queryClient.invalidateQueries(
                        getModulesGetQueryKey({
                            only_mine: true,
                            only_active: true,
                        })
                    ),
                    queryClient.invalidateQueries(
                        getModulesGetQueryKey({
                            only_active: true,
                        })
                    ),
                ]).then(() => navigate(`/muteer/modules/${res.Module_ID}`))

                toastNotification({ type: 'saved' })
            },
        },
    })

    const handleSubmit = (payload: ModuleCreateSchema) => {
        createModule.mutate({ data: payload })
    }

    return (
        <div className="pb-20">
            <Helmet>
                <title>Omgevingsbeleid - Module aanmaken</title>
            </Helmet>

            <Formik
                onSubmit={handleSubmit}
                initialValues={modules.EMPTY_CREATE_MODULE}
                validate={withZodSchema(modules.SCHEMA)}>
                <Form>
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

                    <Container>
                        <FormBasicInfo />
                    </Container>
                </Form>
            </Formik>
        </div>
    )
}

export default ModuleCreate
