import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

const ContainerViewFieldsAmbitie = ({ crudObject }) => {
    return (
        <>
            {crudObject['Omschrijving'] !== undefined ? (
                <ViewFieldTitelEnInhoud
                    fieldTitel="Omschrijving"
                    fieldValue={crudObject['Omschrijving']}
                />
            ) : null}
        </>
    )
}

export default ContainerViewFieldsAmbitie
