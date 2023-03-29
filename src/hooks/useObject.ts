import { useContext } from 'react'

import { ObjectContext } from '@/context/ObjectContext'

const useObject = () => {
    return useContext(ObjectContext)
}

export default useObject
