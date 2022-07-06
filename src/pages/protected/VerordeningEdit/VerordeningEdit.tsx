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
import { patchVerordeningSection, patchVerordening } from '@/utils/verordening'

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
    const { id } = useParams()
    const { state, dispatch } = useVerordening()
    const {
        isEditingOrder,
        lineageClone,
        editingSectionUUID,
        newPostObject,
        editingSectionIndexPath,
        activeChapterUUID,
    } = state

    const { data: activeSectionData, isLoading: isLoadingVersion } =
        useGetVersionVerordeningenObjectuuid(editingSectionUUID || '', {
            query: {
                enabled: editingSectionUUID !== null,
            },
        })

    useEffect(() => {
        console.log('Dispatch')
        dispatch({ type: 'setIsLoadingOrSaving', payload: isLoadingVersion })
    }, [isLoadingVersion, dispatch])

    useEffect(() => {
        dispatch({
            type: 'setActiveSectionData',
            payload: activeSectionData || null,
        })
    }, [activeSectionData, dispatch])

    const { data: verordening } = useQuery('getVerordeningStructuur', () =>
        axios
            .get(`/verordeningstructuur/${id}`)
            .then(res => res.data[0] as VerordeningLineageRead)
    )

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

        if (activeSectionData) {
            /**
             * Patch the section
             * Patch the verordening structure with the new section
             */
            try {
                const patchedSection = await patchVerordeningSection(
                    values as VerordeningChildRead,
                    activeSectionData.ID!
                )

                const patchedVerordening = await patchVerordening(
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

    return (
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
    )
}

const VerordeningEditWithProvider = () => (
    <VerordeningProvider>
        <VerordeningEdit />
    </VerordeningProvider>
)

export default VerordeningEditWithProvider
