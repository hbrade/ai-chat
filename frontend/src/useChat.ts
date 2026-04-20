import { useState } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send(text: string) {
    const newMessages = [...messages, { role: 'user' as const, content: text }]
    setMessages(newMessages)
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('https://wdsgls47l7.execute-api.eu-central-1.amazonaws.com/prod/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.text }])
    } catch (err: any) {
      setError(err.message || 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  return { messages, send, loading, error }
}
