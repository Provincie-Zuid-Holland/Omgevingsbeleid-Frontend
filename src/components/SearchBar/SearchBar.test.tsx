import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SearchBar from './SearchBar'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = (await vi.importActual('react-router-dom')) as any
    return {
        ...actual,
        useLocation: () => ({ pathname: '/', search: '' }),
        useNavigate: () => mockNavigate,
    }
})

describe('SearchBar', () => {
    beforeEach(() => {
        mockNavigate.mockClear()
    })

    const setup = (customProps?: any) => {
        const utils = render(
            <BrowserRouter>
                <SearchBar {...customProps} />
            </BrowserRouter>
        )
        const input = screen.getByPlaceholderText(
            'Zoek binnen het beleid van de provincie Zuid-Holland'
        ) as HTMLInputElement
        const form = utils.container.querySelector('form') as HTMLFormElement
        if (!form) throw new Error('Form not found')
        return { input, form }
    }

    it('Component renders', () => {
        const { input } = setup()
        expect(input).toBeTruthy()
    })

    it('User can search', async () => {
        const { input, form } = setup()

        const searchQuery = 'Test'
        fireEvent.change(input, { target: { value: searchQuery } })
        expect(input.value).toBe(searchQuery)

        fireEvent.submit(form)

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith({
                pathname: '/zoekresultaten',
                search: `?query=${searchQuery}`,
            })
        )
    })

    it('Includes filter when provided', async () => {
        const { input, form } = setup({ filter: 'beleid' })

        const searchQuery = 'Klimaat'
        fireEvent.change(input, { target: { value: searchQuery } })
        fireEvent.submit(form)

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith({
                pathname: '/zoekresultaten',
                search: `?query=${searchQuery}&filter=beleid`,
            })
        )
    })
})
