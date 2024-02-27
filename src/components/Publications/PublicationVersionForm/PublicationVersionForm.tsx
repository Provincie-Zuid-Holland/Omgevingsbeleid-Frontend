import {
    Button,
    Divider,
    FormikDate,
    FormikInput,
    FormikRadioGroup,
    FormikSelect,
    FormikTextArea,
    Text,
    formatDate,
} from '@pzh-ui/components'
import { Form, Formik, FormikConfig, FormikValues } from 'formik'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { useModulesModuleIdStatusGet } from '@/api/fetchers'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/Accordion'
import useModalStore from '@/store/modalStore'
import { PUBLICATION_VERSION_SCHEMA } from '@/validation/publication'

interface PublicationVersionFormProps {
    submitLabel: string
    isEdit?: boolean
}

const PublicationVersionForm = <TData extends FormikValues>({
    submitLabel,
    isEdit,
    ...rest
}: PublicationVersionFormProps & FormikConfig<TData>) => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data: statusOptions } = useModulesModuleIdStatusGet(
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

    return (
        <Formik
            enableReinitialize
            validationSchema={toFormikValidationSchema(
                PUBLICATION_VERSION_SCHEMA
            )}
            {...rest}>
            <Form>
                <div className="space-y-4">
                    <FormikRadioGroup
                        name="Is_Official"
                        label="Doel"
                        description="Geef hieronder aan waar deze versie gebruikt gaat worden. Is deze versie voor een Interne publicatie (voor bijvoorbeeld Planoview) of is het een Officiële publicatie?"
                        optionLayout="horizontal"
                        options={[
                            {
                                label: 'Interne publicatie',
                                value: 'false',
                            },
                            {
                                label: 'Officiële publicatie',
                                value: 'true',
                            },
                        ]}
                        disabled={isEdit}
                        required
                    />
                    <FormikRadioGroup
                        name="Procedure_Type"
                        label="Type"
                        description="Geef hieronder aan of het gaat om een ontwerp-versie of een definitieve-versie."
                        optionLayout="horizontal"
                        options={[
                            {
                                label: 'Ontwerp',
                                value: 'Ontwerp',
                            },
                            {
                                label: 'Definitief',
                                value: 'Definitief',
                            },
                        ]}
                        disabled={isEdit}
                        required
                    />
                    <div className="flex space-x-4 [&_>div]:flex-1">
                        <FormikSelect
                            name="Module_Status_ID"
                            label="Module status"
                            placeholder="Selecteer een module status"
                            options={statusOptions}
                            disabled={isEdit}
                            required
                        />
                        <FormikInput
                            name="PZH_Bill_Identifier"
                            label="Besluitnummer"
                            placeholder="Indien bekend, geef het besluitnummer op"
                        />
                    </div>
                    <FormikInput name="Bill_Data.Preamble" label="Aanhef" />
                    <div>
                        <Text bold>Artikelen</Text>
                        <Articles />
                    </div>
                    <FormikInput
                        name="Bill_Data.Closing"
                        label="Sluiting"
                        placeholder="Bijv. Gegeven te 's-Gravenhage, 27 september 2023"
                        required
                    />
                    <FormikInput
                        name="Bill_Data.Signature"
                        label="Ondertekening"
                        required
                    />
                    <div className="flex space-x-4 [&_>div]:flex-1">
                        <div>
                            <FormikDate
                                name="Procedure_Data.Steps.0.Conclusion_Date"
                                label="Vaststellingsdatum"
                                placeholder="Kies een datum"
                                required
                            />
                        </div>
                        <div>
                            <FormikDate
                                name="Procedure_Data.Steps.1.Conclusion_Date"
                                label="Datum van ondertekening"
                                placeholder="Kies een datum"
                                required
                            />
                        </div>
                        <div>
                            <FormikDate
                                name="Procedure_Data.Announcement_Date"
                                label="Bekendmakingsdatum"
                                placeholder="Kies een datum"
                                required
                            />
                        </div>
                        <div>
                            <FormikDate
                                name="Effective_Date"
                                label="Inwerkingtredingsdatum"
                                placeholder="Kies een datum"
                            />
                        </div>
                    </div>
                </div>
                <Divider className="my-6" />
                <div className="flex items-center justify-between">
                    <Button variant="link" onPress={() => setActiveModal(null)}>
                        Annuleren
                    </Button>
                    <Button variant="cta" type="submit">
                        {submitLabel}
                    </Button>
                </div>
            </Form>
        </Formik>
    )
}

const Articles = () => (
    <Accordion multipleOpen>
        <AccordionItem
            uuid="article-1"
            className="data-[expanded=true]:bg-pzh-gray-100"
            defaultOpen>
            <AccordionTrigger
                className="p-4 text-pzh-blue-500"
                classNameButton="after:w-full">
                Artikel I - Genomen besluit ( wat het bestuursorgaan besluit
                vast te stellen of te wijzigen )
            </AccordionTrigger>
            <AccordionContent className="mb-4 px-4 pt-0">
                <FormikTextArea
                    name="Bill_Data.Amendment_Article.Content"
                    label="Inhoud"
                />
            </AccordionContent>
        </AccordionItem>
        <AccordionItem
            uuid="article-2"
            className="data-[expanded=true]:bg-pzh-gray-100"
            defaultOpen>
            <AccordionTrigger
                className="p-4 text-pzh-blue-500"
                classNameButton="after:w-full">
                Artikel II - Wijzigingen ( opsomming van gewijzigde artikelen )
            </AccordionTrigger>
            <AccordionContent className="mb-4 px-4 pt-0">
                <FormikTextArea
                    name="Bill_Data.Articles.0.Content"
                    label="Inhoud"
                />
            </AccordionContent>
        </AccordionItem>
        <AccordionItem
            uuid="article-3"
            className="data-[expanded=true]:bg-pzh-gray-100"
            defaultOpen>
            <AccordionTrigger
                className="p-4 text-pzh-blue-500"
                classNameButton="after:w-full">
                Artikel III - Inwerkingtreding ( datum waarop het
                wijzigingsbesluit geldig is )
            </AccordionTrigger>
            <AccordionContent className="mb-4 px-4 pt-0">
                <FormikTextArea
                    name="Bill_Data.Time_Article.Content"
                    label="Inhoud"
                />
            </AccordionContent>
        </AccordionItem>
    </Accordion>
)

export default PublicationVersionForm
