import decode from 'jwt-decode'
import { createContext, ReactNode, useEffect } from 'react'
import { useLocalStorage } from 'react-use'

import { loginAccessToken } from '@/api/fetchers'
import { GebruikerInline, Token } from '@/api/fetchers.schemas'

interface AuthContextType {
    user?: GebruikerInline
    signin: (username: string, password: string) => Promise<Token>
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
        useLocalStorage<GebruikerInline>(
            process.env.REACT_APP_KEY_IDENTIFIER || ''
        )

    const signin = async (username: string, password: string) => {
        return loginAccessToken({ username, password })
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
        console.log('test')
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
