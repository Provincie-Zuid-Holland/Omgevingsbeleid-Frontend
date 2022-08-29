import { Button, Heading, Text } from '@pzh-ui/components'
import {
    AngleLeft,
    Circle,
    CircleCheck,
    FloppyDisk,
    Xmark,
} from '@pzh-ui/icons'
import classNames from 'classnames'
import { useFormikContext } from 'formik'
import { FC, Fragment } from 'react'
import { useQueryClient } from 'react-query'

import { VerordeningenRead } from '@/api/fetchers.schemas'
import { VerordeningLineageRead } from '@/types/verordening'
import { patchVerordeningStructure } from '@/utils/verordening'

import FormArticleSidebar from '../Form/FormArticleSidebar'
import { Dispatch, useVerordening } from '../verordeningEditContext'

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

    return (
        <Fragment>
            <div
                className={classNames(
                    `grid grid-cols-6 col-span-6 gap-x-10 md:pt-6`,
                    {
                        'md:pb-4 py-4': !activeChapterUUID,
                    }
                )}>
                <div className="col-span-6">
                    {activeChapterUUID && (
                        <button
                            type="button"
                            onClick={() =>
                                dispatch({
                                    type: 'setActiveChapterUUID',
                                    payload: null,
                                })
                            }
                            className="flex items-center py-2 text-pzh-gray-light">
                            <AngleLeft />
                            <span className="mt-1 ml-2">
                                Terug naar verordening
                            </span>
                        </button>
                    )}
                </div>
                <div className="col-span-4">
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
                </div>
            </div>
            <div className="col-span-4 pb-8 lg:pb-12">
                <div
                    className={classNames({
                        'pl-4': activeChapter,
                    })}>
                    {children}
                </div>
            </div>
            <div className="col-span-2 pt-4">
                <div className="sticky" style={{ top: 'calc(1rem + 192px)' }}>
                    {isCreatingOrEditingArticle && <FormArticleSidebar />}

                    {!isEditingOrder && !isAddingSection && !values?.Type && (
                        <Fragment>
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
                                            await patchVerordeningStructure(
                                                lineageClone!.ID,
                                                lineageClone?.Structuur
                                                    ?.Children || []
                                            )

                                        queryClient.setQueryData(
                                            'getVerordeningStructuur',
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
                                    <AddSectionTypeContainer
                                        dispatch={dispatch}
                                        addingSectionType={addingSectionType}
                                        type="Afdeling"
                                    />
                                    <AddSectionTypeContainer
                                        dispatch={dispatch}
                                        addingSectionType={addingSectionType}
                                        type="Paragraaf"
                                    />
                                    <AddSectionTypeContainer
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

interface AddSectionTypeContainerProps {
    addingSectionType: 'Artikel' | 'Afdeling' | 'Paragraaf' | null
    type: 'Afdeling' | 'Paragraaf' | 'Artikel'
    dispatch: Dispatch
}

const AddSectionTypeContainer = ({
    addingSectionType,
    type,
    dispatch,
}: AddSectionTypeContainerProps) => {
    const typeIsSelected = addingSectionType === type

    return (
        <div
            onClick={() => {
                dispatch({
                    type: 'setAddingSectionType',
                    payload: type,
                })
            }}
            className="flex items-center justify-start py-3 pl-5 pr-12 mt-2 font-bold rounded cursor-pointer group bg-pzh-blue-super-light">
            <div className="flex items-center">
                {typeIsSelected ? (
                    <CircleCheck />
                ) : (
                    <Circle className="transition duration-150 ease-in rounded-full group-hover:bg-gray-50" />
                )}
                <Text className="mt-1 ml-5">{type}</Text>
            </div>
        </div>
    )
}

export default VerordeningSectionContainer
