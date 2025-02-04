import {
    Button,
    FieldLabel,
    formatDate,
    FormikRadio,
    Text,
} from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'

import { useSourceWerkingsgebiedenGet } from '@/api/fetchers'
import AreaPreview from '@/components/AreaPreview'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'

export interface AreaProps {
    area?: string
    Title?: string
    Modified_Date?: string
}

interface AreaModalEditProps {
    initialValues?: AreaProps
    handleFormSubmit: (payload: AreaProps) => void
}

const AreaModalEdit = ({
    initialValues = {},
    handleFormSubmit,
}: AreaModalEditProps) => {
    const activeModal = useModalStore(state => state.activeModal)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data, isLoading } = useSourceWerkingsgebiedenGet(
        { limit: 1000, title: initialValues.Title },
        {
            query: {
                enabled: activeModal === 'areaEdit',
            },
        }
    )

    const options = useMemo(() => {
        if (!data) return []

        // Group results by Geometry_Hash
        const geometryHashGroups = data.results.reduce((acc, item) => {
            if (item.Geometry_Hash) {
                ;(acc[item.Geometry_Hash] ||= []).push(item)
            }
            return acc
        }, {} as Record<string, (typeof data.results)[0][]>)

        // Identify duplicates
        const duplicateUUIDs = new Set<string>()
        Object.values(geometryHashGroups).forEach(group => {
            group
                .sort(
                    (a, b) =>
                        new Date(a.Created_Date).getTime() -
                        new Date(b.Created_Date).getTime()
                )
                .slice(1) // Exclude the oldest
                .forEach(item => duplicateUUIDs.add(item.UUID))
        })

        // Create options with isDuplicate flag
        return data.results
            .sort(
                (a, b) =>
                    new Date(b.Created_Date).getTime() -
                    new Date(a.Created_Date).getTime()
            )
            .map(option => ({
                label: option.Title,
                value: option.UUID,
                isDuplicate: duplicateUUIDs.has(option.UUID),
            }))
    }, [data])

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setActiveModal(null)
    }

    const handleSubmit = (payload: AreaProps) => {
        const selectedArea = data?.results.find(
            item => item.UUID === payload.area
        )

        handleFormSubmit({
            ...selectedArea,
            ...payload,
        })
        handleClose()
    }

    return (
        <Modal
            id="areaEdit"
            title="Werkingsgebied wijzigen"
            size="xl"
            onClose={handleClose}>
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                enableReinitialize>
                {({ isSubmitting, values }) => (
                    <Form>
                        <div>
                            <Text className="mb-6">
                                Selecteer een versie om te koppelen.
                            </Text>

                            <div className="grid grid-cols-9 gap-4">
                                <div className="col-span-5">
                                    <FieldLabel
                                        name="area"
                                        label={initialValues.Title || ''}
                                    />

                                    <div className="h-[500px] overflow-y-auto rounded border border-pzh-gray-200 p-4">
                                        {isLoading ? (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <LoaderSpinner />
                                            </div>
                                        ) : (
                                            options?.map((version, index) => {
                                                const area = data?.results.find(
                                                    item =>
                                                        item.UUID ===
                                                        version.value
                                                )

                                                if (!area) return

                                                return (
                                                    <div
                                                        key={version.value}
                                                        className={
                                                            index + 1 !==
                                                            options.length
                                                                ? 'mb-2'
                                                                : ''
                                                        }>
                                                        <FormikRadio
                                                            name="area"
                                                            value={
                                                                version.value
                                                            }
                                                            defaultChecked={
                                                                version.value ===
                                                                values.area
                                                            }
                                                            disabled={
                                                                version.isDuplicate
                                                            }>
                                                            Versie{' '}
                                                            {options.length -
                                                                index}
                                                        </FormikRadio>
                                                        <span className="-mt-1 ml-7 block text-s">
                                                            Datum:{' '}
                                                            {formatDate(
                                                                new Date(
                                                                    area.Created_Date
                                                                ),
                                                                'd MMMM yyyy'
                                                            )}
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-4 flex flex-col">
                                    <Text bold className="mb-2">
                                        Voorbeeld
                                    </Text>

                                    <div className="flex flex-1">
                                        <AreaPreview
                                            key={values?.area}
                                            UUID={values.area}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <Button variant="link" onPress={handleClose}>
                                Annuleren
                            </Button>
                            <Button
                                variant="cta"
                                type="submit"
                                isDisabled={isSubmitting}>
                                Koppelen
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default AreaModalEdit
