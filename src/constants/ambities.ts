import { string, date, object, Schema, ObjectSchema } from 'yup'

import {
    usePostAmbities,
    useGetAmbitiesLineageid,
    usePatchAmbitiesLineageid,
    useGetAmbities,
    useGetValidAmbities,
    getAmbities,
    getValidAmbities,
} from '@/api/fetchers'
import { AmbitiesWrite } from '@/api/fetchers.schemas'
import { SchemaMeta } from '@/types/schema'

import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const apiCall = getAmbities
export const validApiCall = getValidAmbities

export const TITLE_SINGULAR = 'Ambitie'
export const TITLE_SINGULAR_PREFIX = 'de'
export const TITLE_PLURAL = 'Ambities'
export const API_ENDPOINT = 'ambities'
export const API_ENDPOINT_VIGEREND = 'valid/ambities'
export const SLUG_OVERVIEW = 'ambities'
export const SLUG_CREATE_NEW = 'nieuwe-ambitie'
export const DESCRIPTION =
    'De ambities geven aan waar de provincie naar wil streven. De ambities komen voort uit het coalitieakkoord en worden vastgesteld in de Omgevingsvisie.'

// const queryAmbities = {
//     usePost: usePostAmbities,
//     useGet: useGetAmbities,
//     useGetLineage: useGetAmbitiesLineageid,
//     usePatchLineage: usePatchAmbitiesLineageid,
//     useGetValid: useGetValidAmbities,
// }

// const ambitiesMeta: SchemaMeta<typeof queryAmbities> = {
//     title: {
//         singular: 'ambitie',
//         singularCapitalized: 'Ambitie',
//         plural: 'ambities',
//         pluralCapitalized: 'Ambities',
//         prefix: 'de',
//         prefixCapitalized: 'de',
//     },
//     slug: {
//         overview: 'ambities',
//     },
//     query: queryAmbities,
// }

// export const SCHEMA: ObjectSchema<AmbitiesWrite> = object({
//     Titel: string()
//         .required('Vul een titel in')
//         .min(4, 'Vul een titel in van minimaal 4 karakters')
//         .max(100, 'Vul een titel in van maximaal 100 karakters')
//         .default(undefined),
//     Omschrijving: string().optional(),
//     Weblink: string().optional(),
//     Begin_Geldigheid: string().required().default(undefined),
//     Eind_Geldigheid: string().optional(),
// }).meta(ambitiesMeta)

// export const META = SCHEMA.describe().meta as SchemaMeta<typeof queryAmbities>

// export const EMPTY_WRITE_OBJECT: AmbitiesWrite = SCHEMA.getDefault()

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een titel in',
        testValue: `Test ambitie ${currentDateFormatted}`,
        type: 'text input',
    },
    Omschrijving: {
        initValue: null,
        required: false,
        requiredMessage: '',
        testValue: 'Omschrijving',
        type: 'text input',
    },
    Weblink: {
        initValue: null,
        required: false,
        requiredMessage: '',
        testValue: 'Weblink',
        type: 'text input',
    },
    Begin_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een datum van inwerkingstreding in',
        testValue: currentDate,
        type: 'date input',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: false,
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
        testValue: futureDate,
        type: 'date input',
    },
}
