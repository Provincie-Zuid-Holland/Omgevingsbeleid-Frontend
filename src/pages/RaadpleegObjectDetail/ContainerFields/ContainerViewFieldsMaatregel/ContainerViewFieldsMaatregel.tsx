import UserContext from '@/App/UserContext'
import ViewFieldIngelogdExtraInfo from '@/components/ViewFieldIngelogdExtraInfo'

import ViewFieldInnerHTML from '../../ViewFieldInnerHTML'

const ContainerViewFieldsMaatregel = ({ crudObject }: { crudObject: any }) => (
    <UserContext.Consumer>
        {context => (
            <>
                {context?.user ? (
                    <ViewFieldIngelogdExtraInfo
                        className="mb-5"
                        crudObject={crudObject}
                    />
                ) : null}
                {crudObject['Toelichting'] ? (
                    <ViewFieldInnerHTML html={crudObject['Toelichting']} />
                ) : null}
            </>
        )}
    </UserContext.Consumer>
)

export default ContainerViewFieldsMaatregel
