import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { render } from '../testUtils'
import Login from '../../pages/auth/login'

describe('Login page', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Login />, {})
    expect(asFragment()).toMatchSnapshot()
  })

  it('Verifica se a div principal está com as propriedades corretas', () => {
    const { getByTestId } = render(<Login />, {})

    expect(getByTestId('div-container')).toHaveClass('p-2')
    expect(getByTestId('div-container')).toHaveStyle({
      fontFamily: 'Fira Code',
    })
  })

  it('Verifica se o texto principal está correto', () => {
    const { getByTestId } = render(<Login />, {})

    expect(getByTestId('text-start')).toHaveClass('fw-bold')
    expect(getByTestId('div-container')).toHaveTextContent(
      'Conecte-se ao Ambiente Digital Interativo'
    )
  })

  it('Verifica se o separador da primeira linha está presente', () => {
    const { getByTestId } = render(<Login />, {})

    expect(getByTestId('separator')).toHaveClass('text-muted')
  })

  it('Verifica se o container do input login está correto', () => {
    const { getByTestId } = render(<Login />, {})

    expect(getByTestId('container-input-login')).toHaveClass('col-12 p-2')

    expect(getByTestId('input-container-username')).toHaveClass(
      'input-group mb-3'
    )
    expect(getByTestId('span-username')).toHaveClass('input-group-text')
    expect(getByTestId('span-username').id).toBe('username-addon')
    expect(getByTestId('input-username')).toHaveClass('form-control')
    expect(getByTestId('input-username')).toHaveProperty(
      'placeholder',
      'Nome de usuário'
    )
    expect(getByTestId('input-username')).toHaveProperty('type', 'text')

    expect(getByTestId('container-input-password')).toHaveClass('input-group')
    expect(getByTestId('span-password')).toHaveClass('input-group-text')
    expect(getByTestId('span-password').id).toBe('password-addon')
    expect(getByTestId('span-password-eye')).toHaveClass(
      'input-group-text animation-delay hover-color'
    )
    expect(getByTestId('span-password-eye').id).toBe('password-addon-eye')
    expect(getByTestId('input-password')).toHaveClass('form-control')
    expect(getByTestId('input-password')).toHaveProperty(
      'placeholder',
      'Senha de usuário'
    )
    expect(getByTestId('input-password')).toHaveProperty('type', 'password')
    expect(getByTestId('help-password')).toHaveTextContent(
      'Nunca mostre sua senha a ninguém e nem passe por e-mail.'
    )
  })

  it('Verifica se o container do button login está correto', () => {
    const { getByTestId } = render(<Login />, {})

    expect(getByTestId('container-button-login')).toHaveClass('d-grid gap-2')
    expect(getByTestId('button-login')).toHaveClass('btn btn-primary')
    expect(getByTestId('button-login')).toHaveProperty('type', 'button')
    expect(getByTestId('button-login')).toHaveTextContent('Entrar')
  })
})
