import { render, screen, fireEvent } from '@testing-library/react'

import SwitchToTabbladButton from './SwitchToTabbladButton'

describe('SwitchToTabbladButton', () => {
    const toggleActiveTab = jest.fn()

    const defaultProps = {
        activeTab: 'Active test tab',
        tabName: 'test tab name',
        setActiveTab: toggleActiveTab,
        arrayLength: 0,
        showLength: false,
    }

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<SwitchToTabbladButton {...props} />)

        return { toggleActiveTab }
    }

    it('should render', () => {
        setup()
        const element = screen.getByText('Test tab name')
        expect(element).toBeTruthy()
    })

    it('should display arrayLength when showLength is set to true', () => {
        setup({ arrayLength: 1, showLength: true })
        const element = screen.getByText(1)
        expect(element).toBeTruthy()
    })

    it('User can switch active tab by clicking on a tab', async () => {
        const { toggleActiveTab } = setup()
        const element = screen.getByTestId(`SwitchToTabbladButton test li`)
        fireEvent.click(element)
        expect(toggleActiveTab).toHaveBeenCalledTimes(1)
    })
})
