import { useMutation } from '@tanstack/react-query'
import cloneDeep from 'lodash.clonedeep'

import { createVerordening } from '@/api/fetchers'
import {
    Verordening,
    VerordeningCreate,
    VerordeningUpdate,
    WerkingsgebiedInline,
} from '@/api/fetchers.schemas'
import axios from '@/api/instance'
import {
    VerordeningLineageRead,
    VerordeningStructureChild,
} from '@/types/verordening'

export const getGeoValueFromFormikValues = (values: any) => {
    const geoValue: string | undefined | WerkingsgebiedInline =
        values?.Gebied || values?.Gebied_UUID

    if (!geoValue) return null

    return typeof geoValue === 'string'
        ? geoValue
        : typeof geoValue === 'object' &&
          !Array.isArray(geoValue) &&
          geoValue !== null &&
          geoValue?.UUID !== undefined
        ? geoValue.UUID
        : null
}

/**
 * @returns A promise that resolves to a VerordeningenRead with type Lid
 */
export const createVerordeningLid = async (lid: Partial<VerordeningCreate>) => {
    return await createVerordening({
        ...lid,
        Type: 'Lid',
        Status: 'Vigerend',
        Volgnummer: '',
    } as VerordeningCreate)
}

export const replaceReorderedSections = (
    indexPath: number[],
    newLineageClone: VerordeningLineageRead,
    reorderedSections: VerordeningStructureChild[]
) => {
    if (
        indexPath.length === 0 &&
        newLineageClone?.Structuur?.Children !== undefined
    ) {
        newLineageClone.Structuur.Children = reorderedSections
    } else if (
        indexPath.length === 1 &&
        newLineageClone?.Structuur?.Children[indexPath[0]]?.Children !==
            undefined
    ) {
        newLineageClone.Structuur.Children[indexPath[0]].Children =
            reorderedSections
    } else if (
        indexPath.length === 2 &&
        newLineageClone?.Structuur?.Children[indexPath[0]]?.Children[
            indexPath[1]
        ]?.Children !== undefined
    ) {
        newLineageClone.Structuur.Children[indexPath[0]].Children[
            indexPath[1]
        ].Children = reorderedSections
    } else if (
        indexPath.length === 3 &&
        newLineageClone?.Structuur?.Children[indexPath[0]]?.Children[
            indexPath[1]
        ]?.Children[indexPath[2]]?.Children !== undefined
    ) {
        newLineageClone.Structuur.Children[indexPath[0]].Children[
            indexPath[1]
        ].Children[indexPath[2]].Children = reorderedSections
    }

    return newLineageClone
}

export const mutateVerordeningenReadToVerordeningenWrite = (
    readObject: Verordening
) => {
    const writeObject: VerordeningUpdate = {}

    const verordeningenWriteProperties = [
        'Begin_Geldigheid',
        'Eind_Geldigheid',
        'Inhoud',
        'Status',
        'Titel',
        'Type',
        'Volgnummer',
        'Weblink',
    ] as const

    const inlinedUpdateProperties = [
        'Eigenaar_1_UUID',
        'Eigenaar_2_UUID',
        'Portefeuillehouder_1_UUID',
        'Portefeuillehouder_2_UUID',
        'Opdrachtgever_UUID',
        'Gebied_UUID',
    ] as const

    type inlinedReadProperties =
        | 'Eigenaar_1'
        | 'Eigenaar_2'
        | 'Portefeuillehouder_1'
        | 'Portefeuillehouder_2'
        | 'Opdrachtgever'
        | 'Gebied'

    verordeningenWriteProperties.forEach(property => {
        // @ts-ignore
        writeObject[property] = readObject[property]
    })

    inlinedUpdateProperties.forEach(property => {
        const readProperty = property.replace(
            '_UUID',
            ''
        ) as inlinedReadProperties

        writeObject[property] =
            readObject[readProperty] === null
                ? undefined
                : readObject[readProperty]?.UUID
    })

    return writeObject
}

