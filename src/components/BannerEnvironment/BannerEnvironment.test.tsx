import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Environment } from '@/api/instance'

import BannerEnvironment, { getEnvironmentText } from './BannerEnvironment'

describe('BannerEnvironment', () => {
    const hideBannerLocalStorageMock = jest.fn()
    const defaultProps = {
        hideBannerLocalStorage: hideBannerLocalStorageMock,
        userIsInMuteerEnvironment: true,
    }

    const setup = (customProps?: { [key: string]: any }) => {
        const props = { ...defaultProps, ...customProps }
        render(<BannerEnvironment {...props} />)
    }

    const environment = process.env.REACT_APP_API_ENV as Environment
    const environmentText = getEnvironmentText(environment)

    it('Component renders', () => {
        setup()
        const element = screen.getByText(environmentText)
        expect(element).toBeTruthy()
    })
})
