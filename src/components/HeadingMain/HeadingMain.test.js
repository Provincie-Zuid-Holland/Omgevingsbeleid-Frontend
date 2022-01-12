import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import HeadingMain from './HeadingMain'

describe('HeadingMain', () => {
    const defaultProps = {
        titel: 'Titel',
        status: 'Vigerend',
        modules: [{ Titel: 'Titel1' }, { Titel: 'Titel2' }],
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<HeadingMain {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Titel')
        expect(element).toBeTruthy()
    })

    it('Component displays status badge vigerend', () => {
        setup()
        const element = screen.getByText('Vigerend')
        expect(element).toHaveClass(
            'inline-block font-bold mr-2 my-1 px-2 pt-1 text-xs border rounded text-pzh-blue border-pzh-blue'
        )
        expect(element).toBeTruthy()
    })

    it('Component displays different status badge', () => {
        setup({ status: 'Different Status' })
        const element = screen.getByText('Different Status')
        expect(element).toBeTruthy()
        expect(element).not.toHaveClass(
            'inline-block font-bold mr-2 my-1 px-2 pt-1 text-xs border rounded text-pzh-blue border-pzh-blue'
        )
    })
})
