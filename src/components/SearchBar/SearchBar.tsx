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
        if (e.key === 'Enter') {
            const value = (e.target as HTMLInputElement).value

            callBack?.()
            navigate(`/zoekresultaten?query=${value}`)
        }
    }

    return (
        <div className="w-full">
            <FieldInput
                name="search"
                placeholder="Zoek binnen het beleid van de provincie Zuid-Holland"
                icon={MagnifyingGlass}
                onKeyDown={handleChange}
                {...rest}
            />
        </div>
    )
}
export default SearchBar
