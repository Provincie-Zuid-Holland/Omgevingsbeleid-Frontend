import { useContext } from 'react'

import UserContext from '@/App/UserContext'
import RevisionOverviewBelangen from '@/components/RevisionOverview/RevisionOverviewBelangen'
import RevisionOverviewContainerLeft from '@/components/RevisionOverview/RevisionOverviewContainerLeft'
import RevisionOverviewContainerMain from '@/components/RevisionOverview/RevisionOverviewContainerMain'
import RevisionOverviewContainerRight from '@/components/RevisionOverview/RevisionOverviewContainerRight'
import RevisionOverviewDividerWithTitle from '@/components/RevisionOverview/RevisionOverviewDividerWithTitle'
import RevisionOverviewRelationsConnectionsText from '@/components/RevisionOverview/RevisionOverviewRelationsConnectionsText'
import RevisionOverviewText from '@/components/RevisionOverview/RevisionOverviewText'
import RevisionOverviewTitle from '@/components/RevisionOverview/RevisionOverviewTitle'
import RevisionOverviewValidText from '@/components/RevisionOverview/RevisionOverviewValidText'
import RevisionOverviewWerkingsgebied from '@/components/RevisionOverview/RevisionOverviewWerkingsgebied'
import ViewFieldIngelogdExtraInfo from '@/components/ViewFieldIngelogdExtraInfo'

/**
 * Displays a beleidskeuze on the left and a beleidskeuze on the right, which the user can compare the changes.
 */

export interface RevisionOverviewChangeContainerProps {
    oldObject: any
    changesObject: any
    originalObject: any
    revisionObjects: any[]
}

