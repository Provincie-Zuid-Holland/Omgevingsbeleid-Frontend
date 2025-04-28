import {
    Button,
    formatDate,
    FormikInput,
    FormikSelect,
} from '@pzh-ui/components'
import {
    Form,
    Formik,
    FormikConfig,
    FormikValues,
    useFormikContext,
} from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    useModulesModuleIdStatusGet,
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
import { PUBLICATION_EDIT_SCHEMA } from '@/validation/publication'
import { useParams } from 'react-router-dom'

interface PublicationFormProps {
    type: 'add' | 'edit'
    submitText?: string
}

const PublicationForm = <TData extends FormikValues>({
    type,
    submitText = 'Publicatie opslaan',
    ...rest
}: PublicationFormProps & FormikConfig<TData>) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <Formik
            enableReinitialize
            validationSchema={toFormikValidationSchema(PUBLICATION_EDIT_SCHEMA)}
            {...rest}>
            {({ isSubmitting }) => (
                <Form className="space-y-12">
                    <Fields type={type} />
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
                            {submitText}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

const Fields = ({ type }: PublicationFormProps) => {
    const { moduleId } = useParams()
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
                    enabled: type === 'edit',
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
            },
            {
                query: {
                    select: data =>
                        data.results.map(act => ({
                            label: act.Title,
                            value: act.UUID,
                        })),
                    enabled:
                        !!values.Environment_UUID && !!values.Document_Type,
                },
            }
        )

    const { data: statusOptions, isFetching: moduleStatusFetching } =
        useModulesModuleIdStatusGet(parseInt(String(moduleId)), {
            query: {
                enabled: !!moduleId && type === 'add',
                select: data =>
                    data
                        .filter(status => status.Status !== 'Niet-Actief')
                        .map(status => ({
                            label: `${status.Status} (${formatDate(
                                new Date(status.Created_Date + 'Z'),
                                "dd-MM-yyyy 'om' HH:mm"
                            )})`,
                            value: status.ID,
                        })),
            },
        })

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
        publicationActsFetching ||
        moduleStatusFetching

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <LoaderSpinner />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {type === 'edit' && (
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
            )}
            <div>
                <FormikSelect
                    name="Act_UUID"
                    label="Regeling"
                    options={publicationActOptions}
                    placeholder="Selecteer een regeling"
                    disabled={type === 'edit'}
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
            {type === 'add' && (
                <div>
                    <FormikSelect
                        name="Module_Status_ID"
                        label="Modulestatus"
                        placeholder="Selecteer een modulestatus"
                        options={statusOptions}
                        required
                        styles={{
                            menu: base => ({
                                ...base,
                                position: 'relative',
                                zIndex: 9999,
                                marginTop: 2,
                                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.10)',
                            }),
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default PublicationForm
