import { Button, FormikSelect, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import {
    getModulesGetQueryKey,
    getModulesModuleIdGetQueryKey,
    getModulesModuleIdStatusGetQueryKey,
    useModulesModuleIdStatusPatch,
} from '@/api/fetchers'
import { ModuleStatusCode } from '@/api/fetchers.schemas'
import { toastNotification } from '@/utils/toastNotification'

const ModuleVersionCard = () => {
    const queryClient = useQueryClient()

    const { moduleId } = useParams()

    /**
     * Patch module status version
     */
    const createVersion = useModulesModuleIdStatusPatch({
        mutation: {
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: getModulesModuleIdGetQueryKey(
                            parseInt(moduleId!)
                        ),
                    }),
                    queryClient.invalidateQueries({
                        queryKey: getModulesGetQueryKey(),
                        refetchType: 'all',
                    }),
                    queryClient.invalidateQueries({
                        queryKey: getModulesModuleIdStatusGetQueryKey(
                            parseInt(moduleId!)
                        ),
                        refetchType: 'all',
                    }),
                ])

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
            Object.keys(ModuleStatusCode).map((code, index) => ({
                label: `${index + 1}. ${
                    ModuleStatusCode[code as keyof typeof ModuleStatusCode]
                }`,
                value: ModuleStatusCode[code as keyof typeof ModuleStatusCode],
            })),
        []
    )

    return (
        <div className="mb-5 bg-pzh-gray-100 px-8 py-6">
            <Text bold color="text-pzh-blue-500" className="mb-2">
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
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
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