export const getChildrenOfSectionFromLineage = (
    sectionIndexPath: number[],
    verordening: VerordeningLineageRead
) => {
    if (sectionIndexPath.length === 1) {
        const children =
            verordening.Structuur.Children[sectionIndexPath[0]]?.Children

        return children ? cloneDeep(children) : []
    } else if (sectionIndexPath.length === 2) {
        return cloneDeep(
            verordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children
        )
    } else if (sectionIndexPath.length === 3) {
        return cloneDeep(
            verordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children[sectionIndexPath[2]].Children
        )
    } else if (sectionIndexPath.length === 4) {
        return cloneDeep(
            verordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children[sectionIndexPath[2]].Children[sectionIndexPath[3]]
                .Children
        )
    } else {
        throw new Error(
            `Can't get children of section with sectionIndexPath of ${sectionIndexPath}`
        )
    }
}

/**
 * @returns an verordening section that can be placed into the verordening lineage
 */
export const transformVerordeningenReadToVerordeningChildRead = (
    verordeningenRead: Verordening
) => ({
    Children: [],
    Gebied: verordeningenRead.Gebied?.UUID || null,
    Inhoud: verordeningenRead.Inhoud || '',
    Titel: verordeningenRead.Titel || '',
    Type: verordeningenRead.Type as
        | 'Hoofdstuk'
        | 'Afdeling'
        | 'Paragraaf'
        | 'Artikel'
        | 'Lid',
    UUID: verordeningenRead.UUID || '',
    Volgnummer: verordeningenRead.Volgnummer || '',
})

/**
 * @returns an verordening section that can be placed into the verordening lineage
 */
export const transformVerordeningenReadToVerordeningenWrite = (
    verordeningenRead: Verordening
) => {
    const verordeningChildRead: VerordeningStructureChild = {
        Children: [],
        Gebied: verordeningenRead.Gebied?.UUID || null,
        Inhoud: verordeningenRead.Inhoud || '',
        Titel: verordeningenRead.Titel || '',
        Type: verordeningenRead.Type as
            | 'Hoofdstuk'
            | 'Afdeling'
            | 'Paragraaf'
            | 'Artikel'
            | 'Lid',
        UUID: verordeningenRead.UUID || '',
        Volgnummer: verordeningenRead.Volgnummer || '',
    }

    return verordeningChildRead
}

/**
 *
 * @param verordening Verordening structure
 * @param section Section to perform action on
 * @param sectionIndexPath Index path to the section in the lineage
 * @param type HTTP Method
 * @param children Can contain leden
 * @returns A VerordeningLineageRead with the new/patched/deleted section
 */
