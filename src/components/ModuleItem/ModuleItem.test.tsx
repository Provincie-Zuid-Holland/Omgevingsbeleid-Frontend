import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/extend-expect'
import ModuleItem from './ModuleItem'

describe('ModuleItem', () => {
    it('renders the type, status, and title', () => {
        render(
            <ModuleItem type="beleidskeuze" status="active" title="My Policy" />
        )

        expect(screen.getByText('beleidskeuze')).toBeInTheDocument()
        expect(screen.getByText('active')).toHaveClass('text-pzh-gray-600')
        expect(screen.getByText('My Policy')).toBeInTheDocument()
    })
})
