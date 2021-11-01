/**
 * Function that checks if the current user is authenticated
 * @param {object} props
 * @param {null|object} props.object
 * @param {null|object} props.authUser
 * @returns {boolean} - Indicating if the user is authenticated
 */
const checkIfUserIsAllowedOnPage = ({ object, authUser }) => {
    const userRole = authUser.Rol
    const userUUID = authUser.UUID
    const userRolesWithAuth = [
        "Beheerder",
        "Functioneel beheerder",
        "Technisch beheerder",
        "Test runner",
        "Tester",
    ]

    if (userRolesWithAuth.includes(userRole)) {
        /** Check if user has an authenticated role that gives access to the page */
        return true
    } else if (
        /** Check if the user has created the object, or is assigned to it */
        object.Created_By?.UUID === userUUID ||
        object.Eigenaar_1?.UUID === userUUID ||
        object.Eigenaar_2?.UUID === userUUID ||
        object.Opdrachtgever?.UUID === userUUID
    ) {
        return true
    } else {
        return false
    }
}

export { checkIfUserIsAllowedOnPage }
