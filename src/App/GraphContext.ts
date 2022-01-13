import { createContext } from 'react'

type GraphContextProps = {
    graphIsOpen: boolean
    setGraphIsOpen: (e: boolean) => void
}

const GraphContext = createContext<Partial<GraphContextProps>>({})

export default GraphContext
