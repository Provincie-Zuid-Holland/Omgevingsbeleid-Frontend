import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import SwitchToTabbladButton from './SwitchToTabbladButton'

describe('SwitchToTabbladButton', () => {
    const toggleActiveTab = jest.fn()

    const defaultProps = {
        activeTab: '',
        tabName: 'Test tab',
        setActiveTab: toggleActiveTab,
        showLength: false,
        arraylength: '',
    }

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<SwitchToTabbladButton {...props} />)
    }

    it('Component should render', () => {
        setup()
        const element = screen.getByText(defaultProps.tabName)
        expect(element).toBeTruthy
    })

    it('Should display a border around the active tab', () => {
        setup({ activeTab: defaultProps.tabName })
        const tab = screen.getByRole('listitem')
        expect(tab).toHaveClass(
            'py-1 px-5 text-lg text-pzh-blue relative inline-block font-bold border-pzh-blue border-b-2'
        )
    })

    it('Should display arrayLength value when showLength is true', () => {
        setup({ showLength: true, arrayLength: 3 })
        const element = screen.getByText(3)
        expect(element).toBeTruthy
    })

    it('User should be able to change active tabs by clicking on an inactive tab', () => {
        setup()
        const tab = screen.getByText(defaultProps.tabName)
        fireEvent.click(tab)
        expect(toggleActiveTab).toBeCalledTimes(1)
    })

    it('setActiveTab function should not be called, when user clicks on an active tab', () => {
        setup({ activeTab: defaultProps.tabName })
        const tab = screen.getByText(defaultProps.tabName)
        fireEvent.click(tab)
        expect(toggleActiveTab).toBeCalledTimes(0)
    })
})
