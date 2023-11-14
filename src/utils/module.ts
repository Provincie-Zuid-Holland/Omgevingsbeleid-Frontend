export const getModuleStatusColor = (status?: string) => {
    switch (status) {
        case 'Ontwerp GS Concept':
        case 'Ontwerp GS':
        case 'Ontwerp PS':
        case 'Ter Inzage':
            return 'lightRed'
        case 'Definitief ontwerp GS Concept':
        case 'Definitief ontwerp GS':
        case 'Definitief ontwerp PS':
            return 'purple'
        case 'Vigerend':
        case 'Vastgesteld':
        case 'Module afgerond':
            return 'green'
        default:
            return 'gray'
    }
}
