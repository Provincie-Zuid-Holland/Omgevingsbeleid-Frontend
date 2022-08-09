import { AngleRight } from '@pzh-ui/icons'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const ViewFieldBelangen = ({ fieldValue }: { fieldValue: any[] }) => {
    const [nationaleBelangen, setNationaleBelangen] = useState<any[]>([])
    const [wettelijkeTaken, setWettelijkeTaken] = useState<any[]>([])
    const [dataLoaded, setDataLoaded] = useState(false)

    useEffect(() => {
        setNationaleBelangen(
            fieldValue.filter(item => item.Object.Type === 'Nationaal Belang')
        )
        setWettelijkeTaken(
            fieldValue.filter(
                item => item.Object.Type === 'Wettelijke Taak & Bevoegdheid'
            )
        )
        setDataLoaded(true)
    }, [fieldValue])

    return dataLoaded ? (
        <div>
            {nationaleBelangen && nationaleBelangen.length > 0 ? (
                <div className="mb-6">
                    <h2 className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue">
                        Nationaal belang
                    </h2>
                    <ul className="mt-1">
                        {nationaleBelangen.map(item => (
                            <BelangenListItem
                                key={item?.Object?.UUID}
                                item={item.Object}
                            />
                        ))}
                    </ul>
                </div>
            ) : null}
            {wettelijkeTaken && wettelijkeTaken.length > 0 ? (
                <div className="mb-6">
                    <h2 className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue">
                        Wettelijke taak en bevoegdheid
                    </h2>
                    <ul className="mt-1">
                        {wettelijkeTaken.map(item => (
                            <BelangenListItem
                                key={item?.Object?.UUID}
                                item={item.Object}
                            />
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    ) : null
}

const BelangenListItem = ({ item }: { item: any }) => (
    <li
        className="w-full leading-6 text-gray-800 break-words whitespace-pre-line group"
        key={item.UUID}>
        <Link className="relative cursor-pointer" to={`/belangen/${item.UUID}`}>
            <AngleRight className="inline-block -mt-1" />
            <span className="inline-block pl-2 ml-0 group-hover:underline">
                {item.Titel}
            </span>
        </Link>
    </li>
)

export default ViewFieldBelangen
