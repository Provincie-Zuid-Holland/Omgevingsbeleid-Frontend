import { isValid } from 'date-fns'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
    RouteComponentProps,
    useHistory,
    useParams,
    withRouter,
} from 'react-router-dom'
import { toast } from 'react-toastify'

import { getVersionBeleidskeuzesObjectuuid } from '@/api/fetchers'
import axios from '@/api/instance'
import ButtonBackToPage from '@/components/ButtonBackToPage'
import allDimensies from '@/constants/dimensies'
import isEndDateBeforeStartDate from '@/utils/isEndDateBeforeStartDate'
import scrollToElement from '@/utils/scrollToElement'
import { toastNotification } from '@/utils/toastNotification'

import APIcontext from './APIContext'
import ContainerCrudFields from './ContainerCrudFields'

interface MuteerBeleidsrelatiesCRUDProps extends RouteComponentProps {
    dataModel: typeof allDimensies.BELEIDSRELATIES
}

const MuteerBeleidsrelatiesCRUD = ({
    dataModel,
}: MuteerBeleidsrelatiesCRUDProps) => {
    const history = useHistory()
    const { UUID } = useParams<{ UUID: string }>()
    const [crudObject, setCrudObject] = useState({
        Begin_Geldigheid: '',
        Eind_Geldigheid: '',
        Naar_Beleidskeuze: '',
        Omschrijving: '',
        Titel: '',
        Van_Beleidskeuze: UUID,
        Status: 'Open',
        Aanvraag_Datum: new Date(),
    })
    const [vanBeleidskeuzeTitel, SetVanBeleidskeuzeTitel] = useState('...')

    useEffect(() => {
        getVersionBeleidskeuzesObjectuuid(UUID)
            .then(data => SetVanBeleidskeuzeTitel(data.Titel || ''))
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }, [UUID])

    const handleChange = (event: any) => {
        const name = event.target.name
        const type = event.target.type

        let value = event.target.value
        if (type === 'date') {
            value = event.target.value
        }

        setCrudObject({
            ...crudObject,
            [name]: value,
        })
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()

        if (
            crudObject.Naar_Beleidskeuze === '' ||
            !crudObject.Naar_Beleidskeuze
        ) {
            toast('Selecteer een beleidskeuze')
            return
        }
        if (!isValid(new Date(crudObject.Begin_Geldigheid))) {
            toast('Vul een inwerkingtreding datum in')
            return
        }

        if (!isValid(new Date(crudObject.Eind_Geldigheid))) {
            toast('Vul een uitwerkingtreding datum in')
            return
        }

        if (isEndDateBeforeStartDate(crudObject)) {
            scrollToElement(`form-field-beleidsrelatie-eind_geldigheid`)
            toastNotification({ type: 'end date before start date' })
            return
        }

        crudObject.Begin_Geldigheid = new Date(
            crudObject.Begin_Geldigheid
        ).toString()
        crudObject.Eind_Geldigheid = new Date(
            crudObject.Eind_Geldigheid
        ).toString()

        axios
            .post(`/beleidsrelaties`, JSON.stringify(crudObject))
            .then(() => {
                history.push(`/muteer/beleidsrelaties/${UUID}`)
                toast('Opgeslagen')
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    const contextObject = {
        titleSingular: dataModel.TITLE_SINGULAR,
        titelMeervoud: dataModel.TITLE_PLURAL,
        handleSubmit,
        handleChange,
        crudObject,
        Van_Beleidskeuze_Titel: vanBeleidskeuzeTitel,
        Van_Beleidskeuze_UUID: UUID,
    }

    return (
        <div>
            <Helmet>
                <title>
                    {`Omgevingsbeleid - Voeg een nieuwe${' '}
                            ${contextObject.titleSingular}${' '}
                              toe`}
                </title>
            </Helmet>
            <div className="relative w-full px-6 py-32 bg-pzh-blue edit-header">
                <div className="container flex items-center justify-center mx-auto lg:px-10">
                    <div className="w-full pr-20">
                        <ButtonBackToPage
                            terugNaar={`beleidsrelatie`}
                            color="text-white"
                            url={`/muteer/beleidsrelaties/${UUID}`}
                        />
                        <h1 className="text-4xl text-white">
                            Voeg een nieuwe beleidsrelatie toe
                        </h1>
                    </div>
                </div>
            </div>
            <APIcontext.Provider value={contextObject}>
                <ContainerCrudFields />
            </APIcontext.Provider>
        </div>
    )
}

export default withRouter(MuteerBeleidsrelatiesCRUD)
