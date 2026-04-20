import { useState } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  async function send(text: string) {
    const newMessages = [...messages, { role: 'user' as const, content: text }]
    setMessages(newMessages)
    setLoading(true)

    // let reply = ''
    // setMessages(m => [...m, { role: 'assistant', content: '' }])

    // const res = await fetch('http://localhost:3001/api/chat', {
    const res = await fetch('https://wdsgls47l7.execute-api.eu-central-1.amazonaws.com/prod/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    })

    // const reader = res.body!.getReader()
    // const decoder = new TextDecoder()
    //
    // while (true) {
    //   const { done, value } = await reader.read()
    //   if (done) break
    //   const lines = decoder.decode(value).split('\n')
    //   for (const line of lines) {
    //     if (line.startsWith('data: ') && line !== 'data: [DONE]') {
    //       const { text } = JSON.parse(line.slice(6))
    //       reply += text
    //       setMessages(m => [...m.slice(0, -1), { role: 'assistant', content: reply }])
    //     }
    //   }
    // }
    const data = await res.json()

    setMessages(m => [...m, { role: 'assistant', content: data.text }])
    setLoading(false)
  }

  return { messages, send, loading }
}
