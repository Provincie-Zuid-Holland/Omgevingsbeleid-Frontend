import {
    Button,
    FieldLabel,
    FormikCheckbox,
    Heading,
    Text,
} from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'

import useModule from '@/hooks/useModule'

const FormDelete = () => {
    const { moduleId } = useParams()

    const navigate = useNavigate()

    const { useCloseModule } = useModule()
    const closeModule = useCloseModule(() => navigate('/muteer'))

    /**
     * Handle close module
     */
    const handleSubmit = () => {
        closeModule.mutate({ moduleId: parseInt(moduleId!) })
    }

    return (
        <>
            <div className="col-span-6 sm:col-span-2">
                <Heading as="2" level="3" className="mb-3">
                    Module verwijderen
                </Heading>
                <Text type="body">
                    Verwijder de module zonder dat deze succesvol is afgesloten.
                </Text>
            </div>

            <div className="col-span-6 pt-[48px] sm:col-span-4">
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={{ consent: false }}>
                    {({ dirty, isSubmitting }) => (
                        <Form>
                            <FieldLabel
                                name="consent"
                                label="Let op! Het verwijderen van deze module is niet terug te draaien"
                            />
                            <FormikCheckbox name="consent">
                                Ik wil deze module voorgoed verwijderen
                            </FormikCheckbox>
                            <Button
                                type="submit"
                                isDisabled={!dirty || isSubmitting}
                                isLoading={isSubmitting}
                                className="mt-3">
                                Module verwijderen
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default FormDelete
