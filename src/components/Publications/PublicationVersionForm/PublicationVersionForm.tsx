import {
    Button,
    cn,
    Divider,
    formatDate,
    FormikDate,
    FormikInput,
    FormikRte,
    FormikSelect,
    FormikTextArea,
    Notification,
    Text,
    Tooltip,
} from '@pzh-ui/components'
import { useMountEffect } from '@react-hookz/web'
import { Form, Formik, FormikConfig, FormikProps, FormikValues } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'

import { usePublicationVersionsGetListAttachments } from '@/api/fetchers'
import {
    AttachmentShort,
    HTTPValidationError,
    PublicationVersion,
} from '@/api/fetchers.schemas'
import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import FieldArray from '@/components/Form/FieldArray'
import ScrollToFieldError from '@/components/ScrollToFieldError'
import { useModuleStatusData } from '@/hooks/useModuleStatusData'
import { usePrompt } from '@/hooks/usePrompt'
import useModalStore from '@/store/modalStore'
import { collectStringValues } from '@/utils/collectStringValues'
import handleError from '@/utils/handleError'
import { parseUtc } from '@/utils/parseUtc'
import { TrashCan, TriangleExclamationSolid } from '@pzh-ui/icons'
import { useMemo, useState } from 'react'

const DOCUMENT_REF = 'REF_BILL_PDF'

interface PublicationVersionFormProps {
    isRequired?: boolean
    error?: {
        data: HTTPValidationError
    }
}

const PublicationVersionForm = <
    TData extends FormikValues & PublicationVersion,
