import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'

import axios from '@/api/instance'
import { Container } from '@/components/Container'
import Heading from '@/components/Heading'
import { LoaderCard } from '@/components/Loader'
import Text from '@/components/Text'
import VERORDENING from '@/constants/verordeningen'
import useURLQuery from '@/hooks/useURLQuery'

import RaadpleegVerordeningPopupDetail from './VerordeningPopupDetail'
import RaadpleegVerordeningSidebar from './VerordeningSidebar'

function Verordening() {
    const windowSize = useWindowSize()
    const query = useURLQuery()
    const UUIDFromUrl = query.get('actief')
    const [activeArticle, setActiveArticle] = useState(null)

    const { isLoading, data: verordening } = useQuery('verordening', () =>
        axios
            .get('/verordeningstructuur')
            .then(res =>
                res.data.find(
                    (verordening: any) => verordening.Status === 'Vigerend'
                )
            )
    )

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

    return (
        <Container className="pt-16 lg:pt-8">
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

                {verordening?.Structuur?.Children.map((chapter: any) => (
                    <VerordeningsSection
                        setActiveArticle={setActiveArticle}
                        key={chapter.UUID}
                        section={chapter}
                    />
                ))}

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
}

const VerordeningsSection = ({
    section,
    setActiveArticle,
}: VerordeningsSectionProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    if (section.Type === 'Hoofdstuk') {
        return (
            <div className="mt-6 mb-2">
                <div
                    className="relative px-2 pt-2 pb-1 bg-pzh-green-light bg-opacity-10"
                    style={{ width: 'calc(100% + 1rem', left: '-0.5rem' }}
                    id={section.UUID}>
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
                    id={section.UUID}>
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
                          />
                      ))
                    : null}
            </div>
        )
    } else if (section.Type === 'Artikel') {
        return (
            <div className="mt-6 mb-4" id={section.UUID}>
                <div
                    onClick={() => {
                        navigate(
                            `${location.pathname}?actief=${section.UUID}`,
                            { replace: true }
                        )
                        setActiveArticle(section)
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
