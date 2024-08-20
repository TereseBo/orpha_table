//Contains tests of page content
import { render, screen } from '@testing-library/react'

import { Home} from '@/app/page'

import '@testing-library/jest-dom'

describe('Renders page with expected content', () => {

    beforeEach(() => {
        render(<Home />);
    });

    it('renders the search', () => {
       
        const form = screen.getAllByRole('form')
        
        expect(form.length).toBe(1)
      
        expect(form[0]).toBeInTheDocument()
    })
})
