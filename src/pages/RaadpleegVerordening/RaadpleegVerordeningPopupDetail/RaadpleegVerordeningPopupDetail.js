import React from "react"

import Heading from "../../../components/Heading"
import Text from "../../../components/Text"
import Modal from "../../../components/Modal"
import LeafletTinyViewer from "../../../components/LeafletTinyViewer"

const RaadpleegVerordeningPopupDetail = ({
    setActiveArticle,
    activeArticle,
}) => {
    const [open, setOpen] = React.useState(false)
    const [articleHasChildren, setArticleHasChildren] = React.useState(null)
    const [activeChild, setActiveChild] = React.useState(null)

    React.useEffect(() => {
        if (activeArticle?.Children.length > 0) {
            setArticleHasChildren(true)
        } else {
            setArticleHasChildren(false)
        }
    }, [activeArticle])

    React.useEffect(() => {
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
                        color="text-pzh-blue-dark"
                    >
                        {activeArticle.Titel}
                    </Heading>
                    {articleHasChildren ? (
                        <ul className="mt-4">
                            {activeArticle.Children.map((child) => (
                                <li
                                    onClick={() => {
                                        setActiveChild(null)
                                        setActiveChild(child)
                                    }}
                                    key={child.Volgnummer}
                                    style={{ width: "calc(100% + 1rem)" }}
                                    className="p-2 mb-4 -mt-2 -ml-2 transition-colors duration-150 ease-in rounded-md cursor-pointer hover:bg-gray-200 hover:bg-opacity-70"
                                >
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
                            color="text-pzh-green"
                        >
                            Werkingsgebied
                        </Heading>
                        {articleHasChildren ? (
                            <div
                                className="flex items-center justify-center mt-4 text-center rounded-md bg-pzh-cool-gray-light bg-opacity-20"
                                style={{ height: "400px" }}
                            >
                                {activeChild ? (
                                    <LeafletTinyViewer
                                        gebiedType="Werkingsgebieden"
                                        gebiedUUID={activeArticle.Gebied}
                                    />
                                ) : (
                                    <div className="p-4">
                                        <Text
                                            type="body"
                                            color="text-pzh-cool-gray-dark"
                                        >
                                            Klik op een lid om te zien waar dit
                                            lid van toepassing is
                                        </Text>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-4" style={{ height: "400px" }}>
                                <LeafletTinyViewer
                                    gebiedType="Werkingsgebieden"
                                    gebiedUUID={activeArticle.Gebied}
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-6">
                        <Heading
                            level="3"
                            className="font-bold"
                            color="text-pzh-green"
                        >
                            Koppelingen
                        </Heading>
                        <ArticleConnections activeArticle={activeArticle} />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

const ArticleConnections = ({ activeArticle }) => {
    return <div></div>
}

export default RaadpleegVerordeningPopupDetail
