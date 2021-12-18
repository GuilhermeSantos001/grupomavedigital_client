import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { render } from '../testUtils'
import Home from '../../pages/index'

describe('Home page', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Home />, {})
    expect(asFragment()).toMatchSnapshot()
  })

  it('Verifica se a div principal está com as propriedades corretas', () => {
    const { getByTestId } = render(<Home />, {})

    expect(getByTestId('div-container')).toHaveClass('p-2')
    expect(getByTestId('div-container')).toHaveStyle({
      fontFamily: 'Fira Code',
    })
  })

  it('Verifica se o texto inicial está com a mensagem certa, e as propriedades corretas', () => {
    const { getByTestId } = render(<Home />, {})

    expect(getByTestId('text-start')).toHaveClass('fw-bold')
    expect(getByTestId('text-start')).toHaveTextContent('Bem-Vindo(a)')
  })

  it('Verifica se o divisor de linha primario está presente', () => {
    const { getByTestId } = render(<Home />, {})

    expect(getByTestId('separator')).toHaveClass('text-muted')
  })

  it('Verifica se o card 1 está com o layout correto', () => {
    const { getByTestId } = render(<Home />, {})

    expect(getByTestId('container-card-1')).toHaveClass('col-12 p-2')
    expect(getByTestId('card-image-1')).toHaveClass('card shadow')
    expect(getByTestId('image-1')).toHaveClass(
      'cursor-pointer',
      'card-img-top',
      'border',
      'border-primary'
    )
    expect(getByTestId('card-body-1')).toHaveClass(
      'card-body',
      'bg-primary',
      'bg-gradient',
      'text-secondary',
      'overflow-auto'
    )
    expect(getByTestId('card-body-1')).toHaveStyle({ height: '10rem' })
    expect(getByTestId('card-body-1-title')).toHaveClass('card-title')
    expect(getByTestId('card-body-1-title')).toHaveTextContent(
      'Nosso principal objetivo com essa renovação digital é integrar o que temos de mais importante, você!'
    )
    expect(getByTestId('card-text-1')).toHaveClass(
      'card-text',
      'text-white',
      'fs-6'
    )
    expect(getByTestId('card-text-1')).toHaveTextContent(
      'Queremos que nossos clientes tenham suas informações de qualquer lugar.'
    )
  })

  it('Verifica se o card 2 está com o layout correto', () => {
    const { getByTestId } = render(<Home />, {})

    expect(getByTestId('container-card-2')).toHaveClass(
      'd-flex flex-column flex-md-row'
    )

    expect(getByTestId('card-2-col-1')).toHaveClass('col-12 col-md-6 p-2')
    expect(getByTestId('card-2-1')).toHaveClass('card shadow')
    expect(getByTestId('image-2-1')).toHaveClass(
      'cursor-pointer card-img-top border border-primary'
    )
    expect(getByTestId('card-2-body-1')).toHaveClass(
      'card-body bg-primary bg-gradient text-secondary overflow-auto'
    )
    expect(getByTestId('card-2-title-1')).toHaveClass('card-title')
    expect(getByTestId('card-2-title-1')).toHaveTextContent('Use como preferir')
    expect(getByTestId('card-2-separator-1')).toHaveClass('text-white')
    expect(getByTestId('card-2-text-1')).toHaveClass(
      'card-text text-white fs-6'
    )
    expect(getByTestId('card-2-text-1')).toHaveTextContent(
      'O ambiente digital interativo foi pensado para ser flexível, você pode usar pelo computador, tablet ou smartphone.'
    )

    expect(getByTestId('card-2-col-2')).toHaveClass('col-12 col-md-6 p-2')
    expect(getByTestId('card-2-2')).toHaveClass('card shadow')
    expect(getByTestId('image-2-2')).toHaveClass(
      'cursor-pointer card-img-top border border-primary'
    )
    expect(getByTestId('card-2-body-2')).toHaveClass(
      'card-body bg-primary bg-gradient text-secondary overflow-auto'
    )
    expect(getByTestId('card-2-title-2')).toHaveClass('card-title')
    expect(getByTestId('card-2-title-2')).toHaveTextContent(
      'Capacita-se conosco'
    )
    expect(getByTestId('card-2-separator-2')).toHaveClass('text-white')
    expect(getByTestId('card-2-text-2')).toHaveClass(
      'card-text text-white fs-6'
    )
    expect(getByTestId('card-2-text-2')).toHaveTextContent(
      'Seja você um entusiasta ou um profissional do segmento, temos cursos para você aumentar suas habilidades.'
    )
  })
})
