import { Text } from '@pzh-ui/components'
import { useDragControls } from 'framer-motion'
import { Fragment } from 'react'

import { VerordeningChildRead } from '@/types/verordening'

import AddSection from '../AddSection'
import FormArticleContent from '../Form/FormArticleContent'
import FormArticleSubSections from '../Form/FormArticleSubSections'
import FormNumberAndTitle from '../Form/FormNumberAndTitle'
import ReorderGroup from '../ReorderGroup'
import ReorderItem from '../ReorderItem'
import { useVerordening } from '../verordeningEditContext'
import VerordeningSectionAction from '../VerordeningSectionAction'

export interface VerordeningSectionProps {
    section: VerordeningChildRead
    index: number
    indexPath: number[]
}

const VerordeningSection = ({
    section,
    index,
    indexPath,
}: VerordeningSectionProps) => {
    const { state } = useVerordening()
    const currentIndexPath = [...indexPath, index]
    const controls = useDragControls()
    const { activeChapterUUID, isAddingSection, activeSectionData } = state
    const userIsEditingSection = activeSectionData !== null
    const userIsEditingThisSection =
        activeSectionData !== null && activeSectionData.UUID === section.UUID

    if (section.Type === 'Hoofdstuk' && !activeChapterUUID) {
        if (userIsEditingThisSection) {
            return <FormNumberAndTitle type={section.Type} />
        } else {
            return (
                <Fragment>
                    <AddSection
                        show={isAddingSection && index === 0}
                        type={section.Type}
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
                        type={section.Type}
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
                section={section}
                currentIndexPath={currentIndexPath}
            />
        )
    } else if (section.Type === 'Afdeling') {
        const paragraphHasChildren = section.Children.length > 0

        return (
            <ReorderItem section={section} controls={controls}>
                <div className="bg-white">
                    {userIsEditingThisSection ? (
                        <FormNumberAndTitle type={section.Type} />
                    ) : (
                        <div className="flex items-center justify-between py-2 pl-4 font-bold rounded cursor-pointer hover:bg-pzh-blue-super-light bg-pzh-blue-super-light hover:bg-gray-100">
                            <Text className="pr-4">
                                Afdeling {section.Volgnummer} - {section.Titel}
                            </Text>

                            <VerordeningSectionAction
                                section={section}
                                currentIndexPath={currentIndexPath}
                                controls={controls}
                            />
                        </div>
                    )}
                    {paragraphHasChildren ? (
                        <LoopThroughChildren
                            section={section}
                            currentIndexPath={currentIndexPath}
                        />
                    ) : null}
                </div>
            </ReorderItem>
        )
    } else if (section.Type === 'Paragraaf') {
        const paragraphHasChildren = section.Children.length > 0

        return (
            <ReorderItem section={section} controls={controls}>
                <div className="bg-white">
                    {userIsEditingThisSection ? (
                        <FormNumberAndTitle type={section.Type} />
                    ) : (
                        <div className="flex items-center justify-between py-2 pl-4 font-bold rounded cursor-pointer hover:bg-pzh-blue-super-light bg-pzh-blue-super-light hover:bg-gray-100">
                            <Text className="pr-4">
                                Paragraaf {section.Volgnummer} - {section.Titel}
                            </Text>

                            <VerordeningSectionAction
                                section={section}
                                currentIndexPath={currentIndexPath}
                                controls={controls}
                            />
                        </div>
                    )}
                    {paragraphHasChildren ? (
                        <LoopThroughChildren
                            section={section}
                            currentIndexPath={currentIndexPath}
                        />
                    ) : null}
                </div>
            </ReorderItem>
        )
    } else if (section.Type === 'Artikel') {
        // Returns a paragraph and its children if there are any
        const articleHasChildren = section.Children.length > 0

        const displayArticleText =
            section.Inhoud && section.Inhoud !== '' && !userIsEditingThisSection
        const displayArticleForm =
            userIsEditingThisSection && section.Inhoud && section.Inhoud !== ''

        return (
            <ReorderItem section={section} controls={controls}>
                <div className="px-5 -mx-5 bg-white">
                    <div>
                        {userIsEditingThisSection ? (
                            <FormNumberAndTitle type={section.Type} />
                        ) : (
                            <div className="flex items-center justify-between">
                                <Text type="span" className="pr-4 font-bold">
                                    Artikel {section.Volgnummer} {section.Titel}
                                </Text>
                                <VerordeningSectionAction
                                    section={section}
                                    currentIndexPath={currentIndexPath}
                                    controls={controls}
                                />
                            </div>
                        )}
                        {displayArticleText ? (
                            <Text
                                className="pr-6 whitespace-pre-line"
                                type="body">
                                {section.Inhoud}
                            </Text>
                        ) : displayArticleForm ? (
                            <FormArticleContent section={section} />
                        ) : null}
                    </div>
                    {articleHasChildren && !userIsEditingThisSection ? (
                        <LoopThroughChildren
                            section={section}
                            currentIndexPath={currentIndexPath}
                        />
                    ) : articleHasChildren && userIsEditingThisSection ? (
                        <FormArticleSubSections section={section} />
                    ) : null}
                </div>
            </ReorderItem>
        )
    } else if (section.Type === 'Lid') {
        // Render a Article Sub Section
        return (
            <ReorderItem section={section} controls={controls}>
                <div>
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
    section: VerordeningChildRead
}

const LoopThroughChildren = ({
    currentIndexPath,
    section,
}: LoopThroughChildrenProps) => {
    return (
        <ReorderGroup
            indexPath={currentIndexPath}
            values={section.Children}
            type={section.Type}>
            {section.Children.map(
                (section: VerordeningChildRead, sectionIndex) => (
                    <VerordeningSection
                        indexPath={currentIndexPath}
                        key={section.UUID}
                        section={section}
                        index={sectionIndex}
                    />
                )
            )}
        </ReorderGroup>
    )
}

export default VerordeningSection
