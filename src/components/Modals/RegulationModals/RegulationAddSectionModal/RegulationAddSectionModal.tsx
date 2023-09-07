import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button, FormikInput, Heading } from '@pzh-ui/components'

import Modal from '@/components/Modal'
import { calculateNewIndex } from '@/components/Regulations/utils'
import * as sections from '@/config/regulations/sections'
import useModalStore from '@/store/modalStore'
import useRegulationStore from '@/store/regulationStore'

const RegulationAddSectionModal = () => {
    const structure = useRegulationStore(state => state.structure)
    const itemAction = useRegulationStore(state => state.itemAction)
    const addItem = useRegulationStore(state => state.addItem)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const index = useMemo(
        () => calculateNewIndex(structure, itemAction),
        [itemAction, structure]
    )

    if (!itemAction?.type || !itemAction?.path || itemAction.action !== 'add')
        return null

    const section = sections[itemAction.type]
    const { singular, singularCapitalize, prefixSingular } = section.defaults

    const handleFormSubmit = (payload: any) => {
        addItem(itemAction.path || [], {
            type: itemAction.type,
            uuid: uuidv4(),
            title: payload.title,
        })
        setActiveModal(null)
    }

    return (
        <Modal
            size="l"
            id="regulationAdd"
            title={`${singularCapitalize} toevoegen`}>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={{
                    label: singularCapitalize,
                    index,
                }}
                enableReinitialize>
                <Form>
                    <Heading
                        level="3"
                        size="m"
                        className="mb-3"
                        color="text-pzh-blue-dark">
                        Kop van {prefixSingular} {singular}
                    </Heading>

                    <div className="flex gap-4">
                        <div className="w-[160px]">
                            <FormikInput name="label" label="Label" disabled />
                        </div>
                        <div className="w-[80px]">
                            <FormikInput name="index" label="Nummer" disabled />
                        </div>
                        <div className="flex-1">
                            <FormikInput name="title" label="Opschrift" />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-pzh-gray-600 pt-4">
                        <Button
                            variant="link"
                            onPress={() => setActiveModal(null)}>
                            Annuleren
                        </Button>
                        <Button variant="cta" type="submit">
                            Opslaan
                        </Button>
                    </div>
                </Form>
            </Formik>
        </Modal>
    )
}

export default RegulationAddSectionModal
