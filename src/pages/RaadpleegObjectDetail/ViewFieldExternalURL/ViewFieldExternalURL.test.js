import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'

import ViewFieldExternalURL from './ViewFieldExternalURL'

describe('ViewFieldExternalURL', () => {
    it('should render', () => {
        render(<ViewFieldExternalURL externalURL={'google.com'} />)
        const ExternalURLLabel = screen.getByText('Bekijk officiële publicatie')
        expect(ExternalURLLabel).toBeTruthy()
    })

    it('does not render when passed undefined', () => {
        render(<ViewFieldExternalURL externalURL={undefined} />)
        const ExternalURLLabel = screen.queryByText(
            'Bekijk officiële publicatie'
        )
        expect(ExternalURLLabel).toBeFalsy()
    })

    it('does not render when passed null', () => {
        render(<ViewFieldExternalURL externalURL={null} />)
        const ExternalURLLabel = screen.queryByText(
            'Bekijk officiële publicatie'
        )
        expect(ExternalURLLabel).toBeFalsy()
    })

    it('contains a link', () => {
        render(<ViewFieldExternalURL externalURL={'google.com'} />)
        expect(screen.getByRole('link').href).toBe('http://google.com/')
    })
})
