import { useContext } from 'react'

import { ModuleContext } from '@/context/ModuleContext'

const useModule = () => {
    return useContext(ModuleContext)
}

export default useModule
