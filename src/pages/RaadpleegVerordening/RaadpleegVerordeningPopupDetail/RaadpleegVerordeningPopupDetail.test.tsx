import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import RaadpleegVerordeningPopupDetail from './RaadpleegVerordeningPopupDetail'

describe('RaadpleegVerordeningPopupDetail', () => {
    const setActiveArticleMock = jest.fn()
    const defaultProps = {
        setActiveArticle: setActiveArticleMock,
        activeArticle: {
            Children: [],
            Volgnummer: '001',
            Titel: 'Test Title',
            Inhoud: 'Test Content',
        },
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<RaadpleegVerordeningPopupDetail {...props} />)
    }

    it('Component renders', () => {
        setup()

        const title = screen.getByText('Test Title')
        expect(title).toBeTruthy()

        const subTitle = screen.getByText('Artikel 001')
        expect(subTitle).toBeTruthy()

        const Content = screen.getByText('Test Content')
        expect(Content).toBeTruthy()
    })
})
