import { createContext } from 'react'

import { GetTokeninfo200Identifier } from './../api/fetchers.schemas'

type UserContextProps = {
    user: GetTokeninfo200Identifier
}

const UserContext = createContext<Partial<UserContextProps>>({})

export default UserContext
