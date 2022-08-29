import { Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useDragControls } from 'framer-motion'
import { Fragment } from 'react'

import { VerordeningStructureChild } from '@/types/verordening'

import AddSection from '../AddSection'
import FormArticleContent from '../Form/FormArticleContent'
import FormArticleSubSections from '../Form/FormArticleSubSections'
import FormNumberAndTitle from '../Form/FormNumberAndTitle'
import FormSubmitOrCancel from '../Form/FormSubmitOrCancel'
import ReorderGroup from '../ReorderGroup'
import ReorderItem from '../ReorderItem'
import { ActiveSectionData, useVerordening } from '../verordeningEditContext'
import VerordeningSectionAction from '../VerordeningSectionAction'

export interface VerordeningSectionProps {
    section: VerordeningStructureChild
    index: number
    indexPath: number[]
    currentParentType:
        | 'No Parent'
        | 'Hoofdstuk'
        | 'Paragraaf'
        | 'Afdeling'
        | 'Artikel'
        | 'Lid'
    parentArray: string[]
}

const VerordeningSection = ({
    section,
    index,
    indexPath,
    currentParentType,
    parentArray,
}: VerordeningSectionProps) => {
    const { state } = useVerordening()
    const {
        activeChapterUUID,
        isAddingSection,
        addingSectionType,
        isEditingOrder,
    } = state

    const { values } = useFormikContext<ActiveSectionData>()

    const controls = useDragControls()

    const currentIndexPath = [...indexPath, index]

    const userIsEditingThisSection =
        values !== null && values.UUID === section.UUID

    const addSectionBasedOnParentType = !parentArray.includes(addingSectionType)
    const sectionHasChildren = section.Children.length > 0

    if (section.Type === 'Hoofdstuk' && !activeChapterUUID) {
        if (userIsEditingThisSection) {
            return (
                <FormNumberAndTitle type={section.Type}>
                    <FormSubmitOrCancel />
                </FormNumberAndTitle>
            )
        } else {
            return (
                <Fragment>
                    <AddSection
                        show={isAddingSection && index === 0}
                        typeToAdd="Hoofdstuk"
                        indexPath={[0]}
                    />

                    <ReorderItem section={section} controls={controls}>
                        <div className="flex items-center justify-between">
                            <Text className="pr-4">
                                Hoofdstuk {section.Volgnummer} - {section.Titel}
                            </Text>

                            <VerordeningSectionAction
                                section={section}
                                currentIndexPath={currentIndexPath}
                                controls={controls}
                            />
                        </div>
                    </ReorderItem>

                    <AddSection
                        show={isAddingSection}
                        typeToAdd={section.Type}
                        indexPath={[...indexPath, index + 1]}
                    />
                </Fragment>
            )
        }
    } else if (
        section.Type === 'Hoofdstuk' &&
        activeChapterUUID === section.UUID
    ) {
        return (
            <LoopThroughChildren
                parentArray={[...parentArray, currentParentType]}
                section={section}
                currentIndexPath={currentIndexPath}
            />
        )
    } else if (section.Type === 'Afdeling') {
        return (
            <ReorderItem section={section} controls={controls}>
                <div className="bg-white">
                    {userIsEditingThisSection ? (
                        <FormNumberAndTitle type={section.Type}>
                            <FormSubmitOrCancel />
                        </FormNumberAndTitle>
                    ) : (
                        <Fragment>
                            <div className="flex items-center justify-between py-2 pl-4 font-bold rounded cursor-pointer hover:bg-pzh-blue-super-light bg-pzh-blue-super-light hover:bg-gray-100">
                                <Text className="pr-4">
                                    Afdeling {section.Volgnummer} -{' '}
                                    {section.Titel}
                                </Text>

                                <VerordeningSectionAction
                                    section={section}
                                    currentIndexPath={currentIndexPath}
                                    controls={controls}
                                />
                            </div>
                        </Fragment>
                    )}
                    {sectionHasChildren ? (
                        <LoopThroughChildren
                            parentArray={[...parentArray, currentParentType]}
                            section={section}
                            currentIndexPath={currentIndexPath}
                        />
                    ) : (
                        <AddSection
                            show={
                                isAddingSection &&
                                addingSectionType !== 'Afdeling' &&
                                addSectionBasedOnParentType
                            }
                            typeToAdd={addingSectionType}
                            indexPath={[...indexPath, index, 0]}
                            marginLeft
                        />
                    )}
                    <AddSection
                        show={isAddingSection && addSectionBasedOnParentType}
                        typeToAdd={addingSectionType}
                        indexPath={[...indexPath, index + 1]}
                    />
                </div>
            </ReorderItem>
        )
    } else if (section.Type === 'Paragraaf') {
        return (
            <ReorderItem section={section} controls={controls}>
                <div className="bg-white">
                    {userIsEditingThisSection ? (
                        <FormNumberAndTitle type={section.Type}>
                            <FormSubmitOrCancel />
                        </FormNumberAndTitle>
                    ) : (
                        <Fragment>
                            <div className="flex items-center justify-between py-2 pl-4 font-bold rounded cursor-pointer hover:bg-pzh-blue-super-light bg-pzh-blue-super-light hover:bg-gray-100">
                                <Text className="pr-4">
                                    Paragraaf {section.Volgnummer} -{' '}
                                    {section.Titel}
                                </Text>

                                <VerordeningSectionAction
                                    section={section}
                                    currentIndexPath={currentIndexPath}
                                    controls={controls}
                                />
                            </div>
                        </Fragment>
                    )}
                    {sectionHasChildren ? (
                        <LoopThroughChildren
                            parentArray={[...parentArray, currentParentType]}
                            section={section}
                            currentIndexPath={currentIndexPath}
                        />
                    ) : (
                        <AddSection
                            show={
                                isAddingSection &&
                                addingSectionType !== 'Paragraaf' &&
                                addSectionBasedOnParentType
                            }
                            typeToAdd={addingSectionType}
                            indexPath={[...indexPath, index, 0]}
                            marginLeft
                        />
                    )}
                    <AddSection
                        show={isAddingSection && addSectionBasedOnParentType}
                        typeToAdd={addingSectionType}
                        indexPath={[...indexPath, index + 1]}
                    />
                </div>
            </ReorderItem>
        )
    } else if (section.Type === 'Artikel') {
        const displayArticleText =
            section.Inhoud && section.Inhoud !== '' && !userIsEditingThisSection

        return (
            <ReorderItem section={section} controls={controls}>
                <div className="px-5 -mx-5 bg-white">
                    <div>
                        {userIsEditingThisSection ? (
                            <Fragment>
                                <FormNumberAndTitle type={section.Type}>
                                    <FormSubmitOrCancel />
                                </FormNumberAndTitle>
                                <FormArticleContent />
                            </Fragment>
                        ) : (
                            <Fragment>
                                <div className="flex items-center justify-between">
                                    <Text
                                        type="span"
                                        className="pr-4 font-bold">
                                        Artikel {section.Volgnummer}{' '}
                                        {section.Titel}
                                    </Text>
                                    <VerordeningSectionAction
                                        section={section}
                                        currentIndexPath={currentIndexPath}
                                        controls={controls}
                                    />
                                </div>
                            </Fragment>
                        )}
                        {displayArticleText && !isEditingOrder ? (
                            <Text
                                className="pl-4 pr-6 whitespace-pre-line"
                                type="body">
                                {section.Inhoud}
                            </Text>
                        ) : null}
                        <AddSection
                            show={
                                isAddingSection &&
                                !sectionHasChildren &&
                                addSectionBasedOnParentType
                            }
                            typeToAdd={addingSectionType}
                            indexPath={[...indexPath, index + 1]}
                        />
                    </div>

                    {sectionHasChildren && !userIsEditingThisSection ? (
                        <Fragment>
                            <LoopThroughChildren
                                parentArray={[
                                    ...parentArray,
                                    currentParentType,
                                ]}
                                section={section}
                                currentIndexPath={currentIndexPath}
                            />
                            <AddSection
                                show={
                                    isAddingSection &&
                                    addSectionBasedOnParentType
                                }
                                typeToAdd={addingSectionType}
                                indexPath={[...indexPath, index + 1]}
                            />
                        </Fragment>
                    ) : userIsEditingThisSection ? (
                        <FormArticleSubSections />
                    ) : null}
                </div>
            </ReorderItem>
        )
    } else if (section.Type === 'Lid' && !isEditingOrder) {
        return (
            <ReorderItem section={section} controls={controls}>
                <div className="relative -pl-4">
                    <Text type="span" className="font-bold">
                        {section.Titel}
                    </Text>
                    <Text className="pr-6 whitespace-pre-line" type="body">
                        {section.Inhoud}
                    </Text>
                </div>
            </ReorderItem>
        )
    } else {
        return null
    }
}

