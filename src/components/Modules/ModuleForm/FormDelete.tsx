import {
    Button,
    FieldLabel,
    FormikCheckbox,
    Notification,
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
        <div className="col-span-6">
            <Formik onSubmit={handleSubmit} initialValues={{ consent: false }}>
                {({ dirty, isSubmitting }) => (
                    <Form>
                        <FieldLabel
                            name="consent"
                            label="Module verwijderen"
                            description="Verwijder de module zonder dat deze succesvol is afgesloten."
                        />
                        <Notification
                            title="Let op! Het verwijderen van deze module is niet terug te draaien"
                            variant="warning"
                            className="my-4 block"
                        />
                        <FormikCheckbox name="consent" className="block">
                            Ik wil deze module voorgoed verwijderen
                        </FormikCheckbox>
                        <Button
                            type="submit"
                            isDisabled={!dirty || isSubmitting}
                            isLoading={isSubmitting}
                            className="mt-4">
                            Module verwijderen
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default FormDelete
