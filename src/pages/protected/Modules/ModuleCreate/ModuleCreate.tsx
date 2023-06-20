import { Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { useNavigate } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { getModulesGetQueryKey, useModulesPost } from '@/api/fetchers'
import { ModuleCreate as ModuleCreateSchema } from '@/api/fetchers.schemas'
import ButtonSubmitFixed from '@/components/ButtonSubmitFixed/ButtonSubmitFixed'
import { FormBasicInfo } from '@/components/Modules/ModuleForm'
import MutateLayout from '@/templates/MutateLayout'
import handleError from '@/utils/handleError'
import { toastNotification } from '@/utils/toastNotification'
import * as modules from '@/validation/modules'

const ModuleCreate = () => {
    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const { mutateAsync, isLoading } = useModulesPost({
        mutation: {
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

    const handleSubmit = (
        payload: ModuleCreateSchema,
        helpers: FormikHelpers<ModuleCreateSchema>
    ) => {
        mutateAsync({ data: payload }).catch(err =>
            handleError<ModuleCreateSchema>(err, helpers)
        )
    }

    const breadcrumbPaths = [
        { name: 'Muteeromgeving', path: '/muteer' },
        { name: 'Modules', path: '/muteer' },
        { name: 'Module aanmaken' || '', isCurrent: true },
    ]

    return (
        <MutateLayout title="Module aanmaken" breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <Formik
                    onSubmit={handleSubmit}
                    validateOnBlur={false}
                    initialValues={modules.EMPTY_CREATE_MODULE}
                    validationSchema={toFormikValidationSchema(modules.SCHEMA)}>
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="grid grid-cols-6 gap-x-10 gap-y-0">
                                <div className="col-span-6 mb-8">
                                    <Heading level="1">Module aanmaken</Heading>
                                </div>
                            </div>

                            <div className="grid grid-cols-6 gap-x-10 gap-y-0">
                                <FormBasicInfo />
                            </div>

                            <ButtonSubmitFixed
                                onCancel={() => navigate('/muteer')}
                                disabled={isSubmitting || isLoading}
                                isLoading={isLoading}
                            />
                        </Form>
                    )}
                </Formik>
            </div>
        </MutateLayout>
    )
}

export default ModuleCreate
