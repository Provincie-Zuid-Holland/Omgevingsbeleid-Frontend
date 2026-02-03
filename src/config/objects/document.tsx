import { FilePdf } from '@pzh-ui/icons'

import {
    useDocumentEditObjectStatic,
    useDocumentGetListActiveModuleObjects,
    useDocumentListValidLineageTree,
    useDocumentListValidLineages,
    useDocumentPostModulePatchObject,
    useDocumentViewModuleObjectLatest,
    useDocumentViewObjectLatest,
    useDocumentViewObjectVersion,
    useGetRevisionsDocumentVersion,
} from '@/api/fetchers'
import {
    DocumentPatch,
    DocumentStaticPostStatics,
} from '@/api/fetchers.schemas'
import { schemaDefaults } from '@/validation/zodSchema'

import { generateDynamicSchema } from '@/validation/dynamicObject'
import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useDocumentListValidLineages,
    useGetValidLineage: useDocumentListValidLineageTree,
    useGetVersion: useDocumentViewObjectVersion,
    useGetLatestLineage: useDocumentViewObjectLatest,
    useGetRevision: useGetRevisionsDocumentVersion,
    useGetRelations: null,
    usePutRelations: null,
    useGetLatestLineageInModule: useDocumentViewModuleObjectLatest,
    usePatchObjectInModule: useDocumentPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useDocumentEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useDocumentGetListActiveModuleObjects,
}

const document: DynamicObject<
    typeof fetchers,
    keyof DocumentPatch,
    (keyof DocumentStaticPostStatics)[]
> = {
    defaults: {
        singular: 'document',
        singularReadable: 'document',
        singularCapitalize: 'Document',
        plural: 'documenten',
        pluralReadable: 'documenten',
        pluralCapitalize: 'Documenten',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        demonstrative: 'deze',
        icon: FilePdf,
    },
    staticData: ['Owner_1_UUID', 'Owner_2_UUID'],
    fetchers,
    dynamicSections: [
        {
            title: 'Titel en bestandsnaam',
            description:
                'De titel van het document, is wat we standaard tonen. De bestandsnaam is hoe het document heet als een gebruiker het bestand bekijkt of download.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Filename',
                    label: 'Bestandsnaam',
                    description:
                        'Voer een bestandsnaam in die enkel uit letters, cijfers, minnetjes en punten bestaat. Deze bestandsnaam wordt gebruikt bij de publicatie naar de landelijke voorziening.',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults
                        .requiredString()
                        .regex(
                            /^[\w\-.]+\.pdf$/,
                            'Het veld is niet goed ingevuld en moet eindigen op ".pdf".'
                        ),
                },
                {
                    name: 'Description',
                    label: 'Omschrijving',
                    type: 'wysiwyg',
                    required: true,
                },
            ],
        },
        {
            title: 'Bestand uploaden',
            description: 'Selecteer hier het daadwerkelijke bestand.',
            fields: [
                {
                    name: 'File_UUID',
                    label: 'Bestand',
                    type: 'file',
                    required: true,
                },
            ],
        },
    ],
}

document.validationSchema = generateDynamicSchema(document.dynamicSections)

export default document
