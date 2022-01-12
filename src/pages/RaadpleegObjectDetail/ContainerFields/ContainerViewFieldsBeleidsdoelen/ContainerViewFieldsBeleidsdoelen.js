import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

const ContainerViewFieldsBeleidsdoelen = ({ crudObject }) =>
    crudObject['Omschrijving'] !== undefined ? (
        <ViewFieldTitelEnInhoud
            fieldTitel="Omschrijving"
            fieldValue={crudObject['Omschrijving']}
        />
    ) : null

export default ContainerViewFieldsBeleidsdoelen
