import { Button, Heading, Text } from '@pzh-ui/components'
import { FloppyDisk, Xmark } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useFormikContext } from 'formik'
import { FC, Fragment } from 'react'
import { useQueryClient } from 'react-query'
import { Link, useParams } from 'react-router-dom'

import { VerordeningenRead } from '@/api/fetchers.schemas'
import ButtonBackToPage from '@/components/ButtonBackToPage'
import { VerordeningLineageRead } from '@/types/verordening'
import { patchVerordeningStructureChildren } from '@/utils/verordening'

import FormArticleSidebar from '../Form/FormArticleSidebar'
import VerordeningAddSectionTypeContainer from '../VerordeningAddSectionTypeContainer'
import { useVerordening } from '../verordeningEditContext'

export interface VerordeningSectionContainerProps {
    verordening: VerordeningLineageRead
}

/**
 * Contains the functionality to toggle 'add section' and 'reorder sections' modes
 */
const VerordeningSectionContainer: FC<VerordeningSectionContainerProps> = ({
    children,
    verordening,
}) => {
    const { values } = useFormikContext<VerordeningenRead>()
    const { dispatch, state } = useVerordening()

    const {
        activeChapterUUID,
        isEditingOrder,
        isAddingSection,
        addingSectionType,
        lineageClone,
        isLoadingOrSaving,
        newSection,
        activeSectionData,
    } = state

    const queryClient = useQueryClient()

    const activeChapter = activeChapterUUID
        ? verordening.Structuur.Children.find(e => e.UUID === activeChapterUUID)
        : null

    const isCreatingOrEditingArticle =
        (activeSectionData && activeSectionData.Type === 'Artikel') ||
        newSection?.Type === 'Artikel'

    const { single } = useParams<{ single: string }>()

    return (
        <Fragment>
            <div
                className={classNames(
                    `grid grid-cols-6 col-span-6 gap-x-10 pt-2`
                )}>
                <div className="col-span-6">
                    {!activeChapterUUID && (
                        <ButtonBackToPage
                            terugNaar="verordeningen"
                            url="/muteer/verordeningen"
                        />
                    )}
                    {activeChapterUUID && (
                        <ButtonBackToPage
                            terugNaar="verordening"
                            onClick={() => {
                                dispatch({
                                    type: 'setActiveChapterUUID',
                                    payload: null,
                                })
                                dispatch({
                                    type: 'setActiveSectionData',
                                    payload: null,
                                })
                                dispatch({
                                    type: 'setIsAddingSection',
                                    payload: false,
                                })
                                dispatch({
                                    type: 'setIsEditingOrder',
                                    payload: false,
                                })
                            }}
                        />
                    )}
                </div>
            </div>
            <div className="col-span-4 pb-8 lg:pb-12">
                <div
                    className={classNames({
                        'flex items-center pt-3 pb-2 rounded px-4 font-bold bg-pzh-blue-super-light':
                            activeChapter,
                    })}>
                    <Heading level={activeChapter ? '3' : '2'}>
                        {activeChapter
                            ? `Hoofdstuk ${activeChapter.Volgnummer} - ${activeChapter.Titel}`
                            : verordening.Titel}
                    </Heading>
                </div>
                <div
                    className={classNames({
                        'pl-4': activeChapter,
                    })}>
                    {children}
                </div>
            </div>
            <div className="col-span-2">
                <div className="sticky" style={{ top: 'calc(146px + 1rem)' }}>
                    {isCreatingOrEditingArticle && <FormArticleSidebar />}

                    {!activeChapter && !isEditingOrder && !isAddingSection && (
                        <Link to={`/muteer/verordeningen/${single}/bewerk`}>
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full mb-2">
                                Bewerk de verordening
                            </Button>
                        </Link>
                    )}

                    {!isEditingOrder && !isAddingSection && !values?.Type && (
                        <Fragment>
                            {lineageClone?.Structuur &&
                                lineageClone.Structuur.Children.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => {
                                            dispatch({
                                                type: 'setIsEditingOrder',
                                                payload: !isEditingOrder,
                                            })
                                        }}>
                                        Wijzig de volgorde
                                    </Button>
                                )}

                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full mt-2"
                                onClick={() => {
                                    dispatch({
                                        type: 'setIsAddingSection',
                                        payload: !isAddingSection,
                                    })
                                }}>
                                Voeg een sectie toe
                            </Button>
                        </Fragment>
                    )}

                    {isEditingOrder ? (
                        <div>
                            <Heading level="3">Volgorde wijzigen</Heading>
                            <Text>
                                {activeChapterUUID
                                    ? 'Je bent op dit moment de volgorde binnen dit hoofdstuk aan het wijzigen'
                                    : 'Je bent op dit moment de volgorde van de hoofdstukken aan het wijzigen'}
                            </Text>
                            <div className="mt-2">
                                <Button
                                    icon={Xmark}
                                    className="mt-2 mr-2"
                                    variant="secondary"
                                    type="button"
                                    onClick={() =>
                                        dispatch({
                                            type: 'setIsEditingOrder',
                                            payload: false,
                                        })
                                    }>
                                    Annuleren
                                </Button>
                                <Button
                                    icon={FloppyDisk}
                                    disabled={isLoadingOrSaving}
                                    className="mt-2"
                                    variant="cta"
                                    type="button"
                                    onClick={async () => {
                                        dispatch({
                                            type: 'setIsLoadingOrSaving',
                                            payload: true,
                                        })

                                        const patchedVerordening =
                                            await patchVerordeningStructureChildren(
                                                lineageClone!.ID,
                                                lineageClone?.Structuur
                                                    ?.Children || []
                                            )

                                        queryClient.setQueryData(
                                            `getVerordeningStructuur/${patchedVerordening.ID}`,
                                            patchedVerordening
                                        )

                                        dispatch({
                                            type: 'setIsLoadingOrSaving',
                                            payload: false,
                                        })

                                        dispatch({
                                            type: 'setIsEditingOrder',
                                            payload: false,
                                        })
                                    }}>
                                    Opslaan
                                </Button>
                            </div>
                        </div>
                    ) : null}

                    {/**
                     * Hide section when newSection is not undefined and is of type 'Artikel'
                     * Instead of this section we will display extra fields for the 'Artikel' section
                     */}
                    {isAddingSection && newSection?.Type !== 'Artikel' ? (
                        <div>
                            <Heading level="3">Voeg een sectie toe</Heading>
                            <Text>
                                Je kunt op dit moment onderdelen toevoegen. Klik
                                op de plek waar je een onderdeel wilt toevoegen.
                            </Text>
                            {activeChapter && (
                                <div className="mt-4">
                                    <VerordeningAddSectionTypeContainer
                                        dispatch={dispatch}
                                        addingSectionType={addingSectionType}
                                        type="Afdeling"
                                    />
                                    <VerordeningAddSectionTypeContainer
                                        dispatch={dispatch}
                                        addingSectionType={addingSectionType}
                                        type="Paragraaf"
                                    />
                                    <VerordeningAddSectionTypeContainer
                                        dispatch={dispatch}
                                        addingSectionType={addingSectionType}
                                        type="Artikel"
                                    />
                                </div>
                            )}
                            <div className="mt-2">
                                <Button
                                    icon={Xmark}
                                    className="mt-2"
                                    variant="secondary"
                                    type="button"
                                    onClick={() =>
                                        dispatch({
                                            type: 'setIsAddingSection',
                                            payload: false,
                                        })
                                    }>
                                    Annuleren
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </Fragment>
    )
}

export default VerordeningSectionContainer
