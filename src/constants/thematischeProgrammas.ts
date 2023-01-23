import { readBeleidsdoelen, readValidBeleidsdoelen } from '@/api/fetchers'

export const apiCall = readBeleidsdoelen
export const validApiCall = readValidBeleidsdoelen

export const TITLE_SINGULAR = 'Thematische programma'
export const TITLE_SINGULAR_PREFIX = 'het'
export const TITLE_PLURAL = 'Thematische programma’s'
export const API_ENDPOINT = 'beleidsdoelen'
export const API_ENDPOINT_VIGEREND = 'valid/beleidsdoelen'
export const SLUG_OVERVIEW = 'thematische-programmas'
export const DESCRIPTION =
    'De provincie heeft een aantal beleidsdoelen geformuleerd. Deze beleidsdoelen zijn direct de thema’s voor de thematische programma’s. Een overzicht van alle thematische programma’s vindt u hier.'
