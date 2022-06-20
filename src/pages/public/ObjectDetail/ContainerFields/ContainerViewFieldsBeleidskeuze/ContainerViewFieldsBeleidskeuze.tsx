import { BeleidskeuzesRead } from '@/api/fetchers.schemas'
import ViewFieldIngelogdExtraInfo from '@/components/ViewFieldIngelogdExtraInfo'
import { AuthContext } from '@/context/AuthContext'

import ViewFieldBelangen from '../../ViewFieldBelangen'
import ViewFieldInnerHTML from '../../ViewFieldInnerHTML'
// import ViewFieldTags from '../../ViewFieldTags'

const ContainerViewFieldsBeleidskeuze = ({
    crudObject,
}: {
    crudObject: BeleidskeuzesRead
}) => (
    <AuthContext.Consumer>
        {context => (
            <>
                {context?.user ? (
                    <ViewFieldIngelogdExtraInfo
                        className="mb-5"
                        crudObject={crudObject}
                    />
                ) : null}
                {crudObject['Omschrijving_Keuze'] ? (
                    <ViewFieldInnerHTML
                        fieldTitel="Wat wil de provincie bereiken?"
                        html={crudObject['Omschrijving_Keuze']}
                    />
                ) : null}
                {crudObject['Afweging'] ? (
                    <ViewFieldInnerHTML
                        fieldTitel="Afweging"
                        html={crudObject['Afweging']}
                    />
                ) : null}
                {crudObject['Aanleiding'] ? (
                    <ViewFieldInnerHTML
                        fieldTitel="Aanleiding"
                        html={crudObject['Aanleiding']}
                    />
                ) : null}
                {crudObject['Provinciaal_Belang'] ? (
                    <ViewFieldInnerHTML
                        fieldTitel="Provinciaal belang"
                        html={crudObject['Provinciaal_Belang']}
                    />
                ) : null}
                {crudObject['Omschrijving_Werking'] ? (
                    <ViewFieldInnerHTML
                        fieldTitel="Toelichting"
                        html={crudObject['Omschrijving_Werking']}
                    />
                ) : null}
                {crudObject['Belangen'] && crudObject['Belangen'].length > 0 ? (
                    <ViewFieldBelangen fieldValue={crudObject['Belangen']} />
                ) : null}
                {/* crudObject['Tags'] ? (
                    <ViewFieldTags
                        fieldTitel="Tags"
                        fieldValue={crudObject['Tags']}
                    />
                ) : null */}
            </>
        )}
    </AuthContext.Consumer>
)

export default ContainerViewFieldsBeleidskeuze
