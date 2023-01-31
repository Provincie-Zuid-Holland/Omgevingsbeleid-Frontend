import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikState } from 'formik'
import { MotionConfig } from 'framer-motion'
import cloneDeep from 'lodash.clonedeep'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import {
    getReadVerordeningVersionQueryKey,
    readVerordeningVersion,
    useReadVerordeningVersion,
} from '@/api/fetchers'
import {
    Verordening,
    VerordeningCreate,
    VerordeningUpdate,
} from '@/api/fetchers.schemas'
import axios from '@/api/instance'
import { Container } from '@/components/Container'
import { ExtendTypesWithNull } from '@/types/dimensions'
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
    const { single: id } = useParams()
    const queryClient = useQueryClient()
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

    /**
     * Fetch the current active section data.
     */
    const {
        data: activeSectionDataFromAPI,
        isInitialLoading: isLoadingVersion,
    } = useReadVerordeningVersion(editingSectionUUID || '', {
        query: {
            enabled: !!editingSectionUUID,
        },
    })

    /**
     * Update loading state
     */
    useEffect(() => {
        dispatch({ type: 'setIsLoadingOrSaving', payload: isLoadingVersion })
    }, [isLoadingVersion, dispatch])

    const { data: verordening } = useQuery(
        [`getVerordeningStructuur/${id}`],
        () =>
            axios
                .get(`/verordeningstructuur/${id}`)
                .then(res => res.data[0] as VerordeningLineageRead),
        {
            staleTime: 0,
            refetchOnMount: true,
        }
    )

    /**
     * Set activeSectionDataFromAPI in state as activeSectionData.
     * In the case of an 'Artikel' we retrieve and populate the 'Leden'.
     */
    useEffect(() => {
        if (
            !activeSectionDataFromAPI ||
            !editingSectionUUID ||
            !editingSectionIndexPath ||
            editingSectionIndexPath.length === 0
        ) {
            dispatch({
                type: 'setActiveSectionData',
                payload: null,
            })
            dispatch({ type: 'setIsLoadingOrSaving', payload: false })
        } else if (activeSectionDataFromAPI.Type !== 'Artikel') {
            dispatch({
                type: 'setActiveSectionData',
                payload: activeSectionDataFromAPI,
            })
        } else if (
            activeSectionDataFromAPI.Type === 'Artikel' &&
            editingSectionIndexPath &&
            verordening &&
            editingSectionUUID
        ) {
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
                    children.map(child => readVerordeningVersion(child.UUID))
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
        }
    }, [
        activeSectionDataFromAPI,
        dispatch,
        editingSectionIndexPath,
        verordening,
        editingSectionUUID,
    ])

    useEffect(() => {
        if (activeSectionData && !editingSectionUUID) {
            dispatch({
                type: 'setActiveSectionData',
                payload: null,
            })
        }
    }, [activeSectionData, editingSectionUUID, dispatch])

    /**
     * Reset scroll position to top when changing chapters
     */
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [activeChapterUUID])

    /**
     * 1. Set lineage clone
     * 2. Check if lineage has Chapters, else set isAddingSection to true
     */
    useEffect(() => {
        if (!verordening) return

        dispatch({
            type: 'cloneLineageForReordering',
            payload: cloneDeep(verordening),
        })

        if (verordening.Structuur.Children.length === 0) {
            dispatch({
                type: 'setIsAddingSection',
                payload: true,
            })
        }
    }, [verordening, dispatch, isEditingOrder])

    if (!verordening || !lineageClone) return <VerordeningEditLoader />

    /**
     * When the user edits the order, we change to the clone of the lineage.
     * If the user cancels, we switch back. If the users saves the reordered lineage,
     * we update the original lineage.
     */
    const chapters = isEditingOrder
        ? lineageClone.Structuur.Children
        : verordening.Structuur.Children

    /**
     * Values can be of type VerordeningenRead when editing and of verordeningenWrite when creating
     * We need to transform the values to verordeningenWrite when editing before patching
     * @param values the data from the Formik forms
     */
    type CustomFormikValues =
        | (ExtendTypesWithNull<Verordening> & {
              Children?: ExtendTypesWithNull<Verordening>[]
          })
        | (ExtendTypesWithNull<VerordeningUpdate> & {
              Children?: ExtendTypesWithNull<Verordening>[]
          })
    const handleSubmit = async (
        values: CustomFormikValues,
        {
            resetForm,
        }: {
            resetForm: (
                nextState?: Partial<FormikState<CustomFormikValues>> | undefined
            ) => void
        }
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
                let patchedChildren: Verordening[] | null = null

                if (values.Type === 'Artikel' && values.Children) {
                    patchedChildren = await Promise.all(
                        values.Children.map(async child => {
                            const childInWriteFormat =
                                mutateVerordeningenReadToVerordeningenWrite(
                                    child as Verordening
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
                        values as Verordening
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
                    [`getVerordeningStructuur/${patchedVerordening.ID}`],
                    patchedVerordening
                )
                queryClient.setQueryData(
                    getReadVerordeningVersionQueryKey(
                        patchedSection.UUID || ''
                    ),
                    patchedSection
                )

                /** Reset state */
                dispatch({ type: 'resetEditingSection' })
                resetForm({})
            } catch (err) {
                handleError(err)
                dispatch({ type: 'resetEditingSection' })
            }
        } else {
            /** POST */
            try {
                let postObject = cloneDeep(values)
                /**
                 * Check if postObject is of Type `Artikel`. If so it could have `Leden` on the `Children` property
                 * If that is the case we need to patch these as well.
                 */
                let patchedChildren: Verordening[] | null = null

                if (newSection?.Type === 'Artikel' && postObject.Children) {
                    patchedChildren = await Promise.all(
                        postObject.Children.map(async child => {
                            const childInWriteFormat =
                                mutateVerordeningenReadToVerordeningenWrite(
                                    child as Verordening
                                )

                            const patchedChild = await patchVerordeningSection(
                                childInWriteFormat,
                                child.ID!
                            )

                            return patchedChild
                        })
                    )

                    delete postObject.Children
                }

                postObject = mutateVerordeningenReadToVerordeningenWrite(
                    postObject as Verordening
                )

                /** Create Verordening Object from newSection and postObject */
                const createdSectionFromAPI = await postVerordeningSection({
                    ...postObject,
                    ...newSection,
                } as VerordeningCreate)

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
                    [`getVerordeningStructuur/${patchedVerordening.ID}`],
                    patchedVerordening
                )

                dispatch({ type: 'resetEditingSection' })
                resetForm({})
            } catch (err) {
                handleError(err)
                dispatch({ type: 'resetEditingSection' })
            }
        }
    }

    return (
        <MotionConfig reducedMotion={'always'}>
            <Formik
                initialValues={activeSectionData || newSection || {}}
                enableReinitialize={true}
                onSubmit={handleSubmit}>
                <Form className="w-full">
                    <Helmet>
                        <title>Omgevingsbeleid - Beheer Verordening</title>
                    </Helmet>
                    <Container>
                        <VerordeningSectionContainer verordening={verordening}>
                            <ReorderGroup
                                parentType={null}
                                replaceUlForFragment={
                                    activeChapterUUID !== null
                                }
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
