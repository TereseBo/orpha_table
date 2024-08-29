//Contains tests of page content
import '../../__testutils/matchmedia.js'
import { render, screen, act, } from '@testing-library/react'

import Home from '@/app/page'

import '@testing-library/jest-dom'

describe('Renders page with expected content', () => {

    beforeEach(() => {
        render(<Home />);
    });

    it('renders the search form', () => {

        const form = screen.getAllByRole('form')

        expect(form.length).toBe(1)
        expect(form[0]).toBeInTheDocument()
    })

    it('accepts input', () => {

        const textInput = screen.getByTestId('searchtextinput')
        const radioInputs = screen.getAllByRole('radio', {})

        const submitButton = screen.getByTestId('searchbutton')
        act(() => {
            textInput.value = "test"
            radioInputs[0].click()
            //submitButton.click()
        });
/* 
        setTimeout(() => {
            expect(screen.getByText('ORPHA code must be numbers only')).toBeInTheDocument()
        }, 2000); */

        expect(textInput.value).toBe('test')
        expect(radioInputs[0].checked).toBe(true)
    })
});

