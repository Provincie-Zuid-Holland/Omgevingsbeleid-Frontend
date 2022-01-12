import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

const ContainerViewFieldsBelang = ({ crudObject }) => {
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

export default ContainerViewFieldsBelang
