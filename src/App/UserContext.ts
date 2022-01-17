import { createContext } from 'react'

interface UserProps {
    UUID: string
    Gebruikersnaam: string
    Rol: string
}

type UserContextProps = {
    user: UserProps
}

const UserContext = createContext<Partial<UserContextProps>>({})

export default UserContext
