import axios from 'axios'

const messagesByStatus: Record<number, string> = {
  400: 'Verifique os dados informados.',
  401: 'Email ou senha inválidos.',
  404: 'Conteúdo não encontrado.',
  409: 'Este email já está cadastrado.',
  422: 'Verifique os dados informados.',
}

// Mensagens da API que pedem um texto mais específico que o do status.
const messagesByApiMessage: Record<string, string> = {
  'Username already taken': 'Este nome de usuário já está em uso.',
  'Post not found': 'Post não encontrado.',
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
    const apiMessage = (error.response.data as { message?: unknown } | undefined)?.message
    if (typeof apiMessage === 'string' && messagesByApiMessage[apiMessage]) {
      return messagesByApiMessage[apiMessage]
    }
    const message = messagesByStatus[error.response.status]
    if (message) {
      return message
    }
  }
  return 'Algo deu errado. Tente novamente.'
}
