import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Button, FormikSelect, Text } from '@pzh-ui/components'

import {
    getModulesGetQueryKey,
    getModulesModuleIdGetQueryKey,
    useModulesModuleIdStatusPatch,
} from '@/api/fetchers'
import { ModuleStatus, ModuleStatusCode } from '@/api/fetchers.schemas'
import { toastNotification } from '@/utils/toastNotification'

interface ModuleVersionCardProps {
    /** Current status of the module (optional) */
    currentStatus?: ModuleStatus
}

const ModuleVersionCard = ({ currentStatus }: ModuleVersionCardProps) => {
    const queryClient = useQueryClient()

    const { moduleId } = useParams()

    /**
     * Patch module status version
     */
    const createVersion = useModulesModuleIdStatusPatch({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries(
                    getModulesModuleIdGetQueryKey(parseInt(moduleId!))
                )
                queryClient.invalidateQueries(getModulesGetQueryKey(), {
                    refetchType: 'all',
                })

                toastNotification('saved')
            },
        },
    })

    /**
     * Handle form submit, reset form on submit
     */
    const handleSubmit = (
        payload: { Status?: ModuleStatusCode },
        helpers: FormikHelpers<{ Status: undefined }>
    ) => {
        if (payload.Status) {
            createVersion
                .mutateAsync({
                    moduleId: parseInt(moduleId!),
                    data: { Status: payload.Status },
                })
                .then(() => helpers.resetForm())
                .catch(err => {
                    helpers.setFieldError('Status', err.data.detail)
                    helpers.setSubmitting(false)
                })
        }
    }

    /**
     * Create select options and filter current status
     */
    const options = useMemo(
        () =>
            Object.keys(ModuleStatusCode)
                .filter(
                    code =>
                        code !== 'Niet-Actief' &&
                        ModuleStatusCode[
                            code as keyof typeof ModuleStatusCode
                        ] !== currentStatus?.Status
                )
                .map(code => ({
                    label: ModuleStatusCode[
                        code as keyof typeof ModuleStatusCode
                    ],
                    value: ModuleStatusCode[
                        code as keyof typeof ModuleStatusCode
                    ],
                })),
        [currentStatus?.Status]
    )

    return (
        <div className="mb-5 bg-pzh-gray-100 px-8 py-6">
            <Text bold color="text-pzh-blue" className="mb-2">
                Versie aanmaken
            </Text>
            <Text className="mb-2">
                Geef aan welke versie de objecten moeten krijgen.
            </Text>
            <Formik
                onSubmit={handleSubmit}
                initialValues={{ Status: undefined }}
                enableReinitialize>
                {({ isSubmitting }) => (
                    <Form>
                        <FormikSelect
                            name="Status"
                            placeholder="Selecteer een versie"
                            options={options}
                            optimized={false}
                            blurInputOnSelect
                        />

                        <Button
                            type="submit"
                            variant="cta"
                            className="mt-2"
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting}
                            data-testid="module-version-create">
                            Versie aanmaken
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ModuleVersionCard
