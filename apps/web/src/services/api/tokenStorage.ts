const TOKEN_KEY = 'code-connect.accessToken'

// Os storages podem lançar exceção (aba anônima, dados do site bloqueados).
function read(storage: () => Storage): string | null {
  try {
    return storage().getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function remove(storage: () => Storage) {
  try {
    storage().removeItem(TOKEN_KEY)
  } catch {
    // sem storage disponível: nada a limpar
  }
}

export function getToken(): string | null {
  return read(() => sessionStorage) ?? read(() => localStorage)
}

/** Com `remember`, o token sobrevive ao fechar o navegador; sem ele, dura só a aba. */
export function saveToken(token: string, remember: boolean) {
  clearToken()
  try {
    ;(remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token)
  } catch {
    // sem storage disponível: a sessão não persiste
  }
}

export function clearToken() {
  remove(() => localStorage)
  remove(() => sessionStorage)
}
