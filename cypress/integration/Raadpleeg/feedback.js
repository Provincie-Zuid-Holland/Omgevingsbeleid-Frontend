import { getMailToLink } from './../../../src/components/FeedbackComponent'

describe('Feedback', () => {
    const mailToLink = getMailToLink()
    it(`User can click on a feedback button that will open their email client`, () => {
        cy.contains('Feedback').should('have.attr', 'href', mailToLink)
    })
})
