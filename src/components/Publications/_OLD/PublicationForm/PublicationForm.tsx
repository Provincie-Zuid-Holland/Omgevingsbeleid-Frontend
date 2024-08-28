import { Button, Divider, FormikInput, FormikSelect } from '@pzh-ui/components'
import {
    Form,
    Formik,
    FormikConfig,
    FormikValues,
    useFormikContext,
} from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    usePublicationActsGet,
    usePublicationEnvironmentsGet,
    usePublicationTemplatesGet,
} from '@/api/fetchers'
import {
    DocumentType,
    ProcedureType,
    Publication,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import useModalStore from '@/store/modalStore'
import { SCHEMA_PUBLICATION } from '@/validation/publication'

interface PublicationFormProps {
    submitLabel: string
}

const PublicationForm = <TData extends FormikValues>({
    submitLabel,
    ...rest
}: PublicationFormProps & FormikConfig<TData>) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <Formik
            enableReinitialize
            validationSchema={toFormikValidationSchema(SCHEMA_PUBLICATION)}
            {...rest}>
            {({ isSubmitting }) => (
                <Form>
                    <Fields />
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

const Fields = () => {
    const { values } = useFormikContext<Publication>()

    const {
        data: publicationTemplateOptions,
        isFetching: publicationTemplatesFetching,
    } = usePublicationTemplatesGet(
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

    const { data: environmentOptions, isFetching: environmentsFetching } =
        usePublicationEnvironmentsGet(
            { limit: 100 },
            {
                query: {
                    select: data =>
                        data.results.map(environment => ({
                            label: environment.Title,
                            value: environment.UUID,
                        })),
                },
            }
        )

    const { data: publicationActOptions, isFetching: publicationActsFetching } =
        usePublicationActsGet(
            {
                limit: 100,
                is_active: true,
                environment_uuid: values.Environment_UUID,
                document_type: values.Document_Type as DocumentType,
                procedure_type: values.Procedure_Type as ProcedureType,
            },
            {
                query: {
                    select: data =>
                        data.results.map(act => ({
                            label: act.Title,
                            value: act.UUID,
                        })),
                },
            }
        )

    const documentTypeOptions = Object.entries(DocumentType).map(
        ([, value]) => ({ label: value, value })
    )

    const procedureTypeOptions = Object.entries(ProcedureType).map(
        ([, value]) => ({
            label: value === 'draft' ? 'Ontwerp' : 'Definitief',
            value,
        })
    )

    const isLoading =
        publicationTemplatesFetching ||
        environmentsFetching ||
        publicationActsFetching

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <LoaderSpinner />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex space-x-4 [&_>div]:flex-1">
                <FormikSelect
                    name="Document_Type"
                    label="Instrument"
                    options={documentTypeOptions}
                    disabled
                    required
                />
                <FormikSelect
                    name="Environment_UUID"
                    label="Publicatieomgeving"
                    options={environmentOptions}
                    disabled
                    required
                />
                <FormikSelect
                    name="Procedure_Type"
                    label="Type"
                    options={procedureTypeOptions}
                    disabled
                    required
                />
            </div>
            <div>
                <FormikSelect
                    name="Act_UUID"
                    label="Regeling"
                    options={publicationActOptions}
                    placeholder="Selecteer een regeling"
                    required
                />
            </div>
            <div>
                <FormikSelect
                    name="Template_UUID"
                    label="Publicatie template"
                    options={publicationTemplateOptions}
                    placeholder="Selecteer een publicatie template"
                    required
                />
            </div>
            <div>
                <FormikInput
                    name="Title"
                    label="Interne titel"
                    placeholder="Bijvoorbeeld: Omgevingsvisie Herziening 2024"
                    required
                />
            </div>
        </div>
    )
}

export default PublicationForm
