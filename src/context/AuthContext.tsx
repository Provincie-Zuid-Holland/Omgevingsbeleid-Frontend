import { useLocalStorageValue } from '@react-hookz/web'
import { useQueryClient } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { ReactNode, createContext, useEffect } from 'react'

import { authenticationPostAuthLoginAccessToken } from '@/api/fetchers'
import { AuthToken, UserLoginDetail } from '@/api/fetchers.schemas'
import { decryptData, encryptData } from '@/utils/encryption'

export const ACCESS_TOKEN_KEY =
    import.meta.env.VITE_KEY_API_ACCESS_TOKEN ?? 'app.accessToken'
export const IDENTIFIER_KEY =
    import.meta.env.VITE_KEY_IDENTIFIER ?? 'app.identifier'

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
    user?: UserLoginDetail
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

    const {
        value: accessToken,
        set: setAccessToken,
        remove: removeAccessToken,
    } = useLocalStorageValue<string>(ACCESS_TOKEN_KEY, {
        parse: (data: string | null) => data,
        stringify: (data: string) => data,
    })
    const {
        value: identifier,
        set: setIdentifier,
        remove: removeIdentifier,
    } = useLocalStorageValue<UserLoginDetail>(IDENTIFIER_KEY, {
        parse: (data: string | null) =>
            data ? decryptData<UserLoginDetail>(data) : null,
        stringify: (data: UserLoginDetail) =>
            encryptData<UserLoginDetail>(data),
    })

    /**
     * Signin to application
     */
    const signin = async (username: string, password: string) => {
        return authenticationPostAuthLoginAccessToken({ username, password })
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
        if (accessToken === undefined) return

        if (accessToken) {
            try {
                const { exp } = jwtDecode<JWTToken>(accessToken)
                if (Number.isFinite(exp) && Date.now() >= exp * 1000) {
                    queryClient.removeQueries()
                    removeIdentifier()
                    removeAccessToken()
                }
            } catch {
                queryClient.removeQueries()
                removeIdentifier()
                removeAccessToken()
            }
        }
    }, [accessToken, queryClient, removeAccessToken, removeIdentifier])

    const value = {
        user: identifier,
        role: identifier?.Rol as Role,
        signin,
        signout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
