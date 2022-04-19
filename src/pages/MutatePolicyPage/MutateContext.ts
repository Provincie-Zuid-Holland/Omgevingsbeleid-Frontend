import { createContext } from 'react'

type MutateContextProps = {
    userHasFullMutateRights: boolean
    isVigerend: boolean
    hideAdditionalInfo: boolean
}

const MutateContext = createContext<MutateContextProps>({
    userHasFullMutateRights: false,
    isVigerend: false,
    hideAdditionalInfo: true,
})

export default MutateContext
