import {
    Button,
    Divider,
    FormikDate,
    FormikInput,
    FormikRadioGroup,
    FormikRte,
    FormikSelect,
    Text,
} from '@pzh-ui/components'
import { Form, Formik } from 'formik'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/Accordion'
import Modal from '@/components/Modal/Modal'
import useModalStore from '@/store/modalStore'

const ModuleDecisionModal = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const handleFormSubmit = () => {}

    const initialValues = {}

    return (
        <Modal id="moduleDecision" title="Versie" size="xl">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                enableReinitialize>
                <Form>
                    <div className="space-y-4">
                        <FormikRadioGroup
                            name="purpose"
                            label="Doel"
                            description="Geef hieronder aan waar deze versie gebruikt gaat worden. Is deze versie voor een Interne publicatie (voor bijvoorbeeld Planoview) of is het een Officiële publicatie?"
                            optionLayout="horizontal"
                            options={[
                                {
                                    label: 'Interne publicatie',
                                    value: 'internal',
                                },
                                {
                                    label: 'Officiële publicatie',
                                    value: 'official',
                                },
                            ]}
                        />
                        <FormikRadioGroup
                            name="type"
                            label="Type"
                            description="Geef hieronder aan of het gaat om een ontwerp-versie of een definitieve-versie."
                            optionLayout="horizontal"
                            options={[
                                {
                                    label: 'Ontwerp',
                                    value: 'draft',
                                },
                                {
                                    label: 'Definitief',
                                    value: 'final',
                                },
                            ]}
                        />
                        <div className="flex space-x-4 [&_>div]:flex-1">
                            <FormikSelect
                                name="status"
                                label="Module status"
                                placeholder="Selecteer een module status"
                            />
                            <FormikInput
                                name="decisionNumber"
                                label="Besluitnummer"
                                placeholder="Indien bekend, geef het besluitnummer op"
                            />
                        </div>
                        <FormikInput
                            name="title"
                            label="Officiële titel"
                            placeholder="Vul de officiële titel in"
                        />
                        <FormikInput
                            name="inscription"
                            label="Regeling opschrift"
                            placeholder="Regeling opschrift"
                        />
                        <FormikRte name="salutation" label="Aanhef" />
                        <div>
                            <Text bold>Artikelen</Text>
                            <Articles />
                        </div>
                        <FormikRte name="signature" label="Ondertekening" />
                        <div className="flex space-x-4 [&_>div]:flex-1">
                            <FormikDate
                                name="determinationDate"
                                label="Vaststellingsdatum"
                                placeholder="Kies een datum"
                                required
                            />
                            <FormikDate
                                name="signatureDate"
                                label="Datum van ondertekening"
                                placeholder="Kies een datum"
                                required
                            />
                            <FormikDate
                                name="announcementDate"
                                label="Bekendmakingsdatum"
                                placeholder="Kies een datum"
                            />
                            <FormikDate
                                name="effectiveDate"
                                label="Inwerkingtredingsdatum"
                                placeholder="Kies een datum"
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
                        <Button variant="cta" type="submit">
                            Versie maken
                        </Button>
                    </div>
                </Form>
            </Formik>
        </Modal>
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
                <FormikRte name="article-1" label="Inhoud" />
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
                <FormikRte name="article-2" label="Inhoud" />
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
                <FormikRte name="article-3" label="Inhoud" />
            </AccordionContent>
        </AccordionItem>
    </Accordion>
)

export default ModuleDecisionModal
