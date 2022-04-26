import { createContext, ReactNode, useState } from 'react'
import { useLocalStorage, useUpdateEffect } from 'react-use'

import { postLogin, useGetTokeninfo } from '@/api/fetchers'
import { GetTokeninfo200Identifier } from '@/api/fetchers.schemas'

interface AuthContextType {
    user?: GetTokeninfo200Identifier
    signin: (email: string, password: string) => Promise<void>
    signout: (callback?: VoidFunction) => void
}

export const AuthContext = createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: ReactNode }) {
    const [, setAccessToken, removeAccessToken] = useLocalStorage(
        process.env.REACT_APP_KEY_API_ACCESS_TOKEN || '',
        undefined,
        { raw: true }
    )
    const [identifier, setIdentifier, removeIdentifier] = useLocalStorage<
        GetTokeninfo200Identifier | undefined
    >(process.env.REACT_APP_KEY_IDENTIFIER || '')

    const [user, setUser] = useState<GetTokeninfo200Identifier | undefined>(
        identifier
    )

    const signin = async (email: string, password: string) => {
        return postLogin({ identifier: email, password })
            .then((response: any) => {
                setUser(response.identifier)
                setIdentifier(response.identifier)
                setAccessToken(response.access_token)

                return response
            })
            .catch(err => {
                setUser(undefined)

                throw err
            })
    }

    const signout = (callback?: VoidFunction) => {
        removeAccessToken()
        removeIdentifier()

        setUser(undefined)

        callback?.()
    }

    const { data, isLoading } = useGetTokeninfo()

    useUpdateEffect(() => {
        if (data?.identifier) {
            setUser(data.identifier)
        } else {
            setUser(undefined)
        }
    }, [isLoading])

    const value = { user, signin, signout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