const RevisionOverviewChangeContainer = ({
    oldObject,
    changesObject,
    originalObject,
    revisionObjects,
}: RevisionOverviewChangeContainerProps) => {
    const { user } = useContext(UserContext)

    return (
        <div className="min-h-screen pb-16">
            <div className="mt-8">
                <RevisionOverviewContainerMain>
                    {/* Section - Title */}
                    <RevisionOverviewContainerLeft>
                        <span className="block text-lg font-bold text-pzh-blue-dark">
                            Beleidskeuze
                        </span>
                        <RevisionOverviewTitle title={oldObject.Titel} />
                    </RevisionOverviewContainerLeft>

                    <RevisionOverviewContainerRight>
                        <span className="block text-lg font-bold text-pzh-blue-dark">
                            Beleidskeuze
                        </span>
                        <RevisionOverviewTitle title={changesObject.Titel} />
                    </RevisionOverviewContainerRight>

                    {/* Section - Display extra information if user is logged in */}
                    {user ? (
                        <div className="flex justify-between w-full mt-4">
                            <RevisionOverviewContainerLeft innerHtml={false}>
                                <ViewFieldIngelogdExtraInfo
                                    hideEdit
                                    crudObject={oldObject}
                                />
                            </RevisionOverviewContainerLeft>

                            <RevisionOverviewContainerRight innerHtml={false}>
                                <ViewFieldIngelogdExtraInfo
                                    hideEdit
                                    crudObject={changesObject}
                                />
                            </RevisionOverviewContainerRight>
                        </div>
                    ) : null}

                    {/* Section - Date */}
                    <RevisionOverviewContainerLeft>
                        <RevisionOverviewValidText
                            revisionObjects={revisionObjects}
                            object={oldObject}
                        />
                    </RevisionOverviewContainerLeft>

                    <RevisionOverviewContainerRight>
                        <RevisionOverviewValidText
                            revisionObjects={revisionObjects}
                            object={changesObject}
                        />
                    </RevisionOverviewContainerRight>

                    {/* Section - Omschrijving Keuze */}
                    <RevisionOverviewContainerLeft>
                        <RevisionOverviewText
                            textContent={oldObject.Omschrijving_Keuze}
                            label="Wat wil de provincie bereiken?"
                        />
                    </RevisionOverviewContainerLeft>

                    <RevisionOverviewContainerRight>
                        <RevisionOverviewText
                            textContent={changesObject.Omschrijving_Keuze}
                            label="Wat wil de provincie bereiken?"
                        />
                    </RevisionOverviewContainerRight>

                    {/* Section - Aanleiding */}
                    <RevisionOverviewContainerLeft>
                        <RevisionOverviewText
                            textContent={oldObject.Aanleiding}
                            label="Aanleiding"
                        />
                    </RevisionOverviewContainerLeft>

                    <RevisionOverviewContainerRight>
                        <RevisionOverviewText
                            textContent={changesObject.Aanleiding}
                            label="Aanleiding"
                        />
                    </RevisionOverviewContainerRight>

                    {/* Section - Provinciaal Belang */}
                    <RevisionOverviewContainerLeft>
                        <RevisionOverviewText
                            textContent={oldObject.Provinciaal_Belang}
                            label="Provinciaal Belang"
                        />
                    </RevisionOverviewContainerLeft>

                    <RevisionOverviewContainerRight>
                        <RevisionOverviewText
                            textContent={changesObject.Provinciaal_Belang}
                            label="Provinciaal Belang"
                        />
                    </RevisionOverviewContainerRight>

                    {/* Section - Omschrijving Toelichting */}
                    <RevisionOverviewContainerLeft>
                        <RevisionOverviewText
                            textContent={oldObject.Omschrijving_Werking}
                            label="Toelichting"
                        />
                    </RevisionOverviewContainerLeft>

                    <RevisionOverviewContainerRight>
                        <RevisionOverviewText
                            textContent={changesObject.Omschrijving_Werking}
                            label="Toelichting"
                        />
                    </RevisionOverviewContainerRight>

                    {/* Section - Nationaal Belangen */}
                    <RevisionOverviewContainerLeft>
                        <RevisionOverviewBelangen
                            placeholder="Er zijn geen nationale belangen gekoppeld"
                            label="Nationale Belangen"
                            object={oldObject}
                            type="Nationaal Belang"
                        />
                    </RevisionOverviewContainerLeft>

                    <RevisionOverviewContainerRight>
                        <RevisionOverviewBelangen
                            placeholder="Er zijn geen nationale belangen gekoppeld"
                            label="Nationale Belangen"
                            containsChanges
                            object={changesObject}
                            type="Nationaal Belang"
                        />
                    </RevisionOverviewContainerRight>

                    {/* Section - Wettelijke Taak & Bevoegdheid */}
                    <RevisionOverviewContainerLeft>
                        <RevisionOverviewBelangen
                            placeholder="Er zijn geen wettelijke taken gekoppeld"
                            label="Wettelijke Taken"
                            object={oldObject}
                            type="Wettelijke Taak & Bevoegdheid"
                        />
                    </RevisionOverviewContainerLeft>

                    <RevisionOverviewContainerRight>
                        <RevisionOverviewBelangen
                            placeholder="Er zijn geen wettelijke taken gekoppeld"
                            label="Wettelijke Taken"
                            containsChanges
                            object={changesObject}
                            type="Wettelijke Taak & Bevoegdheid"
                        />
                    </RevisionOverviewContainerRight>
                </RevisionOverviewContainerMain>
            </div>

            {/* Section - GEO */}
            <div className="mt-10">
                <RevisionOverviewDividerWithTitle
                    title={`Werkingsgebied`}
                    singleTitle
                />
                <RevisionOverviewContainerMain>
                    <RevisionOverviewWerkingsgebied
                        originalObject={originalObject}
                        changesObject={changesObject}
                    />
                </RevisionOverviewContainerMain>
            </div>

            {/* Section - Koppelingen */}
            <div className="mt-10">
                <RevisionOverviewDividerWithTitle
                    title={`Koppelingen & Relaties`}
                />
                <RevisionOverviewRelationsConnectionsText
                    originalObject={oldObject}
                    objectChanges={changesObject}
                />
            </div>
        </div>
    )
}

export default RevisionOverviewChangeContainer
