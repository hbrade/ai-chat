import { useEffect, useRef, useState } from 'react'
import { useChat } from './useChat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { markdownComponents } from './MarkdownComponent.tsx'

export default function Chat() {
  const { messages, send, loading, error, sessionLoading } = useChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || loading) return
    send(input)
    setInput('')
  }

  if (sessionLoading) {
    return <div className="flex items-center justify-center h-screen text-gray-400 text-sm">Gespräch wird geladen...</div>
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col bg-white text-gray-900 px-6">
      {/* Header */}
      <div className="py-4 border-b border-gray-200 mb-4">
        <h2 className="text-xl font-semibold text-blue-900">React & AWS Assistant</h2>
        <p className="text-xs text-gray-400 mt-1">Powered by Anthropic Claude</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-4 space-y-4">
        {messages.length === 0 && <div className="text-center text-gray-400 text-sm mt-16">Stell eine Frage zu React, TypeScript oder AWS...</div>}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'user' ? (
              <div
                className="max-w-[60%] px-4 py-2.5 rounded-2xl rounded-br-sm
                bg-blue-800 text-white text-sm leading-relaxed"
              >
                {m.content}
              </div>
            ) : (
              <div className="w-full text-sm leading-relaxed text-gray-900">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {m.content || '...'}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="text-sm text-gray-400">Denkt nach...</div>
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">Fehler: {error}. Bitte nochmal versuchen.</div>}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 py-4 border-t border-gray-200">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Frage zu React, TypeScript oder AWS..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 text-sm
            outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
            disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 bg-blue-800 text-white rounded-full text-sm
            hover:bg-blue-700 transition-colors
            disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? '...' : 'Senden'}
        </button>
      </div>
    </div>
  )
}
