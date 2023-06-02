const getModuleStatusColor = (status?: string) => {
    switch (status) {
        case 'Ontwerp GS Concept':
        case 'Ontwerp GS':
        case 'Ontwerp PS Concept':
        case 'Ontwerp PS':
            return 'lightRed'
        case 'Definitief ontwerp GS':
        case 'Definitief ontwerp PS':
            return 'purple'
        case 'Vigerend':
        case 'Vastgesteld':
            return 'green'
        default:
            return 'gray'
    }
}

export default getModuleStatusColor
