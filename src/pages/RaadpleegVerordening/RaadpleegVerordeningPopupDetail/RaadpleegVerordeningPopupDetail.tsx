import { useEffect, useState } from 'react'

import Heading from '@/components/Heading'
import { LeafletTinyViewer } from '@/components/Leaflet'
import Modal from '@/components/Modal'
import Text from '@/components/Text'

interface RaadpleegVerordeningPopupDetailProps {
    setActiveArticle: (state: any) => void
    activeArticle: any
}

const RaadpleegVerordeningPopupDetail = ({
    setActiveArticle,
    activeArticle,
}: RaadpleegVerordeningPopupDetailProps) => {
    const [open, setOpen] = useState(false)
    const [articleHasChildren, setArticleHasChildren] = useState<
        boolean | null
    >(null)
    const [activeChild, setActiveChild] = useState(null)

    useEffect(() => {
        if (activeArticle?.Children.length > 0) {
            setArticleHasChildren(true)
        } else {
            setArticleHasChildren(false)
        }
    }, [activeArticle])

    useEffect(() => {
        setOpen(true)
    }, [])

    const close = () => {
        setOpen(false)

        /** Timeout for the animation */
        window.setTimeout(() => {
            setActiveArticle(null)
        }, 300)
    }

    return (
        <Modal open={open} close={close}>
            <Heading level="2" className="font-bold" color="text-pzh-blue-dark">
                Artikel {activeArticle.Volgnummer}
            </Heading>
            <div className="grid grid-cols-2 gap-x-10">
                <div className="col-span-2 sm:col-span-1">
                    <Heading
                        level="3"
                        className="font-bold"
                        color="text-pzh-blue-dark">
                        {activeArticle.Titel}
                    </Heading>
                    {articleHasChildren ? (
                        <ul className="mt-4">
                            {activeArticle.Children.map((child: any) => (
                                <li
                                    onClick={() => {
                                        setActiveChild(child)
                                    }}
                                    key={child.Volgnummer}
                                    style={{ width: 'calc(100% + 1rem)' }}
                                    className="p-2 mb-4 -mt-2 -ml-2 transition-colors duration-150 ease-in rounded-md cursor-pointer hover:bg-gray-200 hover:bg-opacity-70">
                                    <Text>{child.Inhoud}</Text>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Text className="mt-4">{activeArticle.Inhoud}</Text>
                    )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                    <div>
                        <Heading
                            level="3"
                            className="mt-6 font-bold sm:mt-0"
                            color="text-pzh-green">
                            Werkingsgebied
                        </Heading>
                        {articleHasChildren ? (
                            <div
                                className="flex items-center justify-center mt-4 text-center rounded-md bg-pzh-cool-gray-light bg-opacity-20"
                                style={{ height: '400px' }}>
                                {activeChild ? (
                                    <LeafletTinyViewer
                                        gebiedType="Werkingsgebieden"
                                        gebiedUUID={activeArticle.Gebied}
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
                        ) : (
                            <div className="mt-4" style={{ height: '400px' }}>
                                <LeafletTinyViewer
                                    gebiedType="Werkingsgebieden"
                                    gebiedUUID={activeArticle.Gebied}
                                />
                            </div>
                        )}
                    </div>
                    {activeArticle.Ref_Beleidskeuzes?.length > 0 ? (
                        <div className="mt-6">
                            <Heading
                                level="3"
                                className="font-bold"
                                color="text-pzh-green">
                                Koppelingen
                            </Heading>
                            <ul className="mt-4">
                                {activeArticle.Ref_Beleidskeuzes.map(
                                    (beleidskeuze: any) => (
                                        <li
                                            key={beleidskeuze.UUID}
                                            className="p-2 mb-4 -mt-2 -ml-2 transition-colors duration-150 ease-in rounded-md cursor-pointer hover:bg-gray-200 hover:bg-opacity-70">
                                            <Text>{beleidskeuze.Titel}</Text>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    ) : null}
                </div>
            </div>
        </Modal>
    )
}

export default RaadpleegVerordeningPopupDetail
