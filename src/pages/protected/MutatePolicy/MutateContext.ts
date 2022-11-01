import { createContext } from 'react'

type MutateContextProps = {
    userHasFullMutateRights: boolean
    isVigerend: boolean
    hideAdditionalInfo: boolean
    isRequired: (field: string) => boolean
}

const MutateContext = createContext<MutateContextProps>({
    userHasFullMutateRights: false,
    isVigerend: false,
    hideAdditionalInfo: true,
    isRequired: () => false,
})

export default MutateContext
