import { useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button, Heading } from '@pzh-ui/components'
import { TrashCan } from '@pzh-ui/icons'

import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import ObjectDeleteModal from '@/components/Modals/ObjectModals/ObjectDeleteModal'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useModalStore from '@/store/modalStore'
import MutateLayout from '@/templates/MutateLayout'
import handleError from '@/utils/handleError'
import { toastNotification } from '@/utils/toastNotification'

interface ObjectWriteProps {
    model: (typeof models)[ModelType]
}

const ObjectWrite = ({ model }: ObjectWriteProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { objectId } = useParams()

    const { singularCapitalize, plural, pluralCapitalize } = model.defaults
    const {
        usePatchObject,
        useGetLatestLineage,
        useGetValid,
        useGetRelations,
        usePutRelations,
    } = model.fetchers

    const { data, isLoading, queryKey } = useGetLatestLineage?.(
        parseInt(objectId!),
        {
            query: { enabled: !!objectId },
        }
    )

    const { data: relations, queryKey: relationsQueryKey } = useGetRelations(
        parseInt(objectId!),
        {
            query: { enabled: !!objectId },
        }
    )

    const { queryKey: validQueryKey } = useGetValid(undefined, {
        query: { enabled: false },
    })

    const writeObject = usePatchObject?.()
    const putRelations = usePutRelations?.()

    /**
     * Format initialData based on object fields
     */
    const initialData = useMemo(() => {
        const fields = model.dynamicSections.flatMap(section =>
            section.fields.map(field => field.name)
        )

        const objectData = {} as { [key in (typeof fields)[number]]: any }

        fields?.forEach(field => {
            if (field === 'connections') {
                return (objectData[field] = relations)
            }

            return (objectData[field] = data?.[field as keyof typeof data])
        })

        return objectData
    }, [data, model.dynamicSections, relations])

    /**
     * Handle submit of form
     */
    const handleSubmit = (
        payload: typeof initialData,
        helpers: FormikHelpers<typeof initialData>
    ) => {
        if (!payload) return

        const { connections, ...rest } = payload

        writeObject
            ?.mutateAsync(
                {
                    lineageId: parseInt(objectId!),
                    data: rest,
                },
                {
                    onSuccess: () => {
                        if (!!connections) {
                            putRelations.mutateAsync(
                                {
                                    lineageId: parseInt(objectId!),
                                    data: connections,
                                },
                                {
                                    onSuccess: () => {
                                        Promise.all([
                                            queryClient.invalidateQueries(
                                                queryKey
                                            ),
                                            queryClient.invalidateQueries(
                                                validQueryKey
                                            ),
                                            queryClient.invalidateQueries(
                                                relationsQueryKey
                                            ),
                                        ]).then(() =>
                                            navigate(`/muteer/${plural}`)
                                        )

                                        toastNotification('saved')
                                    },
                                }
                            )
                        } else {
                            Promise.all([
                                queryClient.invalidateQueries(queryKey),
                                queryClient.invalidateQueries(validQueryKey),
                            ]).then(() => navigate(`/muteer/${plural}`))

                            toastNotification('saved')
                        }
                    },
                }
            )
            .catch(err => handleError<typeof initialData>(err, helpers))
    }

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        {
            name: pluralCapitalize,
            path: `/muteer/${plural}`,
        },
        { name: `${singularCapitalize} bewerken`, isCurrent: true },
    ]

    return (
        <MutateLayout
            title={`${singularCapitalize} bewerken`}
            breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <div className="mb-8 flex justify-between align-middle">
                    <Heading level="1" size="xxl">
                        {singularCapitalize} bewerken
                    </Heading>
                    <Button
                        variant="secondary"
                        icon={TrashCan}
                        onPress={() => setActiveModal('objectDelete')}>
                        {singularCapitalize} verwijderen
                    </Button>
                </div>

                <DynamicObjectForm
                    model={model}
                    initialData={initialData}
                    handleSubmit={handleSubmit}
                    onCancel={() => navigate(`/muteer/${plural}`)}
                    isLoading={isLoading}
                />
            </div>

            <ObjectDeleteModal object={data} model={model} />
        </MutateLayout>
    )
}

export default ObjectWrite
