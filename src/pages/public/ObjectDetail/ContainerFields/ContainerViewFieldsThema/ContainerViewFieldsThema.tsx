import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

const ContainerViewFieldsThema = ({ crudObject }: { crudObject: any }) => (
    <>
        {crudObject['Omschrijving'] ? (
            <ViewFieldTitelEnInhoud
                fieldTitel="Omschrijving"
                fieldValue={crudObject['Omschrijving']}
            />
        ) : null}
    </>
)

export default ContainerViewFieldsThema
