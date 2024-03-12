import { Button, Divider, FormikSelect } from '@pzh-ui/components'
import { Form, Formik, FormikConfig, FormikValues } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { usePublicationTemplatesGet } from '@/api/fetchers'
import { DocumentType } from '@/api/fetchers.schemas'
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

    const { data: publicationTemplateOptions, isFetching } =
        usePublicationTemplatesGet(
            { limit: 100 },
            {
                query: {
                    select: data =>
                        data.results.map(template => ({
                            label: template.Title,
                            value: template.UUID,
                        })),
                },
            }
        )

    const documentTypeOptions = (
        Object.keys(DocumentType) as Array<DocumentType>
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
                                options={documentTypeOptions}
                                disabled
                                required
                            />
                        </div>
                        <div>
                            <FormikSelect
                                key={String(
                                    publicationTemplateOptions?.length +
                                        isFetching.toString()
                                )}
                                name="Template_UUID"
                                label="Publicatie template"
                                options={publicationTemplateOptions}
                                placeholder="Selecteer een publicatie template"
                                isLoading={isFetching}
                                required
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