const addReplaceDeleteSectionInLineage = (
    verordening: VerordeningLineageRead,
    section: VerordeningStructureChild,
    sectionIndexPath: number[],
    type: 'post' | 'patch' | 'delete',
    children: null | VerordeningStructureChild[]
) => {
    const clonedVerordening = cloneDeep(verordening)
    const childrenOfExistingSection =
        type === 'patch' && section.Type !== 'Artikel'
            ? getChildrenOfSectionFromLineage(sectionIndexPath, verordening)
            : []

    const newSectionWithChildren = {
        ...section,
        Children: children
            ? children
            : type === 'patch'
            ? childrenOfExistingSection
            : [],
    }

    const childrenInLineage =
        sectionIndexPath.length === 1
            ? clonedVerordening.Structuur?.Children
            : sectionIndexPath.length === 2
            ? clonedVerordening.Structuur?.Children[sectionIndexPath[0]]
                  ?.Children
            : sectionIndexPath.length === 3
            ? clonedVerordening.Structuur?.Children[sectionIndexPath[0]]
                  ?.Children[sectionIndexPath[1]]?.Children
            : sectionIndexPath.length === 4
            ? clonedVerordening.Structuur?.Children[sectionIndexPath[0]]
                  ?.Children[sectionIndexPath[1]]?.Children[sectionIndexPath[2]]
                  ?.Children
            : undefined

    if (childrenInLineage === undefined) {
        throw new Error(
            `Can't get childrenPatchDelete of section with sectionIndexPath of ${sectionIndexPath}`
        )
    } else if (sectionIndexPath.length === 1) {
        if (type === 'delete') {
            childrenInLineage.splice(sectionIndexPath[0], 1)
        } else {
            childrenInLineage.splice(
                sectionIndexPath[0],
                type === 'patch' ? 1 : 0,
                newSectionWithChildren
            )
        }

        return clonedVerordening
    } else if (sectionIndexPath.length === 2) {
        if (type === 'delete') {
            childrenInLineage.splice(sectionIndexPath[1], 1)
        } else {
            childrenInLineage.splice(
                sectionIndexPath[1],
                type === 'patch' ? 1 : 0,
                newSectionWithChildren
            )
        }

        return clonedVerordening
    } else if (sectionIndexPath.length === 3) {
        if (type === 'delete') {
            childrenInLineage.splice(sectionIndexPath[2], 1)
        } else {
            childrenInLineage.splice(
                sectionIndexPath[2],
                type === 'patch' ? 1 : 0,
                newSectionWithChildren
            )
        }

        return clonedVerordening
    } else if (sectionIndexPath.length === 4) {
        if (type === 'delete') {
            childrenInLineage.splice(sectionIndexPath[3], 1)
        } else {
            childrenInLineage.splice(
                sectionIndexPath[3],
                type === 'patch' ? 1 : 0,
                newSectionWithChildren
            )
        }

        return clonedVerordening
    } else {
        throw new Error(
            `Can't get children of section with sectionIndexPath of ${sectionIndexPath}`
        )
    }
}

export const patchOrPostSectionInVerordening = (
    newSection: VerordeningStructureChild,
    children: VerordeningStructureChild[] | null,
    sectionIndexPath: number[],
    verordening: VerordeningLineageRead,
    type: 'patch' | 'post' | 'delete'
) => {
    const verordeningStructureForPatch = addReplaceDeleteSectionInLineage(
        verordening,
        newSection,
        sectionIndexPath,
        type,
        children
    )

    const lineageID = verordening.ID

    return patchVerordeningStructureChildren(
        lineageID,
        verordeningStructureForPatch.Structuur.Children
    )
}

export const patchVerordeningStructureChildren = (
    lineageID: number,
    Chapters: VerordeningStructureChild[]
) => {
    return axios
        .patch(`/v0.1/verordeningstructuur/${lineageID}`, {
            Structuur: {
                Children: Chapters,
            },
        })
        .then(res => res.data)
        .catch(err => console.log(err))
}

export const usePatchVerordeningenStructureLineageid = (props: any) => {
    const mutationFn = (
        props: undefined | { data: any; lineageid: number }
    ) => {
        const { data, lineageid } = props || {}

        return axios
            .patch(`/v0.1/verordeningstructuur/${lineageid || ''}`, {
                ...data,
            })
            .then(res => res.data)
            .catch(err => console.log(err))
    }

    const options = props.mutation
    return useMutation(mutationFn, options)
}

export const usePostVerordeningenStructure = (props: any) => {
    const mutationFn = (props: undefined | { data: any }) => {
        const { data } = props || {}

        return axios
            .post(`/v0.1/verordeningstructuur`, {
                ...data,
            })
            .then(res => res.data)
            .catch(err => console.log(err))
    }

    const options = props.mutation
    return useMutation(mutationFn, options)
}

export const usePatchVerordeningStructureLineage = (
    lineageID: number,
    Chapters: VerordeningStructureChild[]
) => {
    return axios
        .patch(`/v0.1/verordeningstructuur/${lineageID}`, {
            Structuur: {
                Children: Chapters,
            },
        })
        .then(res => res.data)
        .catch(err => console.log(err))
}
