import { useEffect, useState } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

const LAMBDA_URL = 'https://wglsz532tgnp7ks3klfgjdgshq0ckfwl.lambda-url.eu-central-1.on.aws/'

function getSessionId() {
  let id = localStorage.getItem('chat-session-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('chat-session-id', id)
  }
  return id
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const sessionId = getSessionId()

  // Session beim Start laden
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`${LAMBDA_URL}?sessionId=${sessionId}`, {
          method: 'GET'
        })
        const data = await res.json()
        if (data.messages?.length > 0) {
          setMessages(data.messages)
        }
      } catch (err) {
        console.error('Failed to load session:', err)
      } finally {
        setSessionLoading(false)
      }
    }
    loadSession()
  }, [])

  async function send(text: string) {
    const newMessages = [...messages, { role: 'user' as const, content: text }]
    setMessages(newMessages)
    setLoading(true)
    setError(null)

    let reply = ''
    setMessages(m => [...m, { role: 'assistant', content: '' }])

    try {
      const res = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, sessionId })
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const { text } = JSON.parse(line.slice(6))
              if (text) {
                reply += text
                setMessages(m => [...m.slice(0, -1), { role: 'assistant', content: reply }])
              }
            } catch {}
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Unbekannter Fehler')
      setMessages(m => m.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return { messages, send, loading, error, sessionLoading }
}
