import { DrawPolygon } from '@pzh-ui/icons'

import {
    useModulesModuleIdObjectWerkingsgebiedLatestLineageIdGet,
    useModulesModuleIdObjectWerkingsgebiedLineageIdPatch,
    useModulesObjectWerkingsgebiedActiveLineageIdGet,
    useRevisionsModuleIdWerkingsgebiedVersionObjectUuidGet,
    useWerkingsgebiedStaticLineageIdPost,
    useWerkingsgebiedenLatestLineageIdGet,
    useWerkingsgebiedenValidGet,
    useWerkingsgebiedenValidLineageIdGet,
    useWerkingsgebiedenVersionObjectUuidGet,
} from '@/api/fetchers'
import {
    WerkingsgebiedPatch,
    WerkingsgebiedStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useWerkingsgebiedenValidGet,
    useGetValidLineage: useWerkingsgebiedenValidLineageIdGet,
    useGetVersion: useWerkingsgebiedenVersionObjectUuidGet,
    useGetLatestLineage: useWerkingsgebiedenLatestLineageIdGet,
    useGetRevision: useRevisionsModuleIdWerkingsgebiedVersionObjectUuidGet,
    useGetRelations: null,
    usePutRelations: null,
    useGetLatestLineageInModule:
        useModulesModuleIdObjectWerkingsgebiedLatestLineageIdGet,
    usePatchObjectInModule:
        useModulesModuleIdObjectWerkingsgebiedLineageIdPatch,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useWerkingsgebiedStaticLineageIdPost,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useModulesObjectWerkingsgebiedActiveLineageIdGet,
}

const werkingsgebied: DynamicObject<
    typeof fetchers,
    keyof WerkingsgebiedPatch,
    (keyof WerkingsgebiedStaticPostStatics)[]
> = {
    defaults: {
        singular: 'werkingsgebied',
        singularReadable: 'werkingsgebied',
        singularCapitalize: 'Werkingsgebied',
        plural: 'werkingsgebieden',
        pluralCapitalize: 'Werkingsgebieden',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        demonstrative: 'dit',
        description:
            'De ambities geven aan waar de provincie naar wil streven. De ambities komen voort uit het coalitieakkoord en worden vastgesteld in de Omgevingsvisie.',
        icon: DrawPolygon,
    },
    staticData: ['Owner_1_UUID', 'Owner_2_UUID'],
    fetchers,
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de werkingsgebied kwijt. Een goede omschrijving is kort, krachtig en actief opgeschreven.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Omschrijving',
                    type: 'wysiwyg',
                },
            ],
        },
        {
            title: 'Database shape',
            description:
                'In deze sectie kun je de bron selecteren waarop dit werkingsgebied is gebaseerd.',
            fields: [
                {
                    name: 'Area_UUID',
                    label: 'Bron',
                    type: 'area',
                    placeholder:
                        'Zoek een werkingsgebied op naam of de naam van een versie',
                },
            ],
        },
    ],
}

werkingsgebied.validationSchema = generateDynamicSchema(
    werkingsgebied.dynamicSections
).superRefine(({ Title, Source_Title }: any, ctx) => {
    if (!!Source_Title && Title !== Source_Title) {
        ctx.addIssue({
            code: 'custom',
            message:
                'De titel moet overeen komen met de titel van de gekozen bron',
            path: ['Title'],
        })
    }
})

export default werkingsgebied