interface LoopThroughChildrenProps {
    currentIndexPath: number[]
    section: VerordeningStructureChild
    parentArray: string[]
}

const LoopThroughChildren = ({
    currentIndexPath,
    section,
    parentArray,
}: LoopThroughChildrenProps) => {
    const { state } = useVerordening()
    const { isAddingSection, addingSectionType } = state

    return (
        <ReorderGroup indexPath={currentIndexPath} values={section.Children}>
            {section.Children.length > 0 ? (
                <Fragment>
                    <AddSection
                        show={
                            isAddingSection &&
                            section.Type !== 'Artikel' &&
                            section.Type !== addingSectionType
                        }
                        typeToAdd={addingSectionType}
                        indexPath={[...currentIndexPath, 0]}
                    />
                    {section.Children.map(
                        (
                            sectionChild: VerordeningStructureChild,
                            sectionChildIndex
                        ) => (
                            <VerordeningSection
                                indexPath={currentIndexPath}
                                key={sectionChild.UUID}
                                section={sectionChild}
                                currentParentType={section.Type}
                                parentArray={[...parentArray, section.Type]}
                                index={sectionChildIndex}
                            />
                        )
                    )}
                </Fragment>
            ) : isAddingSection ? (
                <AddSection
                    show={isAddingSection}
                    typeToAdd={addingSectionType}
                    indexPath={[...currentIndexPath, 0]}
                />
            ) : null}
        </ReorderGroup>
    )
}

export default VerordeningSection
