import { Button, FormikInput, Text } from '@pzh-ui/components'
import { Bars, FloppyDisk, Spinner, Xmark } from '@pzh-ui/icons'
import classNames from 'classnames'
import { Formik, Form, FormikHelpers } from 'formik'
import {
    DragControls,
    Reorder,
    useDragControls,
    useMotionValue,
    motion,
    MotionConfig,
} from 'framer-motion'
import cloneDeep from 'lodash.clonedeep'
import { Fragment, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
    useGetVersionVerordeningenObjectuuid,
    useGetVerordeningenLineageid,
    getGetVersionVerordeningenObjectuuidQueryKey,
    getVersionVerordeningenObjectuuid,
} from '@/api/fetchers'
import { VerordeningenRead } from '@/api/fetchers.schemas'
import axios from '@/api/instance'
import ButtonDropdown from '@/components/ButtonDropdown'
import { Container } from '@/components/Container'
import Dropdown from '@/components/Dropdown'
import {
    VerordeningLineageRead,
    VerordeningChildRead,
} from '@/types/verordening'
import handleError from '@/utils/handleError'
import {
    patchVerordeningSection,
    patchNewSectionInVerordening,
    getChildrenOfSectionFromLineage,
} from '@/utils/verordening'

import FormSubmitOrCancel from './Form/FormSubmitOrCancel'
import ReorderGroup from './ReorderGroup'
import ReorderItem from './ReorderItem'
import { VerordeningProvider, useVerordening } from './verordeningEditContext'
import VerordeningSection from './VerordeningSection'
import VerordeningSectionAction from './VerordeningSectionAction'
import VerordeningSectionContainer from './VerordeningSectionContainer'

/**
 * User can edit an object with the dropdown menu on the item
 * - Set isEditingSection
 */
function VerordeningEdit() {
    const { lineageID: id } = useParams()
    const { state, dispatch } = useVerordening()
    const {
        isEditingOrder,
        lineageClone,
        editingSectionUUID,
        newPostObject,
        editingSectionIndexPath,
        activeChapterUUID,
        activeSectionData,
    } = state

    const { data: activeSectionDataFromAPI, isLoading: isLoadingVersion } =
        useGetVersionVerordeningenObjectuuid(editingSectionUUID || '', {
            query: {
                enabled: editingSectionUUID !== null,
            },
        })

    useEffect(() => {
        dispatch({ type: 'setIsLoadingOrSaving', payload: isLoadingVersion })
    }, [isLoadingVersion, dispatch])

    const { data: verordening } = useQuery('getVerordeningStructuur', () =>
        axios
            .get(`/verordeningstructuur/${id}`)
            .then(res => res.data[0] as VerordeningLineageRead)
    )

    useEffect(() => {
        if (!activeSectionDataFromAPI) {
            dispatch({
                type: 'setActiveSectionData',
                payload: null,
            })
        } else if (activeSectionDataFromAPI.Type !== 'Artikel') {
            dispatch({
                type: 'setActiveSectionData',
                payload: activeSectionDataFromAPI,
            })
        } else if (activeSectionDataFromAPI.Type === 'Artikel') {
            if (editingSectionIndexPath && verordening) {
                /**
                 * If the type is 'Artikel' we need to add the Children property and potentially populate it
                 * 1. Check in lineage if the current section contains Children
                 * 2. If so we need to retrieve them and add them to the activeSectionData under the 'Children' property
                 */
                const children = getChildrenOfSectionFromLineage(
                    editingSectionIndexPath,
                    verordening
                )

                if (children.length > 0) {
                    Promise.all(
                        children.map(child =>
                            getVersionVerordeningenObjectuuid(child.UUID)
                        )
                    )
                        .then(resolvedChildren => {
                            dispatch({
                                type: 'setActiveSectionData',
                                payload: {
                                    ...activeSectionDataFromAPI,
                                    Children: resolvedChildren,
                                },
                            })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    dispatch({
                        type: 'setActiveSectionData',
                        payload: activeSectionDataFromAPI,
                    })
                }
            } else {
            }
        }
    }, [
        activeSectionDataFromAPI,
        dispatch,
        editingSectionIndexPath,
        verordening,
    ])

    useEffect(() => {
        if (!verordening) return

        dispatch({
            type: 'cloneLineageForReordering',
            payload: cloneDeep(verordening),
        })
    }, [verordening, dispatch, isEditingOrder])

    const queryClient = useQueryClient()

    if (!verordening || !lineageClone) return <span>Laden...</span>

    const latestVerordening = verordening
    const chapters = isEditingOrder
        ? lineageClone.Structuur.Children
        : latestVerordening.Structuur.Children

    const handleSubmit = async (
        values: VerordeningChildRead | VerordeningenRead
    ) => {
        dispatch({
            type: 'setIsLoadingOrSaving',
            payload: true,
        })

        if (activeSectionDataFromAPI) {
            /**
             * 1. Patch the section
             * 2. Patch the verordening structure with the new section
             * 3. Update the QueryClient
             */
            try {
                const patchedSection = await patchVerordeningSection(
                    values as VerordeningChildRead,
                    activeSectionDataFromAPI.ID!
                )

                const patchedVerordening = await patchNewSectionInVerordening(
                    patchedSection,
                    editingSectionIndexPath || [],
                    latestVerordening
                )

                queryClient.setQueryData(
                    'getVerordeningStructuur',
                    patchedVerordening
                )

                queryClient.setQueryData(
                    getGetVersionVerordeningenObjectuuidQueryKey(
                        patchedSection.UUID
                    ),
                    patchedSection
                )

                dispatch({
                    type: 'setIsLoadingOrSaving',
                    payload: false,
                })
                dispatch({ type: 'resetEditingSection' })
            } catch (err) {
                handleError(err)
                dispatch({
                    type: 'setIsLoadingOrSaving',
                    payload: false,
                })
            }
        } else if (newPostObject) {
            axios
                .post(`/verordeningen`, values)
                .then(res => {
                    dispatch({
                        type: 'setIsLoadingOrSaving',
                        payload: false,
                    })
                })
                .catch(err => {
                    dispatch({
                        type: 'setIsLoadingOrSaving',
                        payload: false,
                    })
                })
        }
    }

    console.log({ activeSectionData })

    return (
        <MotionConfig reducedMotion={isEditingOrder ? 'never' : 'always'}>
            <Formik
                initialValues={activeSectionData || newPostObject || {}}
                enableReinitialize={true}
                onSubmit={handleSubmit}>
                <Form className="w-full">
                    <Container>
                        <VerordeningSectionContainer
                            verordening={latestVerordening}>
                            <ReorderGroup
                                type="Hoofdstuk"
                                replaceUlForFragment={activeChapterUUID}
                                indexPath={[]}
                                values={chapters}>
                                {chapters.map(
                                    (
                                        chapter: VerordeningChildRead,
                                        chapterIndex
                                    ) => (
                                        <VerordeningSection
                                            key={chapter.UUID}
                                            section={chapter}
                                            index={chapterIndex}
                                            indexPath={[]}
                                        />
                                    )
                                )}
                            </ReorderGroup>
                        </VerordeningSectionContainer>
                    </Container>
                </Form>
            </Formik>
        </MotionConfig>
    )
}

const VerordeningEditWithProvider = () => (
    <VerordeningProvider>
        <VerordeningEdit />
    </VerordeningProvider>
)

export default VerordeningEditWithProvider
