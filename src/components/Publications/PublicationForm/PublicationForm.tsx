import { Button, Divider, FormikInput, FormikSelect } from '@pzh-ui/components'
import { Form, Formik, FormikConfig, FormikValues } from 'formik'

import { AppExtensionsPublicationsEnumsDocumentType } from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'

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
        <Formik enableReinitialize {...rest}>
            {({ isSubmitting }) => (
                <Form>
                    <div className="space-y-4">
                        <FormikSelect
                            name="Document_Type"
                            label="Instrument"
                            options={options}
                            disabled
                        />
                        <FormikInput
                            name="Official_Title"
                            label="Officiële titel"
                            placeholder="Vul de officiële titel in"
                        />
                        <FormikInput
                            name="Regulation_Title"
                            label="Regeling opschrift"
                            placeholder="Regeling opschrift"
                        />
                        <FormikSelect
                            name="Template_ID"
                            label="Publicatie template"
                        />
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
