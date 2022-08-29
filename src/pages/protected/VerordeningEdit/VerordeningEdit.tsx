import { Form, Formik } from 'formik'
import { MotionConfig } from 'framer-motion'
import cloneDeep from 'lodash.clonedeep'
import { useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

import {
    getGetVersionVerordeningenObjectuuidQueryKey,
    getVersionVerordeningenObjectuuid,
    useGetVersionVerordeningenObjectuuid,
} from '@/api/fetchers'
import { VerordeningenRead, VerordeningenWrite } from '@/api/fetchers.schemas'
import axios from '@/api/instance'
import { Container } from '@/components/Container'
import {
    VerordeningLineageRead,
    VerordeningStructureChild,
} from '@/types/verordening'
import handleError from '@/utils/handleError'
import {
    getChildrenOfSectionFromLineage,
    mutateVerordeningenReadToVerordeningenWrite,
    patchOrPostSectionInVerordening,
    patchVerordeningSection,
    postVerordeningSection,
    transformVerordeningenReadToVerordeningChildRead,
} from '@/utils/verordening'

import AddSection from './AddSection'
import ReorderGroup from './ReorderGroup'
import { useVerordening, VerordeningProvider } from './verordeningEditContext'
import VerordeningEditLoader from './VerordeningEditLoader'
import VerordeningSection from './VerordeningSection'
import VerordeningSectionContainer from './VerordeningSectionContainer'

function VerordeningEdit() {
    const { lineageID: id } = useParams()
    const { state, dispatch } = useVerordening()
    const {
        isEditingOrder,
        lineageClone,
        editingSectionUUID,
        editingSectionIndexPath,
        activeChapterUUID,
        newSection,
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

    /**
     * Set activeSectionDataFromAPI in state and in the case of an 'Artikel' we retrieve and populate the 'Leden'
     */
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
                 * 2. If so we retrieve them and add them to the activeSectionData under the 'Children' property
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
        window.scrollTo(0, 0)
    }, [activeChapterUUID])

    useEffect(() => {
        if (!verordening) return

        dispatch({
            type: 'cloneLineageForReordering',
            payload: cloneDeep(verordening),
        })
    }, [verordening, dispatch, isEditingOrder])

    const queryClient = useQueryClient()

    if (!verordening || !lineageClone) return <VerordeningEditLoader />

    const chapters = isEditingOrder
        ? lineageClone.Structuur.Children
        : verordening.Structuur.Children

    /**
     * Values can be of type VerordeningenRead when editing and of verordeningenWrite when creating
     * We need to transform the values to verordeningenWrite when editing before patching
     * @param values the data from the Formik forms
     */
    const handleSubmit = async (
        values:
            | (VerordeningenRead & { Children?: VerordeningenRead[] })
            | (VerordeningenWrite & { Children?: VerordeningenRead[] }),
        { resetForm }: { resetForm: () => void }
    ) => {
        dispatch({
            type: 'setIsLoadingOrSaving',
            payload: true,
        })

        if (activeSectionDataFromAPI) {
            /** PATCH */
            try {
                /**
                 * Check if values is of Type `Artikel`. If so it could have `Leden` on the `Children` property
                 * If that is the case we need to patch these as well.
                 */
                let patchedChildren: VerordeningenRead[] | null = null
                if (values.Type === 'Artikel' && values.Children) {
                    patchedChildren = await Promise.all(
                        values.Children.map(async child => {
                            const childInWriteFormat =
                                mutateVerordeningenReadToVerordeningenWrite(
                                    child as VerordeningenRead
                                )

                            const patchedChild = await patchVerordeningSection(
                                childInWriteFormat,
                                child.ID!
                            )

                            return patchedChild
                        })
                    )
                }

                /** Transform the values to verordeningenWrite type */
                const valuesInWriteFormat =
                    mutateVerordeningenReadToVerordeningenWrite(
                        values as VerordeningenRead
                    )

                /** Patch the section */
                const patchedSection = await patchVerordeningSection(
                    valuesInWriteFormat,
                    activeSectionDataFromAPI.ID!
                )

                /** Mutate patched section for verordening structure */
                const patchedSectionForStructurePatch =
                    transformVerordeningenReadToVerordeningChildRead(
                        patchedSection
                    )

                /** If the patched section is of type article and has Leden we need to transform these to the ChildRead format as well */
                const patchedChildrenForStructurePatch =
                    patchedChildren !== null
                        ? patchedChildren.map(child =>
                              transformVerordeningenReadToVerordeningChildRead(
                                  child
                              )
                          )
                        : null

                /** Patch the verordening */
                const patchedVerordening =
                    await patchOrPostSectionInVerordening(
                        patchedSectionForStructurePatch,
                        patchedChildrenForStructurePatch,
                        editingSectionIndexPath || [],
                        verordening,
                        'patch'
                    )

                /** Update query Client with responses */
                queryClient.setQueryData(
                    'getVerordeningStructuur',
                    patchedVerordening
                )
                queryClient.setQueryData(
                    getGetVersionVerordeningenObjectuuidQueryKey(
                        patchedSection.UUID || ''
                    ),
                    patchedSection
                )

                /** Reset state */
                dispatch({
                    type: 'setIsLoadingOrSaving',
                    payload: false,
                })
                dispatch({ type: 'resetEditingSection' })
                resetForm()
            } catch (err) {
                handleError(err)

                dispatch({
                    type: 'setIsLoadingOrSaving',
                    payload: false,
                })

                dispatch({ type: 'resetEditingSection' })
            }
        } else {
            /** POST */
            try {
                const postObject = cloneDeep(values)
                /**
                 * Check if postObject is of Type `Artikel`. If so it could have `Leden` on the `Children` property
                 * If that is the case we need to patch these as well.
                 */
                let patchedChildren: VerordeningenRead[] | null = null
                if (newSection?.Type === 'Artikel' && postObject.Children) {
                    patchedChildren = await Promise.all(
                        postObject.Children.map(async child => {
                            const childInWriteFormat =
                                mutateVerordeningenReadToVerordeningenWrite(
                                    child as VerordeningenRead
                                )

                            const patchedChild = await patchVerordeningSection(
                                childInWriteFormat,
                                child.ID!
                            )

                            return patchedChild
                        })
                    )

                    console.log('DELETE POST')
                    delete postObject.Children
                }

                const createdSectionFromAPI = await postVerordeningSection({
                    ...newSection,
                    ...postObject,
                } as VerordeningenWrite)

                const createdSectionForStructurePatch =
                    transformVerordeningenReadToVerordeningChildRead(
                        createdSectionFromAPI
                    )

                /** If the patched section is of type article and has Leden we need to transform these to the ChildRead format as well */
                const patchedChildrenForStructurePatch =
                    patchedChildren !== null
                        ? patchedChildren.map(child =>
                              transformVerordeningenReadToVerordeningChildRead(
                                  child
                              )
                          )
                        : null

                const patchedVerordening =
                    await patchOrPostSectionInVerordening(
                        createdSectionForStructurePatch,
                        patchedChildrenForStructurePatch,
                        editingSectionIndexPath || [],
                        verordening,
                        'post'
                    )

                queryClient.setQueryData(
                    'getVerordeningStructuur',
                    patchedVerordening
                )

                resetForm()

                dispatch({ type: 'setIsAddingSection', payload: false })
                dispatch({
                    type: 'setIsLoadingOrSaving',
                    payload: false,
                })
                dispatch({ type: 'setNewSection', payload: null })
            } catch (err) {
                handleError(err)
                dispatch({
                    type: 'setIsLoadingOrSaving',
                    payload: false,
                })
            }
        }
    }

    return (
        <MotionConfig reducedMotion={isEditingOrder ? 'never' : 'always'}>
            <Formik
                initialValues={activeSectionData || newSection || {}}
                enableReinitialize={true}
                onSubmit={handleSubmit}>
                <Form className="w-full">
                    <Container>
                        <VerordeningSectionContainer verordening={verordening}>
                            <ReorderGroup
                                replaceUlForFragment={activeChapterUUID}
                                indexPath={[]}
                                values={chapters}>
                                {chapters.length > 0 ? (
                                    chapters.map(
                                        (
                                            chapter: VerordeningStructureChild,
                                            chapterIndex
                                        ) => (
                                            <VerordeningSection
                                                parentArray={['Hoofdstuk']}
                                                currentParentType={'No Parent'}
                                                key={chapter.UUID}
                                                section={chapter}
                                                index={chapterIndex}
                                                indexPath={[]}
                                            />
                                        )
                                    )
                                ) : (
                                    <AddSection
                                        show
                                        typeToAdd="Hoofdstuk"
                                        indexPath={[0]}
                                    />
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
