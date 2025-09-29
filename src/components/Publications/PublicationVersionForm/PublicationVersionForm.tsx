import {
    Button,
    FormikDate,
    FormikInput,
    FormikRte,
    FormikSelect,
    FormikTextArea,
    Notification,
    Text,
} from '@pzh-ui/components'
import { useMountEffect } from '@react-hookz/web'
import { Form, Formik, FormikConfig, FormikProps, FormikValues } from 'formik'
import { useParams } from 'react-router-dom'

import { HTTPValidationError } from '@/api/fetchers.schemas'
import FieldArray from '@/components/Form/FieldArray'
import { ModalFooter } from '@/components/Modal/Modal'
import ScrollToFieldError from '@/components/ScrollToFieldError'
import { useModuleStatusData } from '@/hooks/useModuleStatusData'
import useModalStore from '@/store/modalStore'
import handleError from '@/utils/handleError'
import { useMemo } from 'react'

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
    values,
    ...rest
}: PublicationVersionFormProps & FormikProps<TData>) => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { statusOptions, lastStatus, isLoading } =
        useModuleStatusData(moduleId)

    const isLastStatus = useMemo(
        () => values.Module_Status_ID === lastStatus?.ID,
        [lastStatus, values.Module_Status_ID]
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
            <div className="flex flex-col gap-4">
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
                                marginTop: 4,
                                boxShadow: 'none',
                            }),
                        }}
                    />
                    {!isLastStatus && (
                        <Notification className="mt-2 w-full">
                            De modulestatus is niet de meest recente versie die
                            beschikbaar is.
                        </Notification>
                    )}
                </div>
                <div>
                    <FormikInput
                        name="Bill_Metadata.Official_Title"
                        label="Officiële titel van het besluit"
                        required
                    />
                </div>
                <div>
                    <FormikInput
                        name="Bill_Metadata.Quote_Title"
                        label="Citeertitel"
                        placeholder="Bijv. (Ontwerpbesluit) Wijziging [instrument] Zuid-Holland [modulenaam]"
                        required
                    />
                </div>
                <div>
                    <FormikRte name="Bill_Compact.Preamble" label="Aanhef" />
                </div>
                <Articles />
                <div>
                    <FormikRte
                        name="Bill_Compact.Closing"
                        label="Sluiting"
                        placeholder="Bijv. Gegeven te 's-Gravenhage, 27 september 2023"
                    />
                </div>
                <div>
                    <FormikRte
                        name="Bill_Compact.Signed"
                        label="Ondertekening"
                    />
                </div>

                <div className="bg-pzh-gray-100 flex flex-col gap-4 p-4">
                    <Text>Procedureverloop</Text>

                    <div className="flex gap-4 [&_>div]:flex-1">
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

                <div className="bg-pzh-gray-100 flex flex-col gap-4 p-4">
                    <Text>Juridische data</Text>

                    <div className="flex gap-4 [&_>div]:flex-1">
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
            <ModalFooter className="mt-4">
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
            </ModalFooter>

            <ScrollToFieldError />
        </Form>
    )
}

const Articles = () => (
    <div className="bg-pzh-gray-100 flex flex-col gap-4 p-4">
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
                    name: 'Number',
                    label: 'Nummer',
                    placeholder: 'Voer hier een nummer in, bijvoorbeeld: III',
                },
                {
                    type: 'wysiwyg',
                    name: 'Content',
                    label: 'Inhoud van artikel',
                },
            ]}
        />
    </div>
)

export default PublicationVersionForm
