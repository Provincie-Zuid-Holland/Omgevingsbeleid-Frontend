import { Hyperlink } from '@pzh-ui/components'
import { Pencil, Plus, Xmark } from '@pzh-ui/icons'

import * as models from '@/config/objects'
import { ModelPatchStaticType, ModelType } from '@/config/objects/types'
import { Role } from '@/context/AuthContext'

import { PublicModuleObjectRevision } from '../api/fetchers.schemas'

export const getStaticDataLabel = (key: keyof ModelPatchStaticType) => {
    switch (key) {
        case 'Client_1_UUID':
            return 'Ambtelijk opdrachtgever'
        case 'Owner_1_UUID':
            return 'Eerste eigenaar'
        case 'Owner_2_UUID':
            return 'Tweede eigenaar'
        case 'Portfolio_Holder_1_UUID':
            return 'Eerste portefeuillehouder'
        case 'Portfolio_Holder_2_UUID':
            return 'Tweede portefeuillehouder'
        default:
            throw new Error(
                `Oh no! The type '${key}' could not be found within ModelPatchStaticType...`
            )
    }
}

export const getStaticDataPropertyKey = (key: keyof ModelPatchStaticType) => {
    switch (key) {
        case 'Client_1_UUID':
            return 'Client_1'
        case 'Owner_1_UUID':
            return 'Owner_1'
        case 'Owner_2_UUID':
            return 'Owner_2'
        case 'Portfolio_Holder_1_UUID':
            return 'Portfolio_Holder_1'
        case 'Portfolio_Holder_2_UUID':
            return 'Portfolio_Holder_2'
        default:
            throw new Error(
                `Oh no! The type '${key}' could not be found within ModelPatchStaticType...`
            )
    }
}

export const getStaticDataPropertyRequired = (
    key: keyof ModelPatchStaticType
) => {
    switch (key) {
        case 'Client_1_UUID':
        case 'Owner_2_UUID':
        case 'Portfolio_Holder_1_UUID':
        case 'Portfolio_Holder_2_UUID':
            return false
        case 'Owner_1_UUID':
            return true
        default:
            throw new Error(
                `Oh no! The type '${key}' could not be found within ModelPatchStaticType...`
            )
    }
}

export const getStaticDataFilterProperty = (
    key: keyof ModelPatchStaticType
) => {
    switch (key) {
        case 'Owner_1_UUID':
            return 'Owner_2'
        case 'Owner_2_UUID':
            return 'Owner_1'
        case 'Portfolio_Holder_1_UUID':
            return 'Portfolio_Holder_2'
        case 'Portfolio_Holder_2_UUID':
            return 'Portfolio_Holder_1'
        default:
            break
    }
}

export const getStaticDataFilterRoles = (
    key: keyof ModelPatchStaticType
): Role[] | undefined => {
    switch (key) {
        case 'Owner_1_UUID':
        case 'Owner_2_UUID':
            return [
                'Functioneel beheerder',
                'Beheerder',
                'Behandelend Ambtenaar',
                'Ambtelijk opdrachtgever',
            ]
        case 'Portfolio_Holder_1_UUID':
        case 'Portfolio_Holder_2_UUID':
            return ['Portefeuillehouder']
        case 'Client_1_UUID':
            return ['Ambtelijk opdrachtgever']
        default:
            break
    }
}

export const getObjectActionText = (action?: string) => {
    switch (action) {
        case 'Toevoegen':
        case 'Create':
            return 'Toevoegen'
        case 'Edit':
            return 'Wijzigen'
        case 'Terminate':
            return 'Vervallen'
        default:
            break
    }
}

export const getPublicObjectActionText = (action?: string) => {
    switch (action) {
        case 'Toevoegen':
        case 'Create':
            return 'Wordt toegevoegd'
        case 'Edit':
            return 'Wordt gewijzigd'
        case 'Terminate':
            return 'Wordt ingetrokken'
        default:
            break
    }
}

export const getPublicObjectActionIcon = (action?: string) => {
    switch (action) {
        case 'Toevoegen':
        case 'Create':
            return Plus
        case 'Edit':
            return Pencil
        case 'Terminate':
            return Xmark
        default:
            break
    }
}

export const getObjectRevisionBannerText = (
    revision: PublicModuleObjectRevision,
    type: ModelType
) => {
    const model = models[type]
    const path = `/${model.defaults.slugOverview}/${model.defaults.plural}/ontwerpversie/${revision.Module_ID}/${revision.Module_Object_UUID}`

    switch (revision.Module_Status) {
        case 'Ontwerp GS':
            return 'Er wordt aan gewerkt.'
        case 'Ter Inzage':
            return (
                <>
                    Op dit moment ligt er in de module '{revision.Module_Title}'
                    een nieuwe versie van {model.defaults.prefixSingular}{' '}
                    {model.defaults.singularReadable} ter inzage,{' '}
                    <Hyperlink to={path} text="bekijk deze versie hier" />.
                </>
            )
        case 'Definitief ontwerp GS':
            return (
                <>
                    Is in inspraak geweest,{' '}
                    <Hyperlink to={path} text="bekijk deze versie hier" />.
                </>
            )
        case 'Ontwerp PS':
        case 'Definitief ontwerp PS':
        case 'Vastgesteld':
            return (
                <>
                    Op dit moment wordt er in module '{revision.Module_Title}'
                    gewerkt aan een nieuwe versie van{' '}
                    {model.defaults.prefixSingular}{' '}
                    {model.defaults.singularReadable},{' '}
                    <Hyperlink to={path} text="bekijk deze versie hier" />.
                </>
            )
        default:
            return ''
    }
}

export const generateObjectPath = (type: ModelType, UUID?: string) => {
    const model = models[type]

    return `/${model.defaults.slugOverview}/${model.defaults.plural}/${UUID}`
}
