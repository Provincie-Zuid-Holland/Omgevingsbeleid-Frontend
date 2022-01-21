import { Link } from 'react-router-dom'

import formatDate from '../../../utils/formatDate'

function RevisieListItem({ item, currentUUID }) {
    if (!item) return null

    const getDate = item => {
        const standardDates = ['1753-01-01T00:00:00Z', '10000-01-01T00:00:00Z']
        const startDate = item['Begin_Geldigheid']
        return !startDate || standardDates.includes(startDate)
            ? 'Er is nog geen begin geldigheid'
            : formatDate(new Date(item['Begin_Geldigheid']), 'd MMM yyyy')
    }

    const date = getDate(item)
    const status = item.uiStatus
    const isActive = item.UUID === currentUUID

    return (
        <li
            className={`bg-white ${
                isActive ? '' : 'hover:bg-pzh-blue hover:bg-opacity-5'
            }`}>
            <Link
                className={`inline-block py-3 ${
                    isActive ? 'cursor-default' : ''
                }`}
                to={`/detail/beleidskeuzes/${item.UUID}`}
                onClick={e => {
                    if (isActive) {
                        e.preventDefault()
                        return
                    }
                }}>
                <span
                    className={`inline-block w-2 h-2 rounded-full mt-2 -ml-1 absolute ${
                        status === 'Ter inzage'
                            ? 'bg-red-700'
                            : status === 'Vigerend'
                            ? 'bg-yellow-500 pulsate'
                            : status === 'Gearchiveerd'
                            ? 'bg-blue-900'
                            : ''
                    }`}
                />
                <span
                    className={`pl-6 inline-block text-sm ${
                        isActive ? 'font-bold' : ''
                    }`}>{`${status} (${date})`}</span>
            </Link>
        </li>
    )
}

export default RevisieListItem
