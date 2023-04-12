import { Heading, Modal, Text } from '@pzh-ui/components'
import { CircleXmark } from '@pzh-ui/icons'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { getVersionVerordeningenObjectUuid } from '@/api/fetchers'
import { BeleidskeuzeShortInline } from '@/api/fetchers.schemas'
import { LeafletTinyViewer } from '@/components/Leaflet'
import handleError from '@/utils/handleError'

interface ActiveArticleInterface {
    Children: ActiveArticleInterface[]
    Gebied: string
    Inhoud: string
    Titel: string
    Type: string
    UUID: string
    Volgnummer: string
}

interface VerordeningPopupDetailProps {
    setActiveArticle: (state: any) => void
    activeArticle: ActiveArticleInterface
}

const VerordeningPopupDetail = ({
    setActiveArticle,
    activeArticle,
}: VerordeningPopupDetailProps) => {
    const location = useLocation()
    const [connections, setConnections] = useState<BeleidskeuzeShortInline[]>(
        []
    )
    const [open, setOpen] = useState(false)
    const [articleHasChildren, setArticleHasChildren] = useState<
        boolean | null
    >(null)
    const [activeChild, setActiveChild] =
        useState<ActiveArticleInterface | null>(null)

    useEffect(() => {
        setConnections([])

        if (activeArticle?.Children.length > 0) {
            setArticleHasChildren(true)
        } else {
            setArticleHasChildren(false)
        }

        if (!activeArticle) return

        getVersionVerordeningenObjectUuid(activeArticle.UUID)
            .then(res => {
                setConnections(res.Ref_Beleidskeuzes || [])
            })
            .catch(err => handleError(err))
    }, [activeArticle])

    useEffect(() => {
        setOpen(true)
    }, [])

    const close = () => {
        setOpen(false)
        setActiveChild(null)

        /** Timeout for the animation */
        window.setTimeout(() => {
            setActiveArticle(null)
        }, 300)
    }

    return (
        <Modal
            open={open}
            onClose={close}
            ariaLabel={`Artikel ${activeArticle.Volgnummer}`}>
            <Heading
                level="2"
                className="pl-3 font-bold"
                color="text-pzh-blue-dark">
                Artikel {activeArticle.Volgnummer}
            </Heading>
            <div className="grid grid-cols-2">
                <div
                    className="col-span-2 px-5 overflow-y-auto sm:col-span-1 pb-30"
                    style={{ maxHeight: '60vh' }}>
                    <Heading
                        level="4"
                        className="font-bold"
                        color="text-pzh-blue-dark">
                        {activeArticle.Titel}
                    </Heading>
                    {articleHasChildren ? (
                        <ul className="mt-4">
                            {activeArticle.Children.map(child => (
                                <li key={child.Volgnummer} className="relative">
                                    {activeChild?.UUID === child.UUID ? (
                                        <div
                                            className="absolute top-0 right-0 z-10 flex items-center justify-center w-6 h-6 -mt-3 -mr-5 cursor-pointer"
                                            onClick={() => {
                                                setActiveChild(null)
                                            }}>
                                            <CircleXmark
                                                size={20}
                                                className="inline-block text-pzh-blue-dark"
                                            />
                                        </div>
                                    ) : null}
                                    <div
                                        onClick={() => {
                                            setActiveChild(null)
                                            setActiveChild(child)
                                        }}
                                        style={{ width: 'calc(100% + 1rem)' }}
                                        className={`px-2 py-3 mb-1 -ml-2 transition-colors duration-150 ease-in cursor-pointer ${
                                            activeChild?.UUID === child.UUID
                                                ? 'bg-pzh-blue-light/20'
                                                : 'hover:bg-pzh-blue-light/20'
                                        }`}>
                                        <Text>{child.Inhoud}</Text>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Text className="mt-4">{activeArticle.Inhoud}</Text>
                    )}
                </div>
                <div className="col-span-2 pl-5 sm:col-span-1">
                    <div>
                        <Heading
                            level="4"
                            className="mt-6 font-bold sm:mt-0"
                            color="text-pzh-green">
                            Werkingsgebied
                        </Heading>
                        {articleHasChildren ? (
                            <div
                                className="flex items-center justify-center mt-4 text-center rounded-md bg-pzh-cool-gray-light/20"
                                style={{ height: '400px' }}>
                                {activeChild ? (
                                    <LeafletTinyViewer
                                        gebiedType="Werkingsgebieden"
                                        gebiedUUID={activeChild.Gebied}
                                    />
                                ) : (
                                    <div className="p-4">
                                        <Text
                                            type="body"
                                            color="text-pzh-cool-gray-dark">
                                            Klik op een lid om te zien waar dit
                                            lid van toepassing is
                                        </Text>
                                    </div>
                                )}
                            </div>
                        ) : activeArticle.Gebied ? (
                            <div className="mt-4" style={{ height: '400px' }}>
                                <LeafletTinyViewer
                                    gebiedType="Werkingsgebieden"
                                    gebiedUUID={activeArticle.Gebied}
                                />
                            </div>
                        ) : null}
                    </div>
                    {connections.length > 0 ? (
                        <div className="mt-6">
                            <div className="flex justify-between w-full">
                                <Heading
                                    level="4"
                                    className="font-bold"
                                    color="text-pzh-green">
                                    Koppelingen
                                </Heading>
                                <Link
                                    to="/netwerkvisualisatie"
                                    state={{
                                        from:
                                            location.pathname + location.search,
                                    }}
                                    className="text-sm underline text-pzh-green hover:text-pzh-green-dark">
                                    Bekijk grote netwerkvisualisatie
                                </Link>
                            </div>
                            <div>
                                <Text
                                    type="body-small"
                                    className="mt-4 font-bold">
                                    Beleidskeuzes
                                </Text>
                                <ul className="mt-2">
                                    {connections.map(
                                        (
                                            beleidskeuze: BeleidskeuzeShortInline
                                        ) => (
                                            <li
                                                key={beleidskeuze.UUID}
                                                className="px-2">
                                                <span className="inline-block w-2 h-2 mr-2 rounded-full bg-pzh-yellow" />
                                                <Link
                                                    to={`/beleidskeuzes/${beleidskeuze.UUID}`}>
                                                    <Text type="body-small">
                                                        {beleidskeuze.Titel}
                                                    </Text>
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </Modal>
    )
}

export default VerordeningPopupDetail
