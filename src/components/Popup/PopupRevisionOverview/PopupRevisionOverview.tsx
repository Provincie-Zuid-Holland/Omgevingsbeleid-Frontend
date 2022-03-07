import { faTimes } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { useClickAway, useKey } from 'react-use'

import axios from '@/api/instance'
import { LoaderSpinner } from '@/components/Loader'
import RevisionOverviewChangeContainer from '@/components/RevisionOverview/RevisionOverviewChangeContainer'
import { getOptions } from '@/utils/revisionOverview'

/**
 * Displays an popup containing the Revisieoverzicht with a list of beleidskeuzes, which the user can compare two beleidskeuzes.
 *
 * @Component
 *
 * @param {boolean} revisionOverviewOpen - Indicating if the revision overview is open
 * @param {function} setRevisionOverviewOpen - Function to open/close the RevisionOverviewOpen popup.
 * @param {object} dataObject - Contains the data of the object the user is viewing on the detail page.
 * @param {object[]} revisionObjects - Containing a collection of revisions in object form.
 */

interface PopupRevisionOverviewProps {
    revisionOverviewOpen?: boolean
    setRevisionOverviewOpen: (state: boolean) => void
    dataObject: any
    revisionObjects: any[]
}

const PopupRevisionOverview = ({
    revisionOverviewOpen,
    setRevisionOverviewOpen,
    dataObject,
    revisionObjects,
}: PopupRevisionOverviewProps) => {
    // Used to lock the vertical body scroll (overflow)
    const [bodyLock, setBodyLock] = useState(false)

    // Options for the select component
    const [optionsLeft, setOptionsLeft] = useState<
        | {
              label: string
              value: any
              isDisabled: boolean | undefined
          }[]
    >([])

    const [optionsRight, setOptionsRight] = useState<
        | {
              label: string
              value: any
              isDisabled: boolean | undefined
          }[]
    >([])

    const [leftSelect, setLeftSelect] = useState(null)
    const [rightSelect, setRightSelect] = useState(null)

    const [changesFromApi, setChangesFromApi] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const innerContainer = useRef(null)

    useClickAway(innerContainer, (event: MouseEvent) => {
        // The following function is to prevent closing when a click happens on the scrollbar
        // scrollWidth gets the width of the element without the scrollbar

        const fixedContainerEl = document.getElementById(
            'revisionOverview-container-fixed'
        ) as HTMLDivElement

        if (fixedContainerEl.scrollWidth <= event.clientX) return

        setRevisionOverviewOpen(false)
    })

    useKey('Escape', () => setRevisionOverviewOpen(false))

    // Reset when the user opens the window
    useLayoutEffect(() => {
        if (revisionOverviewOpen) {
            setLeftSelect(null)
            setRightSelect(null)
            setChangesFromApi(null)
        }
    }, [revisionOverviewOpen])

    useEffect(() => {
        if (revisionOverviewOpen) {
            setBodyLock(true)
        } else {
            setTimeout(() => {
                setBodyLock(false)
            }, 110) // duration of the Transition + 1ms margin, this prevents two scrollbars
        }
    }, [revisionOverviewOpen])

    const selectOnScroll = () => {
        const selectContainer = document.getElementById(
            'revisionOverview-select-container'
        )
        const selectHeader = document.getElementById('revisionOverview-header')

        if (!selectContainer) return
        if (!selectHeader) return

        const selectWidth = selectContainer.offsetWidth
        const extraMargin = 32
        const selectHeight = selectContainer.offsetHeight + extraMargin
        const selectTop = selectContainer.getBoundingClientRect().top
        const headerBottom = selectHeader.getBoundingClientRect().bottom

        if (selectTop < 0) {
            selectContainer.classList.add('fixed', 'top-0', 'z-10', 'shadow-md')
            selectContainer.style.width = selectWidth + 'px'
            selectHeader.style.marginBottom = selectHeight + 'px'
        } else if (headerBottom > 0) {
            selectContainer.style.width = '100%'
            selectHeader.style.marginBottom = 0 + 'px'
            selectContainer.classList.remove(
                'fixed',
                'top-0',
                'z-10',
                'shadow-md'
            )
        }
    }

    useEffect(() => {
        const sortedRevisionObjects = revisionObjects.sort(
            (a, b) =>
                (new Date(b.Begin_Geldigheid) as any) -
                (new Date(a.Begin_Geldigheid) as any)
        )

        const optionsFromRevisionsLeft = getOptions(
            sortedRevisionObjects,
            'left',
            rightSelect,
            leftSelect
        )
        const optionsFromRevisionsRight = getOptions(
            sortedRevisionObjects,
            'right',
            rightSelect,
            leftSelect
        )

        setOptionsLeft(optionsFromRevisionsLeft)
        setOptionsRight(optionsFromRevisionsRight)

        // If both leftSelect and rightSelect have a value, we get the new changes
        if (!leftSelect || !rightSelect) return

        setIsLoading(true)

        axios
            .get(`changes/beleidskeuzes/${leftSelect}/${rightSelect}`)
            .then(res => {
                setChangesFromApi(res.data)
                setIsLoading(false)
            })
    }, [leftSelect, rightSelect, revisionObjects])

    // Disables html vertical scroll when revisieOverzicht is open
    useEffect(() => {
        window.setTimeout(() => {
            const htmlElement = document.getElementsByTagName('html')[0]
            if (bodyLock) {
                // Set overflow hidden on HTML element
                htmlElement.style.overflow = 'hidden'
                htmlElement.style.paddingRight = '15px'
            } else {
                // Set overflow auto on HTML element
                htmlElement.style.overflow = ''
                htmlElement.style.paddingRight = ''
            }
        }, 210)
    }, [bodyLock])

    return (
        <>
            <Transition
                show={revisionOverviewOpen}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
            </Transition>
            <div
                id="revisionOverview-container-fixed"
                onScroll={selectOnScroll}
                className={`fixed inset-0 z-10 w-full overflow-y-auto ${
                    revisionOverviewOpen ? '' : 'pointer-events-none'
                }`}>
                <Transition
                    show={revisionOverviewOpen}
                    enter="transition ease-out duration-150 transform"
                    enterFrom="-translate-y-1 scale-95"
                    enterTo="translate-y-0 scale-100"
                    leave="transition ease-in duration-100 transform"
                    leaveFrom="translate-y-0 scale-100"
                    leaveTo="-translate-y-1 scale-95"
                    className="h-full">
                    <div
                        className="container h-full p-6 mx-auto pointer-events-auto"
                        ref={innerContainer}>
                        <div className="relative z-50 w-full h-full text-left text-gray-700 bg-white rounded-md shadow-md">
                            <div
                                className="block w-full p-4 pb-0 text-left transition-shadow duration-200 ease-in bg-gray-100 md:p-6 md:pb-0 lg:p-6 lg:pb-0 rounded-t-md"
                                id="revisionOverview-header">
                                <div
                                    onClick={() => {
                                        setRevisionOverviewOpen(false)
                                    }}
                                    className="absolute top-0 right-0 px-3 py-2 text-gray-600 transition-colors duration-100 ease-in cursor-pointer md:mt-4 md:mr-4 hover:text-gray-800"
                                    id={`close-revisionOverview`}>
                                    <FontAwesomeIcon
                                        className="text-base lg:text-lg"
                                        icon={faTimes}
                                    />
                                </div>
                                <h2 className="block mb-1 text-xl font-bold tracking-wide text-pzh-blue">
                                    Revisieoverzicht
                                </h2>
                                <p className="w-full pr-10 leading-7 text-gray-800 break-words whitespace-pre-line">
                                    Vergelijk de versies van de Beleidskeuze “
                                    {dataObject.Titel}”.
                                </p>
                                <p className="mt-4 font-bold text-pzh-blue-dark">
                                    Welke versies wil je vergelijken?
                                </p>
                            </div>
                            <div
                                id="revisionOverview-select-container"
                                className="block w-full px-6 pt-2 pb-6 bg-gray-100 border-b border-gray-300">
                                <div className="flex flex-col items-center justify-between lg:flex-row">
                                    <Select
                                        className="w-full shadow lg:w-1/2 lg:mr-2"
                                        id={`revisie-from`}
                                        name="revisie-form-from"
                                        onChange={e => setLeftSelect(e?.value)}
                                        options={optionsLeft}
                                        placeholder="Selecteer de oudere versie van de beleidskeuze"
                                        aria-label="Selecteer de oudere versie van de beleidskeuze"
                                    />
                                    <Select
                                        className="w-full mt-4 shadow lg:w-1/2 lg:ml-2 lg:mt-0"
                                        id={`revisie-to`}
                                        name="revisie-form-to"
                                        onChange={e => setRightSelect(e?.value)}
                                        options={optionsRight}
                                        placeholder="Selecteer de nieuwere versie van de beleidskeuze"
                                        aria-label="Selecteer de nieuwere versie van de beleidskeuze"
                                    />
                                </div>
                            </div>
                            <div className="w-full bg-white rounded-b-md">
                                {isLoading && !changesFromApi ? (
                                    <div className="flex items-center justify-center w-full h-64 text-xl text-gray-600">
                                        <LoaderSpinner />
                                    </div>
                                ) : changesFromApi && !isLoading ? (
                                    <RevisionOverviewChangeContainer
                                        revisionObjects={revisionObjects}
                                        oldObject={changesFromApi.old}
                                        changesObject={changesFromApi.changes}
                                        originalObject={dataObject}
                                    />
                                ) : changesFromApi && isLoading ? (
                                    <>
                                        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen text-xl text-gray-600">
                                            <LoaderSpinner />
                                        </div>
                                        <div className="opacity-50">
                                            <RevisionOverviewChangeContainer
                                                revisionObjects={
                                                    revisionObjects
                                                }
                                                oldObject={changesFromApi.old}
                                                changesObject={
                                                    changesFromApi.changes
                                                }
                                                originalObject={dataObject}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center w-full h-64">
                                        <span className="p-4 text-base italic text-center text-gray-600 md:text-xl">
                                            Selecteer twee beleidskeuzes om te
                                            vergelijken
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </>
    )
}

export default PopupRevisionOverview
