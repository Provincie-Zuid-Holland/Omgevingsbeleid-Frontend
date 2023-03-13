import decode from 'jwt-decode'
import { createContext, ReactNode, useEffect } from 'react'
import { useLocalStorage } from 'react-use'

import { loginAccessTokenPost } from '@/api/fetchers'
import { UserShort, AuthToken } from '@/api/fetchers.schemas'

interface AuthContextType {
    user?: UserShort
    signin: (username: string, password: string) => Promise<AuthToken>
    signout: (callback?: VoidFunction) => void
}

interface JWTToken {
    exp: number
    sub: string
}

export const AuthContext = createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken, removeAccessToken] =
        useLocalStorage<string>(
            process.env.REACT_APP_KEY_API_ACCESS_TOKEN || '',
            undefined,
            { raw: true }
        )
    const [identifier, setIdentifier, removeIdentifier] =
        useLocalStorage<UserShort>(process.env.REACT_APP_KEY_IDENTIFIER || '')

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

    const signout = (callback?: VoidFunction) => {
        removeAccessToken()
        removeIdentifier()

        callback?.()
    }

    useEffect(() => {
        if (accessToken) {
            const { exp } = decode(accessToken) as JWTToken

            if (Date.now() >= exp * 1000) {
                removeIdentifier()
            }
        } else {
            removeIdentifier()
        }
    })

    const value = { user: identifier, signin, signout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
