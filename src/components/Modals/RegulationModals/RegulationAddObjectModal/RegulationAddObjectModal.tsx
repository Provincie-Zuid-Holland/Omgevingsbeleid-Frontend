import { Button, Heading, Modal } from '@pzh-ui/components'
import { Form, Formik } from 'formik'

interface RegulationAddObjectModalProps {
    isOpen: boolean
    onClose: () => void
}

const RegulationAddObjectModal = ({
    isOpen,
    onClose,
}: RegulationAddObjectModalProps) => {
    const handleFormSubmit = () => {}

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            ariaLabel="Artikel toevoegen"
            maxWidth="sm:max-w-[980px]">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={{}}
                enableReinitialize>
                <Form>
                    <Heading level="3" className="mb-4">
                        Artikel toevoegen
                    </Heading>

                    <div className="mt-6 flex items-center justify-between">
                        <Button variant="link" onPress={onClose}>
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

export default RegulationAddObjectModal
