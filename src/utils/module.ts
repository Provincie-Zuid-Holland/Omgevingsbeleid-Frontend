import { ModuleStatusCode } from '@/api/fetchers.schemas'

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

export const getModulesStatusIndexLabel = (
    status?: keyof typeof ModuleStatusCode
) => {
    switch (status) {
        case 'Ontwerp_GS_Concept':
            return `1. ${ModuleStatusCode['Ontwerp_GS_Concept']}`
        case 'Ontwerp_GS':
            return `2. ${ModuleStatusCode['Ontwerp_GS']}`
        case 'Ontwerp_PS':
            return `3. ${ModuleStatusCode['Ontwerp_PS']}`
        case 'Definitief_ontwerp_GS':
            return `6. ${ModuleStatusCode['Definitief_ontwerp_GS']}`
        case 'Definitief_ontwerp_PS':
            return `7. ${ModuleStatusCode['Definitief_ontwerp_PS']}`
        case 'Vastgesteld':
            return `8. ${ModuleStatusCode['Vastgesteld']}`
    }
}
