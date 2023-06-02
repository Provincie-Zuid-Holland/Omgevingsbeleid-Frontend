import { render, screen, fireEvent } from '@testing-library/react'

import ModulePart from './ModulePart'

describe('ModulePart', () => {
    const props: any = {
        type: 'beleidskeuze',
        title: 'The Cat in the Hat',
        status: 'completed',
        isLast: true,
    }

    it('should render the type, title, and status', () => {
        render(<ModulePart {...props} />)

        const type = screen.getByText('Beleidskeuze')
        const title = screen.getByText('The Cat in the Hat')
        const status = screen.getByText('completed')

        expect(type).toBeInTheDocument()
        expect(title).toBeInTheDocument()
        expect(status).toBeInTheDocument()
    })

    it('should render a border at the bottom when isLast is true', () => {
        render(<ModulePart {...props} />)

        const modulePart = screen.getByRole('listitem')

        expect(modulePart).toHaveStyle('border-bottom: 1px solid #E2E8F0')
    })

    it('should render the tooltip when the trash can icon is clicked', () => {
        render(<ModulePart {...props} />)

        const trashCan = screen.getByRole('button')
        fireEvent.click(trashCan)

        const tooltip = screen.getByText(
            'Onderdeel niet (meer) meenemen in de module'
        )

        expect(tooltip).toBeInTheDocument()
    })
})
