import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import useBreakpoint from '@/hooks/useBreakpoint'

import NavigationPopupMenu from './NavigationPopupMenu'

vi.mock('@/hooks/useBreakpoint')

const mockedUseBreakpoint = vi.mocked(useBreakpoint)

describe('NavigationPopupMenu', () => {
    const setIsOpenMock = vi.fn()
    const defaultProps = {
        showBanner: false,
        isOpen: true,
        setIsOpen: setIsOpenMock,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <NavigationPopupMenu {...props} />
            </MemoryRouter>
        )
    }

    beforeEach(() => {
        mockedUseBreakpoint.mockReturnValue({ isMobile: false, isDesktop: true })
    })

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Omgevingsvisie')
        expect(element).toBeTruthy()
    })

    it('Hides the search bar when not on mobile', () => {
        setup()
        expect(screen.queryByPlaceholderText('Zoeken')).toBeFalsy()
    })

    it('Shows the search bar on mobile', () => {
        mockedUseBreakpoint.mockReturnValue({ isMobile: true, isDesktop: false })
        setup()
        expect(screen.getByPlaceholderText('Zoeken')).toBeTruthy()
    })
})
