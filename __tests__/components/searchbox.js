//Contains tests of searchbox content
import { render, screen } from '@testing-library/react'

import { SearchBox} from 'components/searchbox.jsx'

import '@testing-library/jest-dom'

describe('Renders form', () => {

    it('renders expected input', () => {
        render(<SearchBox/>)
    
        const inputs= screen.getAllByRole('radio', {})
        expect(inputs.length).toBe(3)

    })
})

