import { Heading, Text } from '@pzh-ui/components'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation, useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'

import {
    useReadValidVerordeningstructuren,
    // useReadVerordeningstructuren,
} from '@/api/fetchers'
import { Verordeningstructuur } from '@/api/fetchers.schemas'
import { Container } from '@/components/Container'
import { LoaderCard } from '@/components/Loader'
import VERORDENING from '@/constants/verordeningen'
import useURLQuery from '@/hooks/useURLQuery'

import RaadpleegVerordeningPopupDetail from './VerordeningPopupDetail'
import RaadpleegVerordeningSidebar from './VerordeningSidebar'

function Verordening() {
    const windowSize = useWindowSize()
    const query = useURLQuery()
    const UUIDFromUrl = query.get('actief')
    const [activeArticle, setActiveArticle] = useState(null)
    const [verordening, setVerordening] = useState<null | Verordeningstructuur>(
        null
    )

    const { isLoading, data } = useReadValidVerordeningstructuren()

    useEffect(() => {
        const scrollIntoView = (UUIDFromUrl: string) => {
            const element = document.getElementById(UUIDFromUrl)
            if (!element) return

            const offset = windowSize.width < 1028 ? 60 : 15
            window.scrollTo({
                left: 0,
                top: element.offsetTop - offset,
                behavior: 'smooth',
            })
        }

        scrollIntoView(UUIDFromUrl || '')
    }, [UUIDFromUrl, windowSize, isLoading])

    useEffect(() => {
        const activeVerordening = data?.find(
            (verordening: any) => verordening.Status === 'Vigerend'
        )
        if (activeVerordening) {
            setVerordening(activeVerordening)
        }
    }, [data])

    if (!verordening) return null

    return (
        <Container className="pt-16 lg:pt-8">
            <Helmet>
                <title>Omgevingsbeleid - Verordening</title>
            </Helmet>
            <RaadpleegVerordeningSidebar verordening={verordening} />
            <div className="min-h-screen col-span-6 lg:col-span-4">
                <Heading
                    level="3"
                    className="font-bold"
                    color="text-pzh-blue-dark">
                    {VERORDENING.TITLE_SINGULAR}
                </Heading>

                {!isLoading ? (
                    <Heading level="1" color="text-pzh-blue" className="mt-4">
                        {verordening.Titel}
                    </Heading>
                ) : (
                    <LoaderCard className="mt-6" />
                )}

                {/* TODO: FIX API IMPLEMENTATION  */}
                {/* {verordening?.Structuur?.Children.map((chapter: any) => (
                    <VerordeningsSection
                        setActiveArticle={setActiveArticle}
                        key={chapter.UUID}
                        section={chapter}
                    />
                ))} */}

                {activeArticle ? (
                    <RaadpleegVerordeningPopupDetail
                        setActiveArticle={setActiveArticle}
                        activeArticle={activeArticle}
                    />
                ) : null}
            </div>
        </Container>
    )
}

interface VerordeningsSectionProps {
    section: any
    setActiveArticle: (section: any) => void
    chapterUUID?: string
}

const VerordeningsSection = ({
    section,
    setActiveArticle,
    chapterUUID,
}: VerordeningsSectionProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleKeyLeft = () => {
        const element = document.getElementById(
            `verordening-sidebar-item-${section.UUID}`
        )
        const chapterSidebarItem = document.getElementById(
            `verordening-sidebar-item-${chapterUUID}`
        )
        if (element) {
            element.focus()
        } else if (chapterSidebarItem) {
            chapterSidebarItem.focus()
        }
    }

    if (section.Type === 'Hoofdstuk') {
        return (
            <div className="mt-6 mb-2">
                <div
                    className="relative px-2 pt-2 pb-1 bg-pzh-green-light bg-opacity-10"
                    style={{ width: 'calc(100% + 1rem', left: '-0.5rem' }}
                    id={section.UUID}
                    tabIndex={0}
                    onKeyDown={e => {
                        if (e.key === 'ArrowLeft') {
                            handleKeyLeft()
                        }
                    }}>
                    <Heading
                        customStyles={{
                            fontSize: '1rem',
                            lineHeight: '1.5rem',
                        }}
                        level="2"
                        color="text-pzh-green"
                        className="font-bold">
                        {`${section.Type} ${section.Volgnummer}. ${section.Titel}`}
                    </Heading>
                </div>
                {section?.Children.length > 0
                    ? section.Children.map((child: any) => (
                          <VerordeningsSection
                              setActiveArticle={setActiveArticle}
                              key={child.UUID}
                              section={child}
                              chapterUUID={section.UUID}
                          />
                      ))
                    : null}
            </div>
        )
    } else if (section.Type === 'Paragraaf' || section.Type === 'Afdeling') {
        return (
            <div className="mt-4 mb-2">
                <div
                    className="relative px-2 pt-2 pb-1 bg-pzh-cool-gray bg-opacity-10"
                    style={{ width: 'calc(100% + 1rem', left: '-0.5rem' }}
                    id={section.UUID}
                    tabIndex={0}
                    onKeyDown={e => {
                        if (e.key === 'ArrowLeft') {
                            handleKeyLeft()
                        }
                    }}>
                    <Heading
                        customStyles={{
                            fontSize: '1rem',
                            lineHeight: '1.5rem',
                        }}
                        level="2"
                        color="text-pzh-blue-dark"
                        className="font-bold">
                        {section.Type === 'Paragraaf'
                            ? `§${section.Volgnummer} ${section.Titel}`
                            : `Afdeling ${section.Volgnummer} ${section.Titel}`}
                    </Heading>
                </div>
                {section?.Children.length > 0
                    ? section.Children.map((child: any) => (
                          <VerordeningsSection
                              setActiveArticle={setActiveArticle}
                              key={child.UUID}
                              section={child}
                              chapterUUID={chapterUUID}
                          />
                      ))
                    : null}
            </div>
        )
    } else if (section.Type === 'Artikel') {
        const setActive = () => {
            navigate(`${location.pathname}?actief=${section.UUID}`)
            setActiveArticle(section)
        }

        return (
            <div className="mt-6 mb-4">
                <div
                    id={section.UUID}
                    tabIndex={0}
                    onClick={setActive}
                    onKeyDown={e => {
                        if (e.key === 'Enter') setActive()
                        if (e.key === 'ArrowLeft') {
                            handleKeyLeft()
                        }
                    }}
                    style={{ width: 'calc(100% + 1rem)' }}
                    className="p-2 -mt-2 -ml-2 transition-colors duration-150 ease-in rounded-md cursor-pointer hover:bg-gray-200 hover:bg-opacity-70">
                    <Heading
                        customStyles={{
                            fontSize: '1rem',
                            lineHeight: '1.5rem',
                        }}
                        level="2"
                        color="text-pzh-blue-dark"
                        className="font-bold">
                        {`Artikel ${section.Volgnummer} ${section.Titel}`}
                    </Heading>
                    <div className="mt-2">
                        {section?.Children.length > 0 ? (
                            section.Children.map((child: any) => (
                                <VerordeningsSection
                                    setActiveArticle={setActiveArticle}
                                    key={child.UUID}
                                    section={child}
                                    chapterUUID={chapterUUID}
                                />
                            ))
                        ) : (
                            <Text type="body">{section.Inhoud}</Text>
                        )}
                    </div>
                </div>
            </div>
        )
    } else if (section.Type === 'Lid') {
        return (
            <div id={section.UUID}>
                <Text className="mt-1" type="body">
                    {section.Inhoud}
                </Text>
            </div>
        )
    }

    return null
}

export default Verordening
