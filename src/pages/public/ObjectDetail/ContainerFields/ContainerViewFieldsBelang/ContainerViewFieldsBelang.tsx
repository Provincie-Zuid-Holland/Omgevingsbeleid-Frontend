import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

const ContainerViewFieldsBelang = ({ crudObject }: { crudObject: any }) => (
    <>
        {crudObject['Omschrijving'] ? (
            <ViewFieldTitelEnInhoud
                // fieldTitel="Omschrijving"
                fieldValue={crudObject['Omschrijving']}
            />
        ) : null}
    </>
)

export default ContainerViewFieldsBelang
