import { AxiosError } from 'axios'
import { httpError } from '../../test/http'
import { getErrorMessage, getErrorStatus } from './errors'

describe('getErrorMessage', () => {
  it.each([
    [400, 'Verifique os dados informados.'],
    [401, 'Email ou senha inválidos.'],
    [409, 'Este email já está cadastrado.'],
    [500, 'Algo deu errado. Tente novamente.'],
  ])('maps status %i', (status, message) => {
    expect(getErrorMessage(httpError(status))).toBe(message)
    expect(getErrorStatus(httpError(status))).toBe(status)
  })

  it('reports network errors', () => {
    expect(getErrorMessage(new AxiosError('Network Error'))).toBe(
      'Não foi possível conectar ao servidor.',
    )
  })

  it('falls back for unknown errors', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('Algo deu errado. Tente novamente.')
    expect(getErrorStatus(new Error('boom'))).toBeUndefined()
  })
})
