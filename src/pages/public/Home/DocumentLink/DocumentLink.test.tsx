import { render, screen } from '@testing-library/react'

import DocumentLink from './DocumentLink'

describe('DocumentLink', () => {
    const defaultProps = {
        href: '/href',
        title: 'Document title',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<DocumentLink {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Document title')
        expect(element).toBeTruthy()
    })
})
