import { useMemo, useState } from 'react'

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
import {
    ArrowUpRightFromSquare,
    TrashCan,
    TriangleExclamationSolid,
} from '@pzh-ui/icons'

import { useMountEffect } from '@react-hookz/web'
import { useQuery } from '@tanstack/react-query'
import { Form, Formik, FormikConfig, FormikProps, FormikValues } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'

import {
    getPublicationVersionsGetDownloadAttachmentQueryKey,
    usePublicationVersionsGetListAttachments,
} from '@/api/fetchers'
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
import { downloadFile } from '@/utils/file'
import handleError from '@/utils/handleError'
import { parseUtc } from '@/utils/parseUtc'

const DOCUMENT_REF = 'REF_BILL_PDF'

interface PublicationVersionFormProps {
    isRequired?: boolean
    readOnly?: boolean
    error?: {
        data: HTTPValidationError
    }
}

const PublicationVersionForm = <
    TData extends FormikValues & PublicationVersion,
>({
    isRequired,
    readOnly,
    error,
    ...rest
}: PublicationVersionFormProps & FormikConfig<TData>) => (
    <Formik enableReinitialize validateOnBlur={false} {...rest}>
        {props => (
            <InnerForm
                isRequired={isRequired}
                readOnly={readOnly}
                error={error}
                {...props}
            />
        )}
    </Formik>
)