>({
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

const InnerForm = <TData extends FormikValues & PublicationVersion>({
    isSubmitting,
    isRequired,
    error,
    errors,
    values,
    dirty,
    ...rest
}: PublicationVersionFormProps & FormikProps<TData>) => {
    const { moduleId, versionUUID } = useParams()
    const navigate = useNavigate()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { statusOptions, lastStatus, isLoading } =
        useModuleStatusData(moduleId)

    const isLastStatus = useMemo(
        () => values.Module_Status_ID === lastStatus?.ID,
        [lastStatus, values.Module_Status_ID]
    )

    const { data: attachments } = usePublicationVersionsGetListAttachments(
        String(versionUUID),
        {
            query: {
                enabled: !!versionUUID,
            },
        }
    )

    const usedDocumentRefs = useMemo(() => {
        const content = collectStringValues(values.Bill_Compact).join(' ')

        return new Set(
            Array.from(
                content.matchAll(
                    new RegExp(`\\[${DOCUMENT_REF}:(\\d+)\\]`, 'g')
                )
            ).map(match => Number(match[1]))
        )
    }, [values.Bill_Compact])

    useMountEffect(() => {
        if (!!error) {
            setTimeout(() => {
                handleError(error, rest)
            }, 100)
        }
    })

    /**
     * Show prompt message when leaving the page without saving changes
     */
    usePrompt(
        'Weet je zeker dat je deze pagina wilt verlaten? Wijzigingen die je hebt aangebracht, worden niet opgeslagen.',
        dirty && !isSubmitting
    )

    return (
        <Form noValidate>
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
                    {!isLoading && !isLastStatus && (
                        <Notification
                            className="mt-2 w-full"
                            title="Recentere modulestatus beschikbaar">
                            De modulestatus is niet de meest recente versie die
                            beschikbaar is.
                        </Notification>
                    )}
                </div>
                <div>
                    <FormikInput
                        name="Bill_Metadata.Official_Title"
                        label="Officiële titel van het besluit"
                        description="Format van de officiële titel: (Ontwerp)besluit van [Gedeputeerde staten/Provinciale Staten] van Zuid-Holland van dd m jjjj, nr. XXXX tot wijziging van [de omgevingsvisie Zuid-Holland/ het omgevingsprogramma Zuid-Holland] [Naam herziening incl. Omgevingsbeleid]"
                        placeholder="Ontwerpbesluit van Provinciale Staten van Zuid-Holland van 12 maart 2026, nr. 1234 tot wijziging van de omgevingsvisie Zuid-Holland Herziening Omgevingsbeleid 2025"
                        required
                    />
                </div>
                <div>
                    <FormikInput
                        name="Bill_Metadata.Quote_Title"
                        label="Citeertitel"
                        description="Format van de citeertitel: (Ontwerp)besluit wijziging omgevingsvisie [Naam herziening]"
                        placeholder="Ontwerpbesluit wijziging omgevingsvisie Zuid-Holland Herziening 2025"
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
                <div>
                    <FormikInput
                        name="Bill_Compact.Motivation.Title"
                        label="Motivering"
                        placeholder="Titel"
                    />
                </div>
                <div>
                    <FormikRte
                        name="Bill_Compact.Motivation.Content"
                        customMenuOptions={['heading']}
                    />
                </div>

                <div className="bg-pzh-gray-100 flex flex-col gap-4 p-4">
                    <div>
                        <Text bold color="text-pzh-blue-500">
                            Documenten bij het besluit
                        </Text>
                        <Text size="s">
                            Upload hier je documenten en kopieer het ID om in de
                            bijlages te gebruiken.
                        </Text>
                    </div>
                    <div className="flex flex-col gap-2">
                        {attachments?.map(attachment => (
                            <Document
                                key={attachment.File_UUID}
                                {...attachment}
                                isUsed={usedDocumentRefs.has(attachment.ID)}
                            />
                        ))}
                    </div>
                    <div>
                        <Button
                            size="small"
                            onPress={() =>
                                setActiveModal('publicationAttachmentAdd')
                            }>
                            Upload een document
                        </Button>
                    </div>
                </div>

                <Appendices />

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
                                popperPlacement="top"
                            />
                        </div>
                        {values.Publication.Procedure_Type !== 'draft' && (
                            <div>
                                <FormikDate
                                    name="Effective_Date"
                                    label="Inwerkingtredingsdatum"
                                    placeholder="Kies een datum"
                                    required={isRequired}
                                    popperPlacement="top"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ButtonSubmitFixed
                onCancel={() =>
                    navigate(`/muteer/modules/${moduleId}/besluiten`)
                }
                disabled={isSubmitting}
                isLoading={isSubmitting}
            />

            <ScrollToFieldError />
        </Form>
    )
}

const Articles = () => (
    <div className="bg-pzh-gray-100 flex flex-col gap-4 p-4">
        <Text bold color="text-pzh-blue-500">
            Artikelen
        </Text>

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
            itemClassName="py-4 px-0 border-t border-pzh-gray-300 gap-4"
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

const Appendices = () => (
    <div className="bg-pzh-gray-100 flex flex-col gap-4 p-4">
        <div>
            <Text bold color="text-pzh-blue-500">
                Bijlages bij het besluit
            </Text>
            <Text size="s">
                Om de bijlages als links in de tekst te tonen moet je in de
                tekst refereren naar [{DOCUMENT_REF}:ID] waar ID de nummer van
                het bestand is. Hierboven kan je het ID van je bestanden zien en
                het ID daarvan kopiëren
            </Text>
        </div>

        <FieldArray
            name="Bill_Compact.Appendices"
            label=""
            arrayLabel="Bijlage"
            buttonLabel="Bijlage toevoegen"
            buttonOptions={{
                variant: 'secondary',
                size: 'small',
            }}
            itemClassName="py-4 px-0 border-t border-pzh-gray-300 gap-1"
            wrapperClassName="grid grid-cols-2 gap-2 [&>div:last-child]:col-span-2"
            fields={[
                {
                    type: 'text',
                    name: 'Number',
                    label: 'Nummer',
                    placeholder: 'Bijv. "1, A, a, I"',
                },
                {
                    type: 'text',
                    name: 'Title',
                    label: 'Titel',
                    placeholder: 'Titel van de bijlage',
                },
                {
                    type: 'wysiwyg',
                    name: 'Content',
                    label: '',
                },
            ]}
        />

        <Divider />

        <div>
            <Text bold color="text-pzh-blue-500">
                Bijlages bij de motivering
            </Text>
            <Text size="s">
                Om de bijlages als links in de tekst te tonen moet je in de
                tekst refereren naar [{DOCUMENT_REF}:ID] waar ID de nummer van
                het bestand is. Hierboven kan je het ID van je bestanden zien en
                het ID daarvan kopiëren
            </Text>
        </div>

        <FieldArray
            name="Bill_Compact.Motivation.Appendices"
            label=""
            arrayLabel="Bijlage"
            buttonLabel="Bijlage toevoegen"
            buttonOptions={{
                variant: 'secondary',
                size: 'small',
            }}
            itemClassName="py-4 px-0 border-t border-pzh-gray-300 gap-1"
            wrapperClassName="grid grid-cols-2 gap-2 [&>div:last-child]:col-span-2"
            fields={[
                {
                    type: 'text',
                    name: 'Number',
                    label: 'Nummer',
                    placeholder: 'Bijv. "1, A, a, I"',
                },
                {
                    type: 'text',
                    name: 'Title',
                    label: 'Titel',
                    placeholder: 'Titel van de bijlage',
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

const Document = ({
    Created_Date,
    ID,
    Filename,
    isUsed,
    ...rest
}: AttachmentShort & { isUsed: boolean }) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [copied, setCopied] = useState(false)

    const createdDate = useMemo(
        () => formatDate(parseUtc(Created_Date), "dd-MM-yyyy 'om' HH:mm"),
        [Created_Date]
    )

    const copyClipboard = async () => {
        await navigator.clipboard.writeText(`[${DOCUMENT_REF}:${ID}]`)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
    }

    return (
        <div className="flex min-w-0 gap-2">
            <div
                className={cn(
                    'border-pzh-gray-600 bg-pzh-white flex min-w-0 flex-1 justify-between gap-2 rounded-sm border px-4 py-2',
                    {
                        'border-pzh-yellow-500 bg-pzh-yellow-10': !isUsed,
                    }
                )}>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                    <Text
                        bold
                        className="text-heading-xs border-pzh-gray-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                        {ID}
                    </Text>

                    <div className="flex min-w-0 flex-1 items-center gap-1">
                        <Text
                            bold
                            color="text-pzh-blue-500"
                            className="text-heading-xs block truncate"
                            title={Filename}>
                            {Filename}
                        </Text>
                        {!isUsed && (
                            <Tooltip
                                label={
                                    <Text size="s" color="text-pzh-white">
                                        Dit document wordt nog niet gebruikt als
                                        bijlage. Kopieer en gebruik de
                                        referentiecode hieronder in een
                                        tekstveld.
                                    </Text>
                                }>
                                <TriangleExclamationSolid className="min-w-4 cursor-help" />
                            </Tooltip>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                    <Text size="s">Geüpload op {createdDate}</Text>

                    <Button
                        size="small"
                        variant={copied ? 'primary' : 'secondary'}
                        className={cn(
                            'h-8 min-w-[105px] justify-center transition-all duration-200 active:scale-95',
                            { 'scale-105': copied }
                        )}
                        onPress={copyClipboard}>
                        {copied ? 'Gekopieerd!' : 'Kopieer ID'}
                    </Button>
                </div>
            </div>

            <Button
                variant="default"
                className="text-pzh-red-500 shrink-0"
                onPress={() =>
                    setActiveModal('publicationAttachmentDelete', {
                        attachment: { Created_Date, ID, Filename, ...rest },
                    })
                }>
                <TrashCan />
            </Button>
        </div>
    )
}

export default PublicationVersionForm
