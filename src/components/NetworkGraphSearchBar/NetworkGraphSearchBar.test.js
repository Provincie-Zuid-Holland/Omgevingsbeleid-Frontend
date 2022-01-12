import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { cloneElement, useState } from 'react'

import NetworkGraphSearchBar from './NetworkGraphSearchBar'

const ParentWrapper = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div>
            {cloneElement(children, {
                searchQuery: searchQuery,
                setSearchQuery: setSearchQuery,
            })}
        </div>
    )
}

describe('NetworkGraphSearchBar', () => {
    const handleNodeClickMock = jest.fn()

    const defaultProps = {
        data: {
            links: [
                {
                    source: 'A9DFDD2A-F092-4AA0-B8A5-93B52A1CCFAE',
                    target: '727248D0-5DD4-44A9-87DE-67BF52856174',
                    type: 'Koppeling',
                },
                {
                    source: 'A9DFDD2A-F092-4AA0-B8A5-93B52A1CCFAE',
                    target: 'FF3172F6-8689-449D-A6AF-2EB53F6893B1',
                    type: 'Relatie',
                },
            ],
            nodes: [
                {
                    Titel: 'Adequaat aanbod openbaar vervoer (In Inspraak Test)',
                    Type: 'beleidskeuzes',
                    UUID: '68CFDBC1-249D-47B7-8EC4-2BEB1E358324',
                    color: '#EFCC36',
                    colorLight: '#faf0c3',
                    id: '68CFDBC1-249D-47B7-8EC4-2BEB1E358324',
                },
                {
                    Titel: 'Legesverordening omgevingsrecht provincie Zuid-Holland 2013',
                    Type: 'verordeningen',
                    UUID: 'ECB012D9-B670-40F8-B086-F206E3C06327',
                    color: '#281F6B',
                    colorLight: '#bfbcd3',
                    id: 'ECB012D9-B670-40F8-B086-F206E3C06327',
                },
            ],
        },
        filters: {
            beleidskeuzes: true,
            ambities: true,
            belangen: true,
            beleidsdoelen: true,
            beleidsprestaties: true,
            beleidsregels: true,
            maatregelen: true,
            verordeningen: true,
        },
        clickedNode: null,
        svgElement: null,
        handleNodeClick: handleNodeClickMock,
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(
            <ParentWrapper>
                <NetworkGraphSearchBar {...props} />
            </ParentWrapper>
        )
    }

    it('Component renders', () => {
        setup()
        const inputEl = screen.getByPlaceholderText('Zoek op beleid')
        expect(inputEl).toBeTruthy()
    })

    it('User can use the search bar', () => {
        setup()

        // Search for a beleidskeuze
        const inputEl = screen.getByPlaceholderText('Zoek op beleid')
        fireEvent.change(inputEl, { target: { value: 'Adequaat' } })
        expect(inputEl).toHaveValue('Adequaat')

        const beleidskeuzeTitle = screen.getByText(
            'Adequaat aanbod openbaar vervoer (In Inspraak Test)'
        )
        expect(beleidskeuzeTitle).toBeInTheDocument()

        const beleidskeuzeType = screen.getByText('Beleidskeuze')
        expect(beleidskeuzeType).toBeInTheDocument()

        // Search for a verordening
        fireEvent.change(inputEl, { target: { value: 'Legesverordening' } })
        expect(inputEl).toHaveValue('Legesverordening')

        const verordeningTitle = screen.getByText(
            'Legesverordening omgevingsrecht provincie Zuid-Holland 2013'
        )
        expect(verordeningTitle).toBeInTheDocument()

        const verordeningType = screen.getByText('Verordening')
        expect(verordeningType).toBeInTheDocument()

        // Check if we can click on the search result items
        fireEvent.click(verordeningTitle)
        expect(handleNodeClickMock).toHaveBeenCalledTimes(1)
    })
})
