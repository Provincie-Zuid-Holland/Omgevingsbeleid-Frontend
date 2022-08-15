import { Button, Heading } from '@pzh-ui/components'
import classNames from 'classnames'
import { FC, Fragment } from 'react'

import { VerordeningLineageRead } from '@/types/verordening'

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
    const { dispatch, state } = useVerordening()
    const { activeChapterUUID, isEditingOrder, isAddingSection } = state
    const activeChapter = activeChapterUUID
        ? verordening.Structuur.Children.find(e => e.UUID === activeChapterUUID)
        : null

    return (
        <Fragment>
            <div className="col-span-4 my-8">
                {activeChapterUUID && (
                    <button
                        type="button"
                        onClick={() =>
                            dispatch({
                                type: 'setActiveChapterUUID',
                                payload: null,
                            })
                        }
                        className="underline ">
                        Terug naar verordening{' '}
                    </button>
                )}

                <div
                    className={classNames({
                        'flex items-center py-3 rounded px-4 my-2 font-bold bg-pzh-blue-super-light':
                            activeChapter,
                    })}>
                    <Heading level={activeChapter ? '3' : '2'}>
                        {activeChapter
                            ? activeChapter.Titel
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
                <Button
                    type="button"
                    variant="cta"
                    onClick={() => {
                        dispatch({
                            type: 'setIsEditingOrder',
                            payload: !isEditingOrder,
                        })
                    }}>
                    Toggle Reorder
                </Button>

                <Button
                    type="button"
                    variant="cta"
                    onClick={() => {
                        dispatch({
                            type: 'setIsAddingSection',
                            payload: !isAddingSection,
                        })
                    }}>
                    Toggle Add Sections
                </Button>
            </div>
        </Fragment>
    )
}

export default VerordeningSectionContainer
