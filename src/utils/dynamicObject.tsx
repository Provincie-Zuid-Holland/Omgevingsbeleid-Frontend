import { Hyperlink } from '@pzh-ui/components'
import { Pencil, Plus, Xmark } from '@pzh-ui/icons'

import { Link } from 'react-router-dom'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import { Role } from '@/context/AuthContext'

import {
    ObjectStaticShort,
    PublicModuleObjectRevision,
} from '../api/fetchers.schemas'

export const getStaticDataLabel = (key: keyof ObjectStaticShort) => {
    switch (key) {
        case 'client_1_id':
            return 'Ambtelijk opdrachtgever'
        case 'owner_1_id':
            return 'Eerste eigenaar'
        case 'owner_2_id':
            return 'Tweede eigenaar'
        case 'portfolio_holder_1_id':
            return 'Eerste portefeuillehouder'
        case 'owner_3_id':
            return 'Derde eigenaar'
        default:
            throw new Error(
                `Oh no! The type '${key}' could not be found within ObjectStaticShort...`
            )
    }
}

export const getStaticDataPropertyKey = (key: keyof ObjectStaticShort) => {
    switch (key) {
        case 'client_1_id':
            return 'client_1'
        case 'owner_1_id':
            return 'owner_1'
        case 'owner_2_id':
            return 'owner_2'
        case 'portfolio_holder_1_id':
            return 'portfolio_holder_1'
        case 'owner_3_id':
            return 'owner_3'
        default:
            throw new Error(
                `Oh no! The type '${key}' could not be found within ObjectStaticShort...`
            )
    }
}

export const getStaticDataPropertyRequired = (key: keyof ObjectStaticShort) => {
    switch (key) {
        case 'owner_2_id':
        case 'owner_3_id':
            return false
        case 'owner_1_id':
        case 'client_1_id':
        case 'portfolio_holder_1_id':
            return true
        default:
            throw new Error(
                `Oh no! The type '${key}' could not be found within ObjectStaticShort...`
            )
    }
}

export const getStaticDataFilterProperty = (key: keyof ObjectStaticShort) => {
    switch (key) {
        case 'owner_1_id':
            return 'owner_2'
        case 'owner_2_id':
            return 'owner_1'
        case 'owner_3_id':
            return 'owner_1'
        default:
            break
    }
}

export const getStaticDataFilterRoles = (
    key: keyof ObjectStaticShort
): Role[] | undefined => {
    switch (key) {
        case 'owner_1_id':
        case 'owner_2_id':
        case 'owner_3_id':
            return [
                'Regisseur Omgevingsbeleid',
                'Superuser',
                'Behandelend Ambtenaar',
                'Ambtelijk opdrachtgever',
            ]

        case 'portfolio_holder_1_id':
            return ['Portefeuillehouder']
        case 'client_1_id':
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
    const path = `/${model.defaults.slugOverview}/${model.defaults.plural}/ontwerpversie/${revision.module_id}/${revision.module_object_id}`

    if (revision.action === 'Terminate') {
        return `In module '${revision.module_title}' zijn we voornemens ${model.defaults.demonstrative} ${model.defaults.singularReadable} te laten vervallen.`
    }

    switch (revision.module_status) {
        case 'Ontwerp GS Concept':
            return `Op dit moment wordt er in module '${revision.module_title}' gewerkt aan een nieuwe versie van ${model.defaults.demonstrative} ${model.defaults.singularReadable}`
        case 'Ter Inzage':
            return (
                <p>
                    Op dit moment ligt er in de module ‘{revision.module_title}’
                    een nieuwe versie van {model.defaults.demonstrative}{' '}
                    {model.defaults.singularReadable} ter inzage,{' '}
                    <Hyperlink asChild>
                        <Link to={path}>bekijk deze versie hier</Link>
                    </Hyperlink>
                    .
                </p>
            )
        case 'Definitief ontwerp GS Concept':
            return (
                <p>
                    Is in inspraak geweest in module ‘{revision.module_title}’,{' '}
                    <Hyperlink asChild>
                        <Link to={path}>bekijk deze versie hier</Link>
                    </Hyperlink>
                    .
                </p>
            )

        case 'Ontwerp GS':
        case 'Ontwerp PS':
        case 'Definitief ontwerp GS':
        case 'Definitief ontwerp PS':
            return (
                <p>
                    Op dit moment wordt er in module ‘{revision.module_title}’
                    gewerkt aan een nieuwe versie van{' '}
                    {model.defaults.demonstrative}{' '}
                    {model.defaults.singularReadable},{' '}
                    <Hyperlink asChild>
                        <Link to={path}>bekijk deze versie hier</Link>
                    </Hyperlink>
                    .
                </p>
            )
        case 'Vastgesteld':
            return (
                <p>
                    Er is in module ‘{revision.module_title}’ een nieuwe versie
                    van {model.defaults.demonstrative}{' '}
                    {model.defaults.singularReadable} vastgesteld maar nog niet
                    in werking getreden.{' '}
                    <Hyperlink asChild>
                        <Link to={path}>Bekijk deze versie hier</Link>
                    </Hyperlink>
                    .
                </p>
            )
        default:
            return ''
    }
}

export const generateObjectPath = (type: ModelType, id?: string) => {
    const model = models[type]

    return `/${model.defaults.slugOverview}/${model.defaults.plural}/${id}`
}
