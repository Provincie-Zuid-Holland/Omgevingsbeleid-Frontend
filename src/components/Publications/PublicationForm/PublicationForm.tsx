import { Button, Divider, FormikInput, FormikSelect } from '@pzh-ui/components'
import { Form, Formik, FormikConfig, FormikValues } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { AppExtensionsPublicationsEnumsDocumentType } from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'
import { PUBLICATION_SCHEMA } from '@/validation/publication'

interface PublicationFormProps {
    submitLabel: string
}

const PublicationForm = <TData extends FormikValues>({
    submitLabel,
    ...rest
}: PublicationFormProps & FormikConfig<TData>) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const options = (
        Object.keys(
            AppExtensionsPublicationsEnumsDocumentType
        ) as Array<AppExtensionsPublicationsEnumsDocumentType>
    ).map(type => ({ label: type, value: type }))

    return (
        <Formik
            enableReinitialize
            validationSchema={toFormikValidationSchema(PUBLICATION_SCHEMA)}
            {...rest}>
            {({ isSubmitting }) => (
                <Form>
                    <div className="space-y-4">
                        <div>
                            <FormikSelect
                                name="Document_Type"
                                label="Instrument"
                                options={options}
                                disabled
                                required
                            />
                        </div>
                        <div>
                            <FormikInput
                                name="Official_Title"
                                label="Officiële titel"
                                placeholder="Vul de officiële titel in"
                                required
                            />
                        </div>
                        <div>
                            <FormikInput
                                name="Regulation_Title"
                                label="Regeling opschrift"
                                placeholder="Regeling opschrift"
                                required
                            />
                        </div>
                        <div>
                            <FormikSelect
                                name="Template_ID"
                                label="Publicatie template"
                            />
                        </div>
                    </div>
                    <Divider className="my-6" />
                    <div className="flex items-center justify-between">
                        <Button
                            variant="link"
                            onPress={() => setActiveModal(null)}>
                            Annuleren
                        </Button>
                        <Button
                            variant="cta"
                            type="submit"
                            isLoading={isSubmitting}>
                            {submitLabel}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default PublicationForm
