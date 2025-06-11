import { FilePdf } from '@pzh-ui/icons'

import {
    useDocumentStaticLineageIdPost,
    useDocumentenLatestLineageIdGet,
    useDocumentenValidGet,
    useDocumentenValidLineageIdGet,
    useDocumentenVersionObjectUuidGet,
    useModulesModuleIdObjectDocumentLatestLineageIdGet,
    useModulesModuleIdObjectDocumentLineageIdPatch,
    useModulesObjectDocumentActiveLineageIdGet,
    useRevisionsModuleIdDocumentVersionObjectUuidGet,
} from '@/api/fetchers'
import {
    DocumentPatch,
    DocumentStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useDocumentenValidGet,
    useGetValidLineage: useDocumentenValidLineageIdGet,
    useGetVersion: useDocumentenVersionObjectUuidGet,
    useGetLatestLineage: useDocumentenLatestLineageIdGet,
    useGetRevision: useRevisionsModuleIdDocumentVersionObjectUuidGet,
    useGetRelations: null,
    usePutRelations: null,
    useGetLatestLineageInModule:
        useModulesModuleIdObjectDocumentLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectDocumentLineageIdPatch,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useDocumentStaticLineageIdPost,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useModulesObjectDocumentActiveLineageIdGet,
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
            title: 'Titel en bestandenaam',
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
                    type: 'text',
                    required: true,
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
