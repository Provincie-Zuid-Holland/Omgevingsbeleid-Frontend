import { DrawPolygon } from '@pzh-ui/icons'

import {
    useGebiedengroepEditObjectStatic,
    useGebiedengroepGetListActiveModuleObjects,
    useGebiedengroepListValidLineageTree,
    useGebiedengroepListValidLineages,
    useGebiedengroepPostModulePatchObject,
    useGebiedengroepViewGetObjectStatic,
    useGebiedengroepViewModuleObjectLatest,
    useGebiedengroepViewObjectLatest,
    useGebiedengroepViewObjectVersion,
    useGetRevisionsGebiedengroepVersion,
} from '@/api/fetchers'
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
    useGetStatic: useGebiedengroepViewGetObjectStatic,
    usePostStatic: useGebiedengroepEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useGebiedengroepGetListActiveModuleObjects,
}

const gebiedengroep: DynamicObject<typeof fetchers> = {
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
                    customMenuOptions: ['heading'],
                },
                {
                    name: 'Source_UUID',
                    label: 'Geodata koppelen',
                    description:
                        'Hieronder staan de ‘Werkingsgebieden’ uit de Geodatabase. Selecteer een ‘Werkingsgebied’ en kies vervolgens de gewenste versie. Zodra een versie wordt geselecteerd, worden onderliggende gebieden zichtbaar op de kaart.',
                    type: 'area',
                    required: true,
                },
            ],
        },
    ],
}

gebiedengroep.validationSchema = generateDynamicSchema(
    gebiedengroep.dynamicSections
)

export default gebiedengroep
