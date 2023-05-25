import {
    Button,
    FieldLabel,
    FormikCheckbox,
    getHeadingStyles,
    Text,
} from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'

import useBreakpoint from '@/hooks/useBreakpoint'
import useModule from '@/hooks/useModule'

const FormDelete = () => {
    const { moduleId } = useParams()

    const navigate = useNavigate()
    const { isMobile } = useBreakpoint()

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
            <div className="col-span-2">
                <h2 style={getHeadingStyles('3', isMobile)} className="mb-3">
                    Module verwijderen
                </h2>
                <Text type="body">
                    Verwijder de module zonder dat deze succesvol is afgesloten.
                </Text>
            </div>

            <div className="col-span-4 pt-[48px]">
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
