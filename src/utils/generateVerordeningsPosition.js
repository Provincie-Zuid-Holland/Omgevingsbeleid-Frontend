const generateVerordeningsPosition = (UUIDToFind, verordeningsStructure) => {
    if (!verordeningsStructure) return []

    // Curren structure of vigerende verordeningsstructure
    const vigerendeVerordeningsStructuurChildren =
        verordeningsStructure.Structuur.Children

    // Used to push in the indexes to traverse to the UUIDToFind
    let indexPathToUUID = []

    // Used to push the current index while traversing into the right index of indexPathToUUID. We increase/decrease on every nested level change.
    let indexTraversed = 0

    // Becomes true when we've found the UUIDToFind
    let pathFound = false

    // Find and return index of 'item.UUID === UUIDToFind', else returns -1
    function findUUIDInArray(children) {
        const indexOfUUID = children.findIndex(
            (item) => item.UUID === UUIDToFind
        )
        return indexOfUUID
    }

    // Func to recursively traverse through the children and find the UUID in the properties
    function traverseChildren(children) {
        if (pathFound) return

        // Returns foundIndex() of the UUIDToFind with the objects in the children array
        const indexOfUUIDInArray = findUUIDInArray(children)

        // For each child in the array we first check if the UUID exists in the childs, else we traverse one level to the children of each child and check recrusively from there
        if (indexOfUUIDInArray !== -1) {
            indexPathToUUID[indexTraversed] = indexOfUUIDInArray
            pathFound = true
        } else {
            children.forEach((child, childIndex) => {
                // If item has no children OR pathFound equals true -> Return
                if (!child.Children || child.Children.length === 0 || pathFound)
                    return

                // Else push childIndex into indexPathToUUID,
                indexPathToUUID[indexTraversed] = childIndex

                // Increase indexTraversed because in the traverseChildren() call we traverse on level down
                indexTraversed++
                traverseChildren(child.Children)

                // It is possible that we found the Path to the UUID in the traverseChildren() call above. If that is the case we want to return
                if (pathFound) return

                // Else we are done traversing through the children, we replace the item on the current indexPathToUUID index with a null value and then decrease the indexTraversed again
                indexPathToUUID.splice(indexTraversed, 1, null)
                indexTraversed--
            })
        }
    }

    // Initialize function
    traverseChildren(vigerendeVerordeningsStructuurChildren)
    console.log('indexPathToUUID- ', indexPathToUUID)
    // Return the found array with the path to the UUID
    return indexPathToUUID
}

export default generateVerordeningsPosition
