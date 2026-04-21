import { useState } from 'react'
import { useChat } from './useChat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Chat() {
  const { messages, send, loading, error, sessionLoading } = useChat()
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim() || loading) return
    send(input)
    setInput('')
  }

  if (sessionLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#888',
          fontSize: 14
        }}
      >
        Gespräch wird geladen...
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: '0 auto',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif',
        padding: '0 16px',
        background: 'white',
        color: '#1a1a1a',
        textAlign: 'left'
      }}
    >
      <div
        style={{
          padding: '16px 0',
          borderBottom: '1px solid #eee',
          marginBottom: 16
        }}
      >
        <h2 style={{ margin: 0, color: '#1B4F8A' }}>React & AWS Assistant</h2>
        <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>Powered by Anthropic Claude</p>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 16
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: '#aaa',
              marginTop: 60,
              fontSize: 14
            }}
          >
            Stell eine Frage zu React, TypeScript oder AWS...
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 12
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                background: m.role === 'user' ? '#1B4F8A' : '#f0f4f8',
                color: m.role === 'user' ? '#fff' : '#1a1a1a',
                padding: '10px 14px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                fontSize: 14,
                lineHeight: 1.6
              }}
            >
              {m.role === 'user' ? (
                m.content
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 style={{ fontSize: 18, color: '#1a1a1a', margin: '8px 0' }}>{children}</h1>,
                    h2: ({ children }) => <h2 style={{ fontSize: 16, color: '#1a1a1a', margin: '6px 0' }}>{children}</h2>,
                    h3: ({ children }) => <h3 style={{ fontSize: 15, color: '#1a1a1a', margin: '4px 0' }}>{children}</h3>,
                    p: ({ children }) => <p style={{ margin: '4px 0', color: '#1a1a1a' }}>{children}</p>,
                    li: ({ children }) => <li style={{ color: '#1a1a1a' }}>{children}</li>
                  }}
                >
                  {m.content || '...'}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
            <div
              style={{
                background: '#f0f4f8',
                padding: '10px 14px',
                borderRadius: '18px 18px 18px 4px',
                fontSize: 14,
                color: '#888'
              }}
            >
              Denkt nach...
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              background: '#fff0f0',
              border: '1px solid #ffcccc',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#cc0000',
              marginBottom: 12
            }}
          >
            Fehler: {error}. Bitte nochmal versuchen.
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '16px 0',
          borderTop: '1px solid #eee'
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Frage zu React, TypeScript oder AWS..."
          disabled={loading}
          style={{
            flex: 1,
            color: 'black',
            padding: '10px 14px',
            borderRadius: 24,
            border: '1px solid #ddd',
            fontSize: 14,
            outline: 'none',
            background: loading ? '#f9f9f9' : '#fff'
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 20px',
            background: loading || !input.trim() ? '#ccc' : '#1B4F8A',
            color: 'white',
            border: 'none',
            borderRadius: 24,
            fontSize: 14,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '...' : 'Senden'}
        </button>
      </div>
    </div>
  )
}
