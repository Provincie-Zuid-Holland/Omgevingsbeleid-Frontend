import {
    render,
    waitForElementToBeRemoved,
    waitFor,
    screen,
} from '@testing-library/react'
import '@testing-library/jest-dom'

import { MemoryRouter } from 'react-router-dom'

import RaadpleegSearchResults from './RaadpleegSearchResults'

describe('RaadpleegSearchResults', () => {
    const defaultProps = {
        history: {
            length: 2,
            action: 'PUSH',
            location: {
                pathname: '/zoekresultaten',
                search: '?query=Water',
                hash: '',
                key: '8nfj8o',
            },
        },
        location: {
            pathname: '/zoekresultaten',
            search: '?query=Water',
            hash: '',
            key: '8nfj8o',
        },
        match: {
            path: '/zoekresultaten',
            url: '/zoekresultaten',
            isExact: true,
            params: {},
        },
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <RaadpleegSearchResults {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', async () => {
        setup()

        await waitForElementToBeRemoved(() => screen.queryAllByRole('img'))
        screen.getByText(`Waterveiligheid en wateroverlast`)
    })
})
