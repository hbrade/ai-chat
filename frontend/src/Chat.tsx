import { useState } from 'react';
import { useChat } from './useChat';

export default function Chat() {
    const { messages, send, loading } = useChat();
    const [input, setInput] = useState('');

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h2>AI Assistant</h2>
            <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, minHeight: 300, marginBottom: 16 }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ marginBottom: 12, textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <span style={{
                background: m.role === 'user' ? '#1B4F8A' : '#f0f0f0',
                color: m.role === 'user' ? '#fff' : '#000',
                padding: '8px 12px', borderRadius: 12, display: 'inline-block'
            }}>
              {m.content || '...'}
            </span>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !loading && (send(input), setInput(''))}
                    placeholder="Nachricht eingeben..."
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }}
                />
                <button
                    onClick={() => { send(input); setInput(''); }}
                    disabled={loading || !input}
                    style={{ padding: '8px 16px', background: '#1B4F8A', color: '#fff', border: 'none', borderRadius: 8 }}
                >
                    Senden
                </button>
            </div>
        </div>
    );
}