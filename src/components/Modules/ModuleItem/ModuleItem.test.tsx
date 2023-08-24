import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'

import AuthProvider from '@/context/AuthContext'
import ModuleProvider from '@/context/ModuleContext'

import ModuleItem from './ModuleItem'

describe('ModuleItem', () => {
    const queryClient = new QueryClient()

    it('renders the type, status, and title', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <ModuleProvider>
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
                                ModuleObjectContext={{ Action: 'Toevoegen' }}
                            />
                        </ModuleProvider>
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        )

        expect(screen.getByText('beleidskeuze')).toBeInTheDocument()
        expect(screen.getByText('Toevoegen')).toHaveClass('text-pzh-gray-600')
        expect(screen.getByText('My Policy')).toBeInTheDocument()
    })
})
