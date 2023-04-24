import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/extend-expect'
import ModuleItem from './ModuleItem'

describe('ModuleItem', () => {
    it('renders the type, status, and title', () => {
        render(
            <ModuleItem
                Object_Type="beleidskeuze"
                Object_ID={1}
                Module_ID={1}
                Title="My Policy"
                Code=""
                UUID="123"
                Modified_Date=""
                editCallback={() => {}}
                deleteCallback={() => {}}
                viewCallback={() => {}}
            />
        )

        expect(screen.getByText('beleidskeuze')).toBeInTheDocument()
        expect(screen.getByText('active')).toHaveClass('text-pzh-gray-600')
        expect(screen.getByText('My Policy')).toBeInTheDocument()
    })
})
