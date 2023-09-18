import { useQueryClient } from '@tanstack/react-query'
import decode from 'jwt-decode'
import { ReactNode, createContext, useEffect } from 'react'
import { useLocalStorage } from 'react-use'

import { loginAccessTokenPost } from '@/api/fetchers'
import { AuthToken, UserShort } from '@/api/fetchers.schemas'

export const availableRoleTypes = [
    'Ambtelijk opdrachtgever',
    'Behandelend Ambtenaar',
    'Functioneel beheerder',
    'Portefeuillehouder',
] as Role[]
export type Role =
    | 'Ambtelijk opdrachtgever'
    | 'Behandelend Ambtenaar'
    | 'Functioneel beheerder'
    | 'Beheerder'
    | 'Portefeuillehouder'
    | 'Technisch beheerder'
    | 'Superuser'
    | 'Test runner'
    | 'Tester'

interface AuthContextType {
    /** Logged in user object */
    user?: UserShort
    /** Role of logged in user */
    role?: Role
    /** Function to signin */
    signin: (username: string, password: string) => Promise<AuthToken>
    /** Function to signout */
    signout: (callback?: VoidFunction) => void
}

interface JWTToken {
    exp: number
    sub: string
}

export const AuthContext = createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient()

    const [accessToken, setAccessToken, removeAccessToken] =
        useLocalStorage<string>(
            import.meta.env.VITE_KEY_API_ACCESS_TOKEN || '',
            undefined,
            { raw: true }
        )
    const [identifier, setIdentifier, removeIdentifier] =
        useLocalStorage<UserShort>(import.meta.env.VITE_KEY_IDENTIFIER || '')

    /**
     * Signin to application
     */
    const signin = async (username: string, password: string) => {
        return loginAccessTokenPost({ username, password })
            .then(response => {
                setIdentifier(response.identifier)
                setAccessToken(response.access_token)

                return response
            })
            .catch(err => {
                removeAccessToken()
                removeIdentifier()

                throw err
            })
    }

    /**
     * Signout from application
     * Remove accessToken, identifier and query cache
     */
    const signout = (callback?: VoidFunction) => {
        removeAccessToken()
        removeIdentifier()

        queryClient.removeQueries()

        callback?.()
    }

    useEffect(() => {
        if (accessToken) {
            const { exp } = decode(accessToken) as JWTToken

            if (Date.now() >= exp * 1000) {
                /**
                 * Remove cache for queries
                 */
                queryClient.removeQueries()

                removeIdentifier()
                removeAccessToken()
            }
        } else {
            removeIdentifier()
        }
    })

    const value = {
        user: identifier,
        role: identifier?.Rol as Role,
        signin,
        signout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
