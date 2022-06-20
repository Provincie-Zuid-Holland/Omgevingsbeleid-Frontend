import { ChangeEventHandler, createContext, FormEventHandler } from 'react'

type APIContextProps = {
    objectUUID: string
    titleSingular: string
    titelMeervoud: string
    overzichtSlug: string
    objectID: string
    handleSubmit: FormEventHandler<HTMLFormElement>
    handleChange: ChangeEventHandler
    crudObject: any
    Van_Beleidskeuze_Titel: string
    Van_Beleidskeuze_UUID: string
}

const APIContext = createContext<Partial<APIContextProps>>({})

export default APIContext
