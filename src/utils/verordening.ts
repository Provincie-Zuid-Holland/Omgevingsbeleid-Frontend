import cloneDeep from 'lodash.clonedeep'

import axios from '@/api/instance'
import {
    VerordeningChildRead,
    VerordeningLineageRead,
} from '@/types/verordening'

export const patchVerordeningSection = (
    values: VerordeningChildRead,
    lineageID: number
) => {
    const propertiesToRemove = [
        'ID',
        'UUID',
        'Created_By',
        'Created_Date',
        'Modified_By',
        'Modified_Date',
        'Ref_Beleidskeuzes',
    ]

    const inlinedProperties = [
        'Eigenaar_1',
        'Eigenaar_2',
        'Potefeuillehouder_1',
        'Potefeuillehouder_2',
        'Opdrachtgever',
    ]

    const prepareForPatch = (values: any) => {
        propertiesToRemove.forEach(property => {
            delete values[property]
        })

        inlinedProperties.forEach(property => {
            if (values[property]) {
                values[property] = values[property].UUID
            }
        })

        return values
    }

    const patchObject = prepareForPatch(values)

    return axios
        .patch(`/verordeningen/${lineageID}`, patchObject)
        .then(res => res.data)
        .catch(err => {
            console.log('err: ', err)
        })
}

export const patchVerordening = (
    newSection: VerordeningChildRead,
    sectionIndexPath: number[],
    verordening: VerordeningLineageRead
) => {
    const lineageID = verordening.ID

    const getChildrenOfPreviousSection = (
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

    const setNewSectionInLineage = (
        verordening: VerordeningLineageRead,
        newSection: VerordeningChildRead,
        sectionIndexPath: number[]
    ) => {
        const clonedVerordening = cloneDeep(verordening)

        if (sectionIndexPath.length === 1) {
            const childrenOfExistingSection = getChildrenOfPreviousSection(
                sectionIndexPath,
                verordening
            )

            console.log('NEW TITLE', newSection.Titel)

            clonedVerordening.Structuur.Children[sectionIndexPath[0]] =
                stripPropertiesForLineage(newSection)

            clonedVerordening.Structuur.Children[sectionIndexPath[0]].Children =
                childrenOfExistingSection

            return clonedVerordening
        } else if (sectionIndexPath.length === 2) {
            const childrenOfExistingSection = getChildrenOfPreviousSection(
                sectionIndexPath,
                verordening
            )

            verordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ] = stripPropertiesForLineage(newSection)

            verordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children = childrenOfExistingSection

            return clonedVerordening
        } else if (sectionIndexPath.length === 3) {
            const childrenOfExistingSection = getChildrenOfPreviousSection(
                sectionIndexPath,
                verordening
            )

            verordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children[sectionIndexPath[2]] =
                stripPropertiesForLineage(newSection)

            verordening.Structuur.Children[sectionIndexPath[0]].Children[
                sectionIndexPath[1]
            ].Children[sectionIndexPath[2]].Children = childrenOfExistingSection

            return clonedVerordening
        } else {
            throw new Error(
                `Can't get children of section with sectionIndexPath of ${sectionIndexPath}`
            )
        }
    }

    const stripPropertiesForLineage = (object: VerordeningChildRead) => ({
        Inhoud: object.Inhoud,
        Titel: object.Titel,
        Type: object.Type,
        UUID: object.UUID,
        Volgnummer: object.Volgnummer,
        Children: object.Children,
        Gebied: object.Gebied,
    })

    const verordeningForPatch = setNewSectionInLineage(
        verordening,
        newSection,
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
