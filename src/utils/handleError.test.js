import React from 'react'
import { render, screen } from '@testing-library/react'
import handleError from './handleError'

describe('handleError', () => {
    const setup = () => {
        render(<div>Test</div>)
    }

    const getErrorObj = (errors = []) => {
        return {
            response: {
                status: 400,
                data: {
                    errors: errors,
                },
            },
        }
    }

    it('returns undefined if there is no argument passed on the error object', () => {
        const returnVal = handleError(null)
        expect(returnVal).toBeUndefined()
    })

    it('gives the user a default error toast when there is an error', () => {
        setup()
        const errorObj = getErrorObj()
        handleError(errorObj)
        screen.findByText('Er is iets misgegaan, probeer het later nog eens')
    })

    it('gives the user an error toast when the user uploads an image that is too big', () => {
        setup()
        const errorObj = getErrorObj(['Image filesize larger than 1MB in text'])
        handleError(errorObj)
        screen.findByText('De afbeelding is te groot (Max. 1MB)')
    })

    it('gives the user an error toast when the user uploads an image that is too big in dimensions', () => {
        setup()
        const errorObj = getErrorObj(['Image width larger than 800px in text'])
        handleError(errorObj)
        screen.findByText('De afbeelding is te groot (800x600)')
    })

    it('gives the user a default error toast when the error value is unkown', () => {
        setup()
        const errorObj = getErrorObj(['Unkown error message'])
        handleError(errorObj)
        screen.findByText('Er is iets misgegaan, probeer het later nog eens')
    })
})
