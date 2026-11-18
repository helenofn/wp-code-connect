import { useCallback, useEffect, useState } from 'react'

/** Mensagem temporária para o `Toast`: some sozinha depois de `duration` ms. */
export function useToast(duration = 2500) {
  const [message, setMessage] = useState<string>()

  useEffect(() => {
    if (!message) return
    const id = setTimeout(() => setMessage(undefined), duration)
    return () => clearTimeout(id)
  }, [message, duration])

  const show = useCallback((text: string) => setMessage(text), [])
  return { message, show }
}
