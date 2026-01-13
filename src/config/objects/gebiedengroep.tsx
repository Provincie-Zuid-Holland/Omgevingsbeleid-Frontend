import { DrawPolygon } from '@pzh-ui/icons'

import {
    useGebiedengroepEditObjectStatic,
    useGebiedengroepGetListActiveModuleObjects,
    useGebiedengroepListValidLineageTree,
    useGebiedengroepListValidLineages,
    useGebiedengroepPostModulePatchObject,
    useGebiedengroepViewModuleObjectLatest,
    useGebiedengroepViewObjectLatest,
    useGebiedengroepViewObjectVersion,
    useGetRevisionsGebiedengroepVersion,
} from '@/api/fetchers'
import {
    GebiedengroepPatch,
    GebiedengroepStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useGebiedengroepListValidLineages,
    useGetValidLineage: useGebiedengroepListValidLineageTree,
    useGetVersion: useGebiedengroepViewObjectVersion,
    useGetLatestLineage: useGebiedengroepViewObjectLatest,
    useGetRevision: useGetRevisionsGebiedengroepVersion,
    useGetRelations: null,
    usePutRelations: null,
    useGetLatestLineageInModule: useGebiedengroepViewModuleObjectLatest,
    usePatchObjectInModule: useGebiedengroepPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useGebiedengroepEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useGebiedengroepGetListActiveModuleObjects,
}

const gebiedengroep: DynamicObject<
    typeof fetchers,
    keyof GebiedengroepPatch | 'Source_UUID',
    (keyof GebiedengroepStaticPostStatics)[]
> = {
    defaults: {
        singular: 'gebiedengroep',
        singularReadable: 'gebiedengroep',
        singularCapitalize: 'Gebiedengroep',
        plural: 'gebiedengroepen',
        pluralReadable: 'gebiedengroepen',
        pluralCapitalize: 'Gebiedengroepen',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        icon: DrawPolygon,
    },
    staticData: ['Owner_1_UUID', 'Owner_2_UUID'],
    fetchers,
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de gebiedengroep kwijt. Een goede omschrijving is kort, krachtig en actief opgeschreven.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van de gebiedengroep.',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Omschrijving',
                    description:
                        'Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                },
            ],
        },
        {
            title: 'Geodata',
            fields: [
                {
                    name: 'Source_UUID',
                    label: 'Geodata koppelen',
                    description:
                        'Hieronder staan de ‘Werkingsgebieden’ uit de Geodatabase. Selecteer een ‘Werkingsgebied’ en kies vervolgens de gewenste versie. Zodra een versie wordt geselecteerd, worden onderliggende gebieden zichtbaar op de kaart.',
                    type: 'area',
                },
            ],
        },
    ],
}

gebiedengroep.validationSchema = generateDynamicSchema(
    gebiedengroep.dynamicSections
)

export default gebiedengroep
