import { AngleDown, DrawPolygon } from '@pzh-ui/icons'

import {
    useGebiedsaanwijzingEditObjectStatic,
    useGebiedsaanwijzingGetListActiveModuleObjects,
    useGebiedsaanwijzingListValidLineageTree,
    useGebiedsaanwijzingListValidLineages,
    useGebiedsaanwijzingPostModulePatchObject,
    useGebiedsaanwijzingViewModuleObjectLatest,
    useGebiedsaanwijzingViewObjectLatest,
    useGebiedsaanwijzingViewObjectVersion,
    useGetRevisionsGebiedsaanwijzingVersion,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'
import { z } from 'zod'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useGebiedsaanwijzingListValidLineages,
    useGetValidLineage: useGebiedsaanwijzingListValidLineageTree,
    useGetVersion: useGebiedsaanwijzingViewObjectVersion,
    useGetLatestLineage: useGebiedsaanwijzingViewObjectLatest,
    useGetRevision: useGetRevisionsGebiedsaanwijzingVersion,
    useGetRelations: null,
    usePutRelations: null,
    useGetLatestLineageInModule: useGebiedsaanwijzingViewModuleObjectLatest,
    usePatchObjectInModule: useGebiedsaanwijzingPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useGebiedsaanwijzingEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useGebiedsaanwijzingGetListActiveModuleObjects,
}

const gebiedsaanwijzing: DynamicObject<typeof fetchers> = {
    defaults: {
        singular: 'gebiedsaanwijzing',
        singularReadable: 'gebiedsaanwijzing',
        singularCapitalize: 'Gebiedsaanwijzing',
        plural: 'gebiedsaanwijzingen',
        pluralReadable: 'gebiedsaanwijzingen',
        pluralCapitalize: 'Gebiedsaanwijzingen',
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
            title: 'Gebiedsaanwijzing',
            description:
                'Een gebiedsaanwijzing wordt gebruikt als een annotatie waarmee nadere informatie kan worden toegevoegd aan een gebied dat is aangewezen door een juridische regel of een tekstdeel.',
            fields: [
                {
                    name: 'Title',
                    label: 'Naam',
                    description:
                        'De naam is het meest gedetailleerde niveau waarop je de gebiedsaanwijzing inhoudelijk kunt duiden. Je bent vrij in de keuze van de naam van de gebiedsaanwijzing.',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Ref_Type',
                    label: 'Gebiedsaanwijzing Type',
                    placeholder: 'Selecteer een type',
                    description:
                        'Er zijn thematische typen gebiedsaanwijzing, zoals bodem, geluid, defensie verkeer, etc. en er zijn drie niet-thematische typen gebiedsaanwijzing, namelijk functie, beperkingengebied en ruimtelijk gebruik.',
                    type: 'areaAnnotate',
                    optionType: 'type',
                    required: true,
                },
                {
                    name: 'Ref_Group',
                    label: 'Gebiedsaanwijzing Groep',
                    placeholder: 'Selecteer een groep',
                    description:
                        'Met de groep kun je de gebiedsaanwijzing nog meer specificeren. De groep kies je uit een limitatieve waardelijst.',
                    type: 'areaAnnotate',
                    optionType: 'group',
                    required: true,
                },
                {
                    name: 'Target_Codes',
                    label: 'Locaties',
                    description:
                        'Hiermee selecteer je de bijbehorende geo-data, meestal is dit de legenda laag van een kaart. Denk hierbij aan gebieden, lijnen en punten en de groepen hiervan.',
                    type: 'search',
                    status: 'all',
                    isMulti: true,
                    closeMenuOnSelect: false,
                    placeholder: 'Zoek op locaties',
                    filterType: ['gebiedengroep', 'gebied'],
                    objectKey: 'Object_Code',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                    required: true,
                    // @ts-ignore
                    validation: z
                        .array(
                            z.union([
                                z.string(),
                                z.object({ label: z.any(), value: z.string() }),
                            ])
                        )
                        .optional()
                        .nullable()
                        .transform(val =>
                            val?.map(v => (typeof v === 'string' ? v : v.value))
                        ),
                },
            ],
        },
    ],
}

gebiedsaanwijzing.validationSchema = generateDynamicSchema(
    gebiedsaanwijzing.dynamicSections
)

export default gebiedsaanwijzing
