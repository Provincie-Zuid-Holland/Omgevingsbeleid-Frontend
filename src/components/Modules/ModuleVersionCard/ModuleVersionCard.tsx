import { Button, FormikSelect, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

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
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: () => {
                queryClient.invalidateQueries(
                    getModulesModuleIdGetQueryKey(parseInt(moduleId!))
                )
                queryClient.invalidateQueries(getModulesGetQueryKey(), {
                    refetchType: 'all',
                })

                toastNotification({ type: 'saved' })
            },
        },
    })

    /**
     * Handle form submit, reset form on submit
     */
    const handleSubmit = (
        payload: { Status?: ModuleStatusCode },
        { resetForm }: FormikHelpers<{ Status: undefined }>
    ) => {
        if (payload.Status) {
            createVersion
                .mutateAsync({
                    moduleId: parseInt(moduleId!),
                    data: { Status: payload.Status },
                })
                .then(() => resetForm())
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
        <div className="mb-5 py-4 px-6 bg-pzh-gray-100">
            <Text type="body" className="mb-2 font-bold">
                Versie aanmaken
            </Text>
            <Text type="body" className="mb-3">
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
                        />

                        <Button
                            type="submit"
                            variant="cta"
                            className="mt-1"
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting}>
                            Versie aanmaken
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ModuleVersionCard