const InnerForm = <TData extends FormikValues & PublicationVersion>({
    isSubmitting,
    isRequired,
    readOnly,
    error,
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
        () => values.module_status_id === lastStatus?.id,
        [lastStatus, values.module_status_id]
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
        const content = collectStringValues(values.bill_compact).join(' ')

        return new Set(
            Array.from(
                content.matchAll(
                    new RegExp(`\\[${DOCUMENT_REF}:(\\d+)\\]`, 'g')
                )
            ).map(match => Number(match[1]))
        )
    }, [values.bill_compact])

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
            <fieldset
                disabled={readOnly}
                className={cn({
                    'pointer-events-none opacity-70': readOnly,
                })}>
                <div className="flex flex-col gap-4">
                    <div>
                        <FormikSelect
                            key={isLoading.toString()}
                            name="module_status_id"
                            label="Modulestatus"
                            placeholder="Selecteer een modulestatus"
                            options={statusOptions}
                            required
                            disabled={readOnly}
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
                                De modulestatus is niet de meest recente versie
                                die beschikbaar is.
                            </Notification>
                        )}
                    </div>
                    <div>
                        <FormikInput
                            name="bill_metadata.official_title"
                            label="Officiële titel van het besluit"
                            description="Format van de officiële titel: (Ontwerp)besluit van [Gedeputeerde staten/Provinciale Staten] van Zuid-Holland van dd m jjjj, nr. XXXX tot wijziging van [de omgevingsvisie Zuid-Holland/ het omgevingsprogramma Zuid-Holland] [Naam herziening incl. Omgevingsbeleid]"
                            placeholder="Ontwerpbesluit van Provinciale Staten van Zuid-Holland van 12 maart 2026, nr. 1234 tot wijziging van de omgevingsvisie Zuid-Holland Herziening Omgevingsbeleid 2025"
                            required
                        />
                    </div>
                    <div>
                        <FormikInput
                            name="bill_metadata.quote_title"
                            label="Citeertitel"
                            description="Format van de citeertitel: (Ontwerp)besluit wijziging omgevingsvisie [Naam herziening]"
                            placeholder="Ontwerpbesluit wijziging omgevingsvisie Zuid-Holland Herziening 2025"
                            required
                        />
                    </div>
                    <div>
                        <FormikRte
                            name="bill_compact.preamble"
                            label="Aanhef"
                            disabled={readOnly}
                        />
                    </div>
                    <Articles readOnly={readOnly} />
                    <div>
                        <FormikRte
                            name="bill_compact.closing"
                            label="Sluiting"
                            placeholder="Bijv. Gegeven te 's-Gravenhage, 27 september 2023"
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <FormikRte
                            name="bill_compact.signed"
                            label="Ondertekening"
                            disabled={readOnly}
                        />
                    </div>
                    <div>
                        <FormikInput
                            name="bill_compact.motivation.title"
                            label="Motivering"
                            placeholder="Titel"
                        />
                    </div>
                    <div>
                        <FormikRte
                            name="bill_compact.motivation.content"
                            customMenuOptions={['heading']}
                            disabled={readOnly}
                        />
                    </div>

                    <div className="flex flex-col gap-4 bg-pzh-gray-100 p-4">
                        <div>
                            <Text bold color="text-pzh-blue-500">
                                Documenten bij het besluit
                            </Text>
                            <Text size="s">
                                Upload hier je documenten en kopieer het ID om
                                in de bijlages te gebruiken.
                            </Text>
                        </div>
                        <div className="flex flex-col gap-2">
                            {attachments?.map(attachment => (
                                <Document
                                    key={attachment.file_id}
                                    {...attachment}
                                    isUsed={usedDocumentRefs.has(attachment.id)}
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

                    <Appendices readOnly={readOnly} />

                    <div className="flex flex-col gap-4 bg-pzh-gray-100 p-4">
                        <Text>Procedureverloop</Text>

                        <div className="flex gap-4 [&_>div]:flex-1">
                            <div>
                                <FormikDate
                                    name="procedural.enactment_date"
                                    label="Vaststellingsdatum"
                                    placeholder="Kies een datum"
                                />
                            </div>
                            <div>
                                <FormikDate
                                    name="procedural.signed_date"
                                    label="Datum van ondertekening"
                                    placeholder="Kies een datum"
                                    required={isRequired}
                                />
                            </div>
                            <div>
                                <FormikDate
                                    name="procedural.procedural_announcement_date"
                                    label="Bekend op"
                                    placeholder="Kies een datum"
                                    required={isRequired}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 bg-pzh-gray-100 p-4">
                        <Text>Juridische data</Text>

                        <div className="flex gap-4 [&_>div]:flex-1">
                            <div>
                                <FormikDate
                                    name="announcement_date"
                                    label="Bekendmakingsdatum"
                                    placeholder="Kies een datum"
                                    required={isRequired}
                                    popperPlacement="top"
                                />
                            </div>
                            {values.publication.procedure_type !== 'draft' && (
                                <div>
                                    <FormikDate
                                        name="effective_date"
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
            </fieldset>

            {!readOnly && (
                <ButtonSubmitFixed
                    onCancel={() =>
                        navigate(`/muteer/modules/${moduleId}/besluiten`)
                    }
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                />
            )}

            <ScrollToFieldError />
        </Form>
    )
}

const Articles = ({ readOnly }: { readOnly?: boolean }) => (
    <div className="flex flex-col gap-4 bg-pzh-gray-100 p-4">
        <Text bold color="text-pzh-blue-500">
            Artikelen
        </Text>

        <div>
            <FormikTextArea
                name="bill_compact.amendment_article"
                label="Wijzigingsartikel"
            />
        </div>

        <div>
            <FormikRte
                name="bill_compact.time_article"
                label="Inwerkingstredingartikel"
                disabled={readOnly}
            />
        </div>

        <FieldArray
            name="bill_compact.custom_articles"
            label=""
            arrayLabel="Artikel"
            buttonLabel="Artikel toevoegen"
            buttonOptions={{
                variant: 'secondary',
                size: 'small',
            }}
            disabled={readOnly}
            itemClassName="py-4 px-0 border-t border-pzh-gray-300 gap-4"
            fields={[
                {
                    type: 'text',
                    name: 'number',
                    label: 'Nummer',
                    placeholder: 'Voer hier een nummer in, bijvoorbeeld: III',
                },
                {
                    type: 'wysiwyg',
                    name: 'content',
                    label: 'Inhoud van artikel',
                },
            ]}
        />
    </div>
)

const Appendices = ({ readOnly }: { readOnly?: boolean }) => (
    <div className="flex flex-col gap-4 bg-pzh-gray-100 p-4">
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
            name="bill_compact.appendices"
            label=""
            arrayLabel="Bijlage"
            buttonLabel="Bijlage toevoegen"
            buttonOptions={{
                variant: 'secondary',
                size: 'small',
            }}
            disabled={readOnly}
            itemClassName="py-4 px-0 border-t border-pzh-gray-300 gap-1"
            wrapperClassName="grid grid-cols-2 gap-2 [&>div:last-child]:col-span-2"
            fields={[
                {
                    type: 'text',
                    name: 'number',
                    label: 'Nummer',
                    placeholder: 'Bijv. "1, A, a, I"',
                },
                {
                    type: 'text',
                    name: 'title',
                    label: 'Titel',
                    placeholder: 'Titel van de bijlage',
                },
                {
                    type: 'wysiwyg',
                    name: 'content',
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
            name="bill_compact.motivation.appendices"
            label=""
            arrayLabel="Bijlage"
            buttonLabel="Bijlage toevoegen"
            buttonOptions={{
                variant: 'secondary',
                size: 'small',
            }}
            disabled={readOnly}
            itemClassName="py-4 px-0 border-t border-pzh-gray-300 gap-1"
            wrapperClassName="grid grid-cols-2 gap-2 [&>div:last-child]:col-span-2"
            fields={[
                {
                    type: 'text',
                    name: 'number',
                    label: 'Nummer',
                    placeholder: 'Bijv. "1, A, a, I"',
                },
                {
                    type: 'text',
                    name: 'title',
                    label: 'Titel',
                    placeholder: 'Titel van de bijlage',
                },
                {
                    type: 'wysiwyg',
                    name: 'content',
                    label: '',
                },
            ]}
        />
    </div>
)

const Document = ({
    created_date,
    id,
    filename,
    file_id,
    isUsed,
    ...rest
}: AttachmentShort & { isUsed: boolean }) => {
    const { versionUUID } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [copied, setCopied] = useState(false)

    const createdDate = useMemo(
        () => formatDate(parseUtc(created_date), "dd-MM-yyyy 'om' HH:mm"),
        [created_date]
    )

    const copyClipboard = async () => {
        await navigator.clipboard.writeText(`[${DOCUMENT_REF}:${id}]`)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
    }

    const downloadDocument = useQuery({
        queryKey: ['downloadAttachmentFile', file_id],
        queryFn: () =>
            downloadFile(
                getPublicationVersionsGetDownloadAttachmentQueryKey(
                    String(versionUUID),
                    id
                )[0],
                undefined,
                true
            ),
        enabled: false,
    })

    return (
        <div className="flex min-w-0 gap-2">
            <div
                className={cn(
                    'flex min-w-0 flex-1 justify-between gap-4 rounded-sm border border-pzh-gray-600 bg-pzh-white px-4 py-2',
                    {
                        'border-pzh-yellow-500 bg-pzh-yellow-10': !isUsed,
                    }
                )}>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                    <Text
                        bold
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-pzh-gray-600 text-heading-xs">
                        {id}
                    </Text>

                    <div className="flex min-w-0 items-center gap-4">
                        <Button
                            variant="default"
                            onPress={() => downloadDocument.refetch()}
                            className="flex min-w-0 flex-1 items-center">
                            <Text
                                bold
                                color="text-pzh-blue-500"
                                className="block truncate text-heading-xs underline"
                                title={filename}>
                                {filename}
                            </Text>{' '}
                            <ArrowUpRightFromSquare
                                className="ml-1 min-w-3.5"
                                size={14}
                            />
                        </Button>
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
                                <TriangleExclamationSolid
                                    className="min-w-4.5 cursor-help"
                                    size={18}
                                />
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
                            'h-8 min-w-26.25 justify-center transition-all duration-200 active:scale-95',
                            { 'scale-105': copied }
                        )}
                        onPress={copyClipboard}>
                        {copied ? 'Gekopieerd!' : 'Kopieer ID'}
                    </Button>
                </div>
            </div>

            <Button
                variant="default"
                className="shrink-0 text-pzh-red-500"
                onPress={() =>
                    setActiveModal('publicationAttachmentDelete', {
                        attachment: {
                            created_date,
                            id,
                            filename,
                            file_id,
                            ...rest,
                        },
                    })
                }>
                <TrashCan />
            </Button>
        </div>
    )
}

export default PublicationVersionForm
