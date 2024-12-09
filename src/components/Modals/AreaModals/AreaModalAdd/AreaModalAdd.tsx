import {
    Button,
    FieldInput,
    FieldLabel,
    FormikRadioGroup,
    Text,
} from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { Form, Formik } from 'formik'
import debounce from 'lodash.debounce'
import { useMemo, useState } from 'react'

import { useSourceWerkingsgebiedenGet } from '@/api/fetchers'
import AreaPreview from '@/components/AreaPreview'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'

export interface AreaProps {
    area?: string
    Title?: string
    Created_Date?: string
}

interface AreaModalAddProps {
    initialValues?: AreaProps
    handleFormSubmit: (payload: AreaProps) => void
}

const AreaModalAdd = ({
    initialValues = {},
    handleFormSubmit,
}: AreaModalAddProps) => {
    const activeModal = useModalStore(state => state.activeModal)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [query, setQuery] = useState('')

    const { data, isLoading } = useSourceWerkingsgebiedenGet(
        { limit: 1000 },
        {
            query: {
                enabled: activeModal === 'areaAdd',
            },
        }
    )

    const handleChange = debounce(e => setQuery(e.target.value), 500)

    const options = useMemo(
        () =>
            data?.results.map(option => ({
                label: option.Title,
                value: option.UUID,
            })),
        [data]
    )

    /**
     * Filter options based on query
     */
    const filteredOptions = useMemo(
        () =>
            options?.filter(
                option =>
                    !!option.label
                        .toLowerCase()
                        .includes(query.toLocaleLowerCase())
            ),
        [query, options]
    )

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
            id="areaAdd"
            title="Werkingsgebied koppelen"
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
                                Selecteer een werkingsgebied om te koppelen.
                            </Text>

                            <div className="grid grid-cols-9 gap-4">
                                <div className="col-span-5">
                                    <FieldLabel
                                        name="area"
                                        label="Werkingsgebieden"
                                    />

                                    <div className="mb-2">
                                        <FieldInput
                                            name="search"
                                            placeholder="Zoek een werkingsgebied op naam"
                                            icon={MagnifyingGlass}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="h-[444px] overflow-y-auto rounded border border-pzh-gray-200 p-4">
                                        {isLoading ? (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <LoaderSpinner />
                                            </div>
                                        ) : (
                                            !!filteredOptions?.length && (
                                                <FormikRadioGroup
                                                    name="area"
                                                    options={filteredOptions}
                                                    required
                                                    optimized={false}
                                                />
                                            )
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

export default AreaModalAdd
