//Contains tests of page content
import { render, screen } from '@testing-library/react'

import { Home} from '@/app/page'

import '@testing-library/jest-dom'

describe('Renders form', () => {


    it('renders the form', () => {
        render(<Home />)

        const form = screen.getAllByRole('form')
        expect(form.length).toBe(1)
        expect(form[0]).toBeInTheDocument()
    })

    it('renders expected input', () => {
        render(<Home/>)

        const inputs= screen.getAllByRole('radio', {})
        expect(inputs.length).toBe(3)

    })
})
