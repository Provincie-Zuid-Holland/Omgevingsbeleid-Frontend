import { Role } from '@/context/AuthContext'

export function formatRoles(roles?: Role[]) {
    if (!roles?.length) return null
    if (roles.length === 1) return roles[0]

    return `${roles.slice(0, -1).join(', ')} en ${roles[roles.length - 1]}`
}
