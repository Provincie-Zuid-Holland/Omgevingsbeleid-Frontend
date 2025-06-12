import { FieldInputProps, FormikInput } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { Form, Formik } from 'formik'
import { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { SCHEMA } from '@/validation/searchBar'

interface SearchBarProps extends Omit<FieldInputProps, 'name'> {
    callBack?: () => void
}

interface FormProps {
    query: string
}

const SearchBar = ({ callBack, ...rest }: SearchBarProps) => {
    const navigate = useNavigate()

    const handleChange = (e: KeyboardEvent) => {
        const value = (e.target as HTMLInputElement).value.trim()

        if (e.key === 'Enter' && value.length >= 3) {
            const searchParams = new URLSearchParams(window.location.search)

            searchParams.delete('query')
            searchParams.append('query', value)

            callBack?.()
            navigate({
                pathname: '/zoekresultaten',
                search: `?${searchParams}`,
            })
        }
    }

    const handleSubmit = ({ query }: FormProps) => {
        const searchParams = new URLSearchParams(window.location.search)

        searchParams.delete('query')
        searchParams.append('query', query)

        callBack?.()
        navigate({
            pathname: '/zoekresultaten',
            search: `?${searchParams}`,
        })
    }

    return (
        <div className="w-full">
            <Formik
                initialValues={{ query: '' }}
                onSubmit={handleSubmit}
                validationSchema={toFormikValidationSchema(SCHEMA)}>
                <Form>
                    <FormikInput
                        name="query"
                        placeholder="Zoek binnen het beleid van de provincie Zuid-Holland"
                        icon={MagnifyingGlass}
                        onKeyDown={handleChange}
                        {...rest}
                    />
                </Form>
            </Formik>
        </div>
    )
}
export default SearchBar
