import axios from 'axios'

const messagesByStatus: Record<number, string> = {
  400: 'Verifique os dados informados.',
  401: 'Email ou senha inválidos.',
  409: 'Este email já está cadastrado.',
}

/** Status HTTP de um erro do axios, ou `undefined` para erros de rede e outros. */
export function getErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined
}

/** Traduz um erro da API para uma mensagem em pt-BR que pode ir para a tela. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor.'
    }
    const message = messagesByStatus[error.response.status]
    if (message) {
      return message
    }
  }
  return 'Algo deu errado. Tente novamente.'
}
