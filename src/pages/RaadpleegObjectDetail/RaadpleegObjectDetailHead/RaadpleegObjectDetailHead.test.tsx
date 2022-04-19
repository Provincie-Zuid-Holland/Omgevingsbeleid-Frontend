import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import RaadpleegObjectDetailHead from './RaadpleegObjectDetailHead'

describe('RaadpleegObjectDetailHead', () => {
    const defaultProps = {
        dataObject: {
            Titel: 'Test Titel',
        },
        titleSingular: 'Singular',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<RaadpleegObjectDetailHead {...props} />)
    }

    it('Component renders', async () => {
        setup()
        await waitFor(() =>
            expect(document.title).toEqual(
                `${defaultProps.dataObject.Titel} (${defaultProps.titleSingular}) - Omgevingsbeleid Provincie Zuid-Holland`
            )
        )
    })
})
