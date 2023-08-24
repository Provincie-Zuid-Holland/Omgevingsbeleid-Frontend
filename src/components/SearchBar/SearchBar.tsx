import { FieldInput, FieldInputProps } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps extends Omit<FieldInputProps, 'name'> {
    callBack?: () => void
}

const SearchBar = ({ callBack, ...rest }: SearchBarProps) => {
    const navigate = useNavigate()

    const handleChange = (e: KeyboardEvent) => {
        const searchParams = new URLSearchParams(window.location.search)

        if (e.key === 'Enter') {
            const value = (e.target as HTMLInputElement).value

            searchParams.delete('query')
            searchParams.append('query', value)

            callBack?.()
            navigate({
                pathname: '/zoekresultaten',
                search: `?${searchParams}`,
            })
        }
    }

    return (
        <div className="w-full">
            <FieldInput
                name="query"
                placeholder="Zoek binnen het beleid van de provincie Zuid-Holland"
                icon={MagnifyingGlass}
                onKeyDown={handleChange}
                {...rest}
            />
        </div>
    )
}
export default SearchBar
