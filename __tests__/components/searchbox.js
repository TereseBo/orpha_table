//Contains tests of searchbox content
import { render, screen, act } from '@testing-library/react'

import { SearchBox } from 'components/searchbox.jsx'

import '@testing-library/jest-dom'

describe('Renders form', () => {

  beforeEach(() => {
    render(<SearchBox />);
  });

  it('renders expected input', () => {

    const inputs = screen.getAllByRole('radio', {})

    expect(inputs.length).toBe(3)

  })

  it('checks radio button on click and unchecks remaining', () => {

    const radioInputs = screen.getAllByRole('radio', {})
    act(() => {
      radioInputs[0].click()
    });

    expect(radioInputs[0].checked).toBe(true)
    expect(radioInputs[1].checked).toBe(false)
    expect(radioInputs[2].checked).toBe(false)

    act(() => {
      radioInputs[1].click()
    });

    expect(radioInputs[0].checked).toBe(false)
    expect(radioInputs[1].checked).toBe(true)
    expect(radioInputs[2].checked).toBe(false)

    act(() => {
      radioInputs[0].click()
    });

    expect(radioInputs[0].checked).toBe(true)
    expect(radioInputs[1].checked).toBe(false)
    expect(radioInputs[2].checked).toBe(false)
  })
})

