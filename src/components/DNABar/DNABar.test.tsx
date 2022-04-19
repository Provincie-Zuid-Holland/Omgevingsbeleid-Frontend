import { render, screen } from '@testing-library/react'

import DNABar from './DNABar'

describe('DNABar', () => {
    it('should render', () => {
        render(<DNABar />)
        const element = screen.getByRole('img')
        expect(element).toBeTruthy()
    })
})
