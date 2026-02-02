import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { beleidskeuze } from '@/config/objects'
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
                                Module_ID={1}
                                ModuleObjectContext={{ Action: 'Toevoegen' }}
                                Model={{
                                    Title: 'My Policy',
                                }}
                                ObjectStatics={{}}
                                model={beleidskeuze}
                            />
                        </ModuleProvider>
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        )

        expect(screen.getByText('Beleidskeuze')).toBeInTheDocument()
        expect(screen.getByText('Toevoegen')).toHaveClass('text-pzh-gray-600')
        expect(screen.getByText('My Policy')).toBeInTheDocument()
    })
})
