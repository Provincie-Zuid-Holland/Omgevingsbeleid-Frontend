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

const document: DynamicObject<typeof fetchers> = {
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
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van het document. Deze titel is wat we standaard tonen.',
                    placeholder: 'Bijv. ‘KRW Nota’',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Filename',
                    label: 'Bestandsnaam',
                    description:
                        'De bestandsnaam is hoe het document heet als een gebruiker het bestand bekijkt of downloadt. Voer een bestandsnaam in die enkel uit letters, cijfers, minnetjes en punten bestaat. Deze bestandsnaam wordt gebruikt bij de publicatie naar de landelijke voorziening.',
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
                    description:
                        'Geef kort en bondig aan waar het document over gaat.',
                    type: 'wysiwyg',
                    customMenuOptions: ['heading'],
                    required: true,
                },
                {
                    name: 'File_UUID',
                    label: 'Bestand',
                    description:
                        'Upload hier het daadwerkelijke .pdf bestand. Let op dat het ‘auteur’ veld in de meta-data van het bestand geen naam van jou of een collega bevat.',
                    placeholder: 'Selecteer een bestand om te uploaden',
                    type: 'file',
                    required: true,
                },
            ],
        },
    ],
}

document.validationSchema = generateDynamicSchema(document.dynamicSections)

export default document
