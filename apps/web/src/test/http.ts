import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios'

/** Erro do axios com o status HTTP dado, como a API devolveria. */
export function httpError(status: number) {
  const config = { headers: new AxiosHeaders() }
  const response = { status, data: {}, headers: {}, statusText: '', config } as AxiosResponse
  return new AxiosError('Request failed', undefined, config, undefined, response)
}
