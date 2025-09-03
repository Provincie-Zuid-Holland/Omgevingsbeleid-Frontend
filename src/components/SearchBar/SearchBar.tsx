import { Button, cn, FieldInputProps, FormikInput } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { SCHEMA } from '@/validation/searchBar'

interface SearchBarProps extends Omit<FieldInputProps, 'name'> {
    handleSubmit?: (values: FormProps) => void
    callBack?: () => void
    placeholder?: string
    filter?: string
    className?: string
}

interface FormProps {
    query: string
}

const SearchBar = ({
    callBack,
    handleSubmit: customSubmit,
    placeholder = 'Zoek binnen het beleid van de provincie Zuid-Holland',
    filter,
    className,
    ...rest
}: SearchBarProps) => {
    const navigate = useNavigate()

    const handleSubmit = ({ query }: FormProps) => {
        const searchParams = new URLSearchParams(window.location.search)

        searchParams.delete('query')
        searchParams.append('query', query)

        if (filter) {
            searchParams.delete('filter')
            searchParams.append('filter', filter)
        }

        searchParams.delete('page')

        callBack?.()
        navigate({
            pathname: '/zoekresultaten',
            search: `?${searchParams}`,
        })
    }

    return (
        <div className={cn('w-full', className)}>
            <Formik
                initialValues={{ query: '' }}
                onSubmit={customSubmit || handleSubmit}
                validationSchema={toFormikValidationSchema(SCHEMA)}
                validateOnBlur={false}
                validateOnChange={false}>
                <Form>
                    <FormikInput
                        name="query"
                        placeholder={placeholder}
                        inlineButton={
                            <Button
                                type="submit"
                                className="absolute top-1 right-1 flex h-10 w-10 items-center justify-center p-0"
                                icon={MagnifyingGlass}
                                iconSize={18}
                            />
                        }
                        {...rest}
                    />
                </Form>
            </Formik>
        </div>
    )
}
export default SearchBar
