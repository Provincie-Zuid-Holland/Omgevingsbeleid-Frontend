import ViewFieldExternalURL from '../../ViewFieldExternalURL'
import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

const ContainerViewFieldsBeleidsregel = ({
    crudObject,
}: {
    crudObject: any
}) => (
    <>
        {crudObject['Omschrijving'] ? (
            <ViewFieldTitelEnInhoud
                // fieldTitel="Omschrijving"
                fieldValue={crudObject['Omschrijving']}
            />
        ) : null}
        <ViewFieldExternalURL externalURL={crudObject['Externe_URL']} />
    </>
)

export default ContainerViewFieldsBeleidsregel
