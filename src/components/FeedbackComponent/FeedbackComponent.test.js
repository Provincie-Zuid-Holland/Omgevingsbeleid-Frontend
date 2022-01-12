import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { MemoryRouter } from 'react-router-dom'

import FeedbackComponent, { getMailToLink } from './FeedbackComponent'

describe('FeedbackComponent', () => {
    it('should render', () => {
        render(
            <MemoryRouter>
                <FeedbackComponent />
            </MemoryRouter>
        )
        const feedbackButton = screen.getByText('Feedback')
        expect(feedbackButton).toBeTruthy()
    })

    it('mailTo function should return a "mailto:" link', () => {
        const mailto = getMailToLink()
        expect(mailto.length).toBeGreaterThan(10)
        expect(mailto.includes('mailto:')).toBeTruthy()
    })

    it('should contain a link to email', () => {
        render(
            <MemoryRouter>
                <FeedbackComponent />
            </MemoryRouter>
        )

        const mailToLink = getMailToLink()

        expect(screen.getByText('Feedback').closest('a')).toHaveAttribute(
            'href',
            mailToLink
        )
    })
})
