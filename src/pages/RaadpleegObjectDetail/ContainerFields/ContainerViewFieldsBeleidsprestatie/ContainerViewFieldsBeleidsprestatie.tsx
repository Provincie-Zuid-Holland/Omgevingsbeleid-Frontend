import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

const ContainerViewFieldsBeleidsprestatie = ({
    crudObject,
}: {
    crudObject: any
}) => (
    <>
        {crudObject['Omschrijving'] ? (
            <ViewFieldTitelEnInhoud
                fieldTitel="Omschrijving"
                fieldValue={crudObject['Omschrijving']}
            />
        ) : null}
    </>
)

export default ContainerViewFieldsBeleidsprestatie
