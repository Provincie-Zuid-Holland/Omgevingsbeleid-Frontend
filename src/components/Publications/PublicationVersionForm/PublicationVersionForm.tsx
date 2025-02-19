import {
    Button,
    Divider,
    FormikDate,
    FormikInput,
    FormikRte,
    FormikSelect,
    FormikTextArea,
    Text,
    formatDate,
} from '@pzh-ui/components'
import { useMountEffect } from '@react-hookz/web'
import { Form, Formik, FormikConfig, FormikProps, FormikValues } from 'formik'
import { useParams } from 'react-router-dom'

import { useModulesModuleIdStatusGet } from '@/api/fetchers'
import { HTTPValidationError } from '@/api/fetchers.schemas'
import FieldArray from '@/components/Form/FieldArray'
import ScrollToFieldError from '@/components/ScrollToFieldError'
import useModalStore from '@/store/modalStore'
import handleError from '@/utils/handleError'

interface PublicationVersionFormProps {
    isRequired?: boolean
    error?: {
        data: HTTPValidationError
    }
}

const PublicationVersionForm = <TData extends FormikValues>({
    isRequired,
    error,
    ...rest
}: PublicationVersionFormProps & FormikConfig<TData>) => (
    <Formik enableReinitialize validateOnBlur={false} {...rest}>
        {props => (
            <InnerForm isRequired={isRequired} error={error} {...props} />
        )}
    </Formik>
)

const InnerForm = <TData extends FormikValues>({
    isSubmitting,
    isRequired,
    error,
    ...rest
}: PublicationVersionFormProps & FormikProps<TData>) => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data: statusOptions, isLoading } = useModulesModuleIdStatusGet(
        parseInt(moduleId!),
        {
            query: {
                enabled: !!moduleId,
                select: data =>
                    data
                        .filter(status => status.Status !== 'Niet-Actief')
                        .map(status => ({
                            label: `${status.Status} (${formatDate(
                                new Date(status.Created_Date + 'Z'),
                                'dd-MM-yyyy'
                            )})`,
                            value: status.ID,
                        })),
            },
        }
    )

    useMountEffect(() => {
        if (!!error) {
            setTimeout(() => {
                handleError(error, rest)
            }, 100)
        }
    })

    return (
        <Form>
            <div className="space-y-4">
                <div>
                    <FormikSelect
                        key={isLoading.toString()}
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
                <FormikInput
                    name="Bill_Metadata.Official_Title"
                    label="Officiële titel van het besluit"
                    required
                />
                <FormikRte name="Bill_Compact.Preamble" label="Aanhef" />
                <Articles />
                <FormikRte
                    name="Bill_Compact.Closing"
                    label="Sluiting"
                    placeholder="Bijv. Gegeven te 's-Gravenhage, 27 september 2023"
                />
                <FormikRte name="Bill_Compact.Signed" label="Ondertekening" />

                <div className="space-y-4 bg-pzh-gray-100 p-4">
                    <Text>Procedureverloop</Text>

                    <div className="flex space-x-4 [&_>div]:flex-1">
                        <div>
                            <FormikDate
                                name="Procedural.Enactment_Date"
                                label="Vaststellingsdatum"
                                placeholder="Kies een datum"
                            />
                        </div>
                        <div>
                            <FormikDate
                                name="Procedural.Signed_Date"
                                label="Datum van ondertekening"
                                placeholder="Kies een datum"
                                required={isRequired}
                            />
                        </div>
                        <div>
                            <FormikDate
                                name="Procedural.Procedural_Announcement_Date"
                                label="Bekend op"
                                placeholder="Kies een datum"
                                required={isRequired}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 bg-pzh-gray-100 p-4">
                    <Text>Juridische data</Text>

                    <div className="flex space-x-4 [&_>div]:flex-1">
                        <div>
                            <FormikDate
                                name="Announcement_Date"
                                label="Bekendmakingsdatum"
                                placeholder="Kies een datum"
                                required={isRequired}
                            />
                        </div>
                        <div>
                            <FormikDate
                                name="Effective_Date"
                                label="Inwerkingtredingsdatum"
                                placeholder="Kies een datum"
                                required={isRequired}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Divider className="my-6" />
            <div className="flex items-center justify-between">
                <Button variant="link" onPress={() => setActiveModal(null)}>
                    Annuleren
                </Button>
                <Button
                    variant="cta"
                    type="submit"
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}>
                    Versie opslaan
                </Button>
            </div>

            <ScrollToFieldError />
        </Form>
    )
}

const Articles = () => (
    <div className="space-y-4 bg-pzh-gray-100 p-4">
        <Text>Artikelen</Text>

        <div>
            <FormikTextArea
                name="Bill_Compact.Amendment_Article"
                label="Wijzigingsartikel"
            />
        </div>

        <div>
            <FormikTextArea
                name="Bill_Compact.Time_Article"
                label="Inwerkingstredingartikel"
            />
        </div>

        <FieldArray
            name="Bill_Compact.Custom_Articles"
            label=""
            arrayLabel="Artikel"
            buttonLabel="Artikel toevoegen"
            buttonOptions={{
                variant: 'secondary',
                size: 'small',
            }}
            itemClassName="py-4 px-0 border-t border-pzh-gray-600 gap-4"
            fields={[
                {
                    type: 'text',
                    name: 'Label',
                    label: '',
                },
                {
                    type: 'wysiwyg',
                    name: 'Content',
                    label: '',
                },
            ]}
        />
    </div>
)

export default PublicationVersionForm
