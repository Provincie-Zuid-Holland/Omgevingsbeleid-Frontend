import { Divider, Heading } from '@pzh-ui/components'
import { Form, Formik, FormikHelpers } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { useModulesModuleIdGet } from '@/api/fetchers'
import { Module } from '@/api/fetchers.schemas'
import ButtonSubmitFixed from '@/components/ButtonSubmitFixed/ButtonSubmitFixed'
import { LoaderContent } from '@/components/Loader'
import {
    FormBasicInfo,
    FormContents,
    FormDelete,
} from '@/components/Modules/ModuleForm'
import useModule from '@/hooks/useModule'
import MutateLayout from '@/templates/MutateLayout'
import { formatEditModuleData } from '@/utils/formatModuleData'
import handleError from '@/utils/handleError'
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
    const { mutateAsync } = useEditModule('moduleEdit', () =>
        navigate(`/muteer/modules/${moduleId}`)
    )

    const handleSubmit = (payload: Module, helpers: FormikHelpers<Module>) => {
        const data = formatEditModuleData(payload)

        mutateAsync({ moduleId: parseInt(moduleId!), data }).catch(err =>
            handleError<Module>(err, helpers)
        )
    }

    const breadcrumbPaths = [
        { name: 'Muteeromgeving', path: '/muteer' },
        { name: 'Modules', path: '/muteer' },
        { name: module?.Title || '', path: `/muteer/modules/${moduleId}` },
        { name: 'Module bewerken' || '', isCurrent: true },
    ]

    if (isLoading || !module) return <LoaderContent />

    return (
        <MutateLayout title="Module bewerken" breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={module || {}}
                    validationSchema={toFormikValidationSchema(modules.SCHEMA)}>
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="grid grid-cols-6 gap-x-10 gap-y-0">
                                <div className="col-span-6 mb-8">
                                    <Heading level="1">Module bewerken</Heading>
                                </div>
                            </div>
                            {console.log(isSubmitting)}

                            <div className="grid grid-cols-6 gap-x-10 gap-y-0">
                                <FormBasicInfo />

                                <div className="col-span-6 my-10">
                                    <Divider />
                                </div>

                                <FormContents />
                            </div>

                            <ButtonSubmitFixed
                                onCancel={() =>
                                    navigate(`/muteer/modules/${moduleId}`)
                                }
                                disabled={isSubmitting || isLoading}
                                isLoading={isLoading}
                            />
                        </Form>
                    )}
                </Formik>

                <div className="grid grid-cols-6 gap-x-10 gap-y-0">
                    <div className="col-span-6 my-10">
                        <Divider />
                    </div>

                    <FormDelete />
                </div>
            </div>
        </MutateLayout>
    )
}

export default ModuleEdit
