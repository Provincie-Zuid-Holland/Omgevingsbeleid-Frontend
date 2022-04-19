import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

const ContainerViewFieldsBeleidsdoelen = ({
    crudObject,
}: {
    crudObject: any
}) =>
    crudObject['Omschrijving'] ? (
        <ViewFieldTitelEnInhoud
            fieldTitel="Omschrijving"
            fieldValue={crudObject['Omschrijving']}
        />
    ) : null

export default ContainerViewFieldsBeleidsdoelen
