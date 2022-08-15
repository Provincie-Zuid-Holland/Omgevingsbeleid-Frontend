import cloneDeep from 'lodash.clonedeep'

import { getVersionVerordeningenObjectuuid } from '@/api/fetchers'
import axios from '@/api/instance'
import {
    VerordeningChildRead,
    VerordeningChildWrite,
    VerordeningLineageRead,
    VerordeningLineageWrite,
} from '@/types/verordening'

const prepareForPatch = (values: any, type: 'lineage' | 'section') => {
    const patchValues = cloneDeep(values)
    const removePropertiesForLineage = [
        'ID',
        'Created_By',
        'Created_Date',
        'Modified_By',
        'Modified_Date',
        'Ref_Beleidskeuzes',
        'Begin_Geldigheid',
        'Eind_Geldigheid',
        'Eigenaar_1',
        'Eigenaar_2',
        'Portefeuillehouder_1',
        'Portefeuillehouder_2',
        'Opdrachtgever',
        'Weblink',
        'Status',
    ]

    const removePropertiesForSection = [
        'ID',
        'UUID',
        'Created_By',
        'Created_Date',
        'Modified_By',
        'Modified_Date',
        'Ref_Beleidskeuzes',
    ]

    if (type === 'lineage') {
        removePropertiesForLineage.forEach(property => {
            delete patchValues[property]
        })
    } else if (type === 'section') {
        removePropertiesForSection.forEach(property => {
            delete patchValues[property]
        })
    }

    const inlinedProperties = [
        'Eigenaar_1',
        'Eigenaar_2',
        'Portefeuillehouder_1',
        'Portefeuillehouder_2',
        'Opdrachtgever',
        'Gebied',
    ]

    inlinedProperties.forEach(property => {
        if (patchValues[property]) {
            patchValues[property] = patchValues[property].UUID
        }
    })

    return patchValues
}

export const patchVerordeningSection = (
    values: VerordeningChildRead,
    lineageID: number
) => {
    const patchObject = prepareForPatch(values, 'section')

    return axios
        .patch(`/verordeningen/${lineageID}`, patchObject)
        .then(res => res.data)
        .catch(err => {
            console.log('err: ', err)
        })
}

export const postVerordeningSection = (values: VerordeningChildWrite) => {
    return axios
        .post(`/verordeningen`, values)
        .then(res => res.data)
        .catch(err => {
            console.log('err: ', err)
        })
}

export const getChildrenOfSectionFromAPI = (
    children: VerordeningChildRead[]
) => {
    return Promise.all([
        children.map(child => getVersionVerordeningenObjectuuid(child.UUID)),
    ])
}

export const getChildrenOfSectionFromLineage = (
    sectionIndexPath: number[],
    verordening: VerordeningLineageRead
) => {
    if (sectionIndexPath.length === 1) {
        return cloneDeep(
            verordening.Structuur.Children[sectionIndexPath[0]].Children
        )
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
    } else {
        throw new Error(
            `Can't get children of section with sectionIndexPath of ${sectionIndexPath}`
        )
    }
}

export const patchNewSectionInVerordening = (
    newSection: VerordeningChildRead,
    sectionIndexPath: number[],
    verordening: VerordeningLineageRead
) => {
    const lineageID = verordening.ID
    const newSectionWrite = prepareForPatch(newSection, 'lineage')

    const stripPropertiesForLineage = (object: VerordeningChildRead) => ({
        Inhoud: object.Inhoud,
        Titel: object.Titel,
        Type: object.Type,
        UUID: object.UUID,
        Volgnummer: object.Volgnummer,
        Children: object.Children,
        Gebied: object.Gebied,
    })

    const setNewSectionInLineage = (
        verordening: VerordeningLineageRead,
        newSectionWrite: VerordeningChildRead,
        sectionIndexPath: number[]
    ) => {
        const clonedVerordening = cloneDeep(verordening)

        if (sectionIndexPath.length === 1) {
            const childrenOfExistingSection = getChildrenOfSectionFromLineage(
                sectionIndexPath,
                verordening
            )

            clonedVerordening.Structuur.Children[sectionIndexPath[0]] =
                stripPropertiesForLineage(newSectionWrite)

            clonedVerordening.Structuur.Children[sectionIndexPath[0]].Children =
                childrenOfExistingSection

            return clonedVerordening
        } else if (sectionIndexPath.length === 2) {
            const childrenOfExistingSection = getChildrenOfSectionFromLineage(
                sectionIndexPath,
                verordening
            )

            clonedVerordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ] = stripPropertiesForLineage(newSectionWrite)

            clonedVerordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children = childrenOfExistingSection

            return clonedVerordening
        } else if (sectionIndexPath.length === 3) {
            const childrenOfExistingSection = getChildrenOfSectionFromLineage(
                sectionIndexPath,
                verordening
            )

            clonedVerordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children[sectionIndexPath[2]] =
                stripPropertiesForLineage(newSectionWrite)

            clonedVerordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children[sectionIndexPath[2]].Children = childrenOfExistingSection

            return clonedVerordening
        } else if (sectionIndexPath.length === 4) {
            const childrenOfExistingSection = getChildrenOfSectionFromLineage(
                sectionIndexPath,
                verordening
            )

            clonedVerordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children[sectionIndexPath[2]].Children[sectionIndexPath[3]] =
                stripPropertiesForLineage(newSectionWrite)

            clonedVerordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children[sectionIndexPath[2]].Children[
                sectionIndexPath[3]
            ].Children = childrenOfExistingSection

            return clonedVerordening
        } else {
            throw new Error(
                `Can't get children of section with sectionIndexPath of ${sectionIndexPath}`
            )
        }
    }

    const verordeningForPatch = setNewSectionInLineage(
        verordening,
        newSectionWrite,
        sectionIndexPath
    )

    return axios
        .patch(`/verordeningstructuur/${lineageID}`, {
            Structuur: {
                Children: verordeningForPatch.Structuur.Children,
            },
        })
        .then(res => res.data)
        .catch(err => console.log(err))
}
