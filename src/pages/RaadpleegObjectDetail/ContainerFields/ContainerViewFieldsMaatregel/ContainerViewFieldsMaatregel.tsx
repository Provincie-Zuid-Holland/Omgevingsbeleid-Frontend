import ViewFieldIngelogdExtraInfo from '@/components/ViewFieldIngelogdExtraInfo'
import { AuthContext } from '@/context/AuthContext'

import ViewFieldInnerHTML from '../../ViewFieldInnerHTML'

const ContainerViewFieldsMaatregel = ({ crudObject }: { crudObject: any }) => (
    <AuthContext.Consumer>
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
    </AuthContext.Consumer>
)

export default ContainerViewFieldsMaatregel
