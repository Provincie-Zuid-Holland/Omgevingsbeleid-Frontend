import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

const ContainerViewFieldsAmbitie = ({ crudObject }: { crudObject: any }) => (
    <>
        {crudObject['Omschrijving'] ? (
            <ViewFieldTitelEnInhoud
                fieldTitel="Omschrijving"
                fieldValue={crudObject['Omschrijving']}
            />
        ) : null}
    </>
)

export default ContainerViewFieldsAmbitie
