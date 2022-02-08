import { render } from '@testing-library/react'

import LeafletRevisionOverview from './LeafletRevisionOverview'

describe('LeafletRevisionOverview', () => {
    const defaultProps = {
        gebiedenUUIDS: [
            {
                UUID: 'cd9fbf25-eaa6-0584-5f66-090fbbed6c10',
            },
            { UUID: 'cd9fbf25-eaa6-0584-5f66-090fbbed6d11' },
        ],
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<LeafletRevisionOverview {...props} />)
    }

    it('should render', () => {
        setup()
    })
})
