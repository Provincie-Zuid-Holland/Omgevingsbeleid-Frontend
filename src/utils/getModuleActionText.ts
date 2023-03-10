const getModuleActionText = (action?: string) => {
    switch (action) {
        case 'Toevoegen':
        case 'Create':
            return 'Toevoegen'
        case 'Edit':
            return 'Wijzigen'
        case 'Terminate':
            return 'Vervallen'
        default:
            break
    }
}

export default getModuleActionText
