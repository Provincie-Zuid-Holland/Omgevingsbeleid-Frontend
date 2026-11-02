import { DrawPolygon } from '@pzh-ui/icons'

import {
    useGebiedengroepEditObjectStatic,
    useGebiedengroepGetListActiveModuleObjects,
    useGebiedengroepListValidLineages,
    useGebiedengroepListValidLineageTree,
    useGebiedengroepPostModulePatchObject,
    useGebiedengroepViewGetObjectStatic,
    useGebiedengroepViewModuleObjectLatest,
    useGebiedengroepViewObjectLatest,
    useGebiedengroepViewObjectVersion,
    useGetRevisionsGebiedengroepVersion,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject, ModelFetchers } from './types'

const fetchers: ModelFetchers = {
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

const gebiedengroep: DynamicObject = {
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
    staticData: ['owner_1_id', 'owner_2_id'],
    fetchers,
    dynamicSections: [
        {
            fields: [
                {
                    name: 'title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van de gebiedengroep.',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'description',
                    label: 'Omschrijving',
                    description:
                        'Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
                    type: 'wysiwyg',
                    customMenuOptions: ['heading'],
                },
            ],
        },
        {
            fields: [
                {
                    name: 'source_uuid',
                    label: 'Geodata koppelen',
                    description:
                        'Hieronder staan de ‘Werkingsgebieden’ uit de Geodatabase. Selecteer een ‘Werkingsgebied’ en kies vervolgens de gewenste versie. Zodra een versie wordt geselecteerd, worden onderliggende gebieden zichtbaar op de kaart.',
                    type: 'area',
                    required: true,
                    notification: {
                        title: 'Onderliggende gebieden worden ook toegevoegd',
                        children:
                            'Een werkingsgebied (ook wel gebiedengroep) kan uit meerdere onderverdelingen (gebieden) bestaan. Zodra een versie van een gebiedengroep wordt gekozen, worden ook onderliggende gebieden toegevoegd aan de module.',
                    },
                },
            ],
        },
    ],
}

gebiedengroep.validationSchema = generateDynamicSchema(
    gebiedengroep.dynamicSections
)

export default gebiedengroep
