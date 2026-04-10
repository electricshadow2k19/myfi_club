'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { clientRagReply, type ChatTurn } from '../lib/ragClient'
import { resolveChatEndpoint } from '../lib/chatEndpoint'

type Msg = { role: 'user' | 'assistant'; text: string }

const WELCOME =
  "Hi — I'm **MYFI Assistant**. Ask me about credit cards, UPI, SIP, loans, insurance, or credit scores. I'll keep answers practical and India-focused."

const SUGGESTIONS = [
  '2 lakh card bill — only minimums. What happens?',
  'SIP vs lump sum for a beginner?',
  'How do I use UPI more safely?',
  'What usually hurts CIBIL the most?',
]

function formatAssistantText(text: string): ReactNode[] {
  const lines = text.split('\n')
  return lines.map((line, j) => {
    const parts: ReactNode[] = []
    let remaining = line
    let key = 0
    while (remaining.length > 0) {
      const bold = remaining.match(/\*\*([^*]+)\*\*/)
      const italic = remaining.match(/\*([^*]+)\*/)
      if (bold && (!italic || bold.index! <= italic.index!)) {
        if (bold.index! > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, bold.index)}</span>)
        }
        parts.push(
          <strong key={key++} className="chat-widget-strong">
            {bold[1]}
          </strong>
        )
        remaining = remaining.slice(bold.index! + bold[0].length)
      } else if (italic) {
        if (italic.index! > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, italic.index)}</span>)
        }
        parts.push(
          <em key={key++} className="chat-widget-em">
            {italic[1]}
          </em>
        )
        remaining = remaining.slice(italic.index! + italic[0].length)
      } else {
        parts.push(<span key={key++}>{remaining}</span>)
        break
      }
    }
    return (
      <span key={j}>
        {j > 0 ? <br /> : null}
        {parts}
      </span>
    )
  })
}

function buildApiMessages(displayMessages: Msg[]): ChatTurn[] {
  const rest = displayMessages[0]?.role === 'assistant' ? displayMessages.slice(1) : displayMessages
  return rest.map((m) => ({
    role: m.role,
    content: m.text,
  }))
}

async function fetchAssistantReply(displayMessages: Msg[], latestUserText: string): Promise<string> {
  const endpoint = resolveChatEndpoint()
  const priorForApi = buildApiMessages(displayMessages)
  const messagesPayload = [...priorForApi, { role: 'user' as const, content: latestUserText }]

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesPayload }),
      })
      const json = await res.json()
      if (res.ok && json?.success && json?.data?.reply) {
        return String(json.data.reply)
      }
    } catch {
      /* fall through to client RAG */
    }
  }
  return clientRagReply(latestUserText, priorForApi)
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', text: WELCOME }])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open, loading])

  const send = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    setInput('')
    const displayBeforeSend = messages
    setMessages((m) => [...m, { role: 'user', text: trimmed }])
    setLoading(true)
    try {
      const text = await fetchAssistantReply(displayBeforeSend, trimmed)
      setMessages((m) => [...m, { role: 'assistant', text }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  const onSuggest = (q: string) => {
    setInput(q)
  }

  return (
    <div className="chat-widget-root" aria-live="polite">
      {open && (
        <div className="chat-widget-panel" role="dialog" aria-label="MYFI Assistant chat">
          <div className="chat-widget-header">
            <div className="chat-widget-header-text">
              <span className="chat-widget-title">MYFI Assistant</span>
              <span className="chat-widget-subtitle">India personal finance</span>
            </div>
            <button
              type="button"
              className="chat-widget-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="chat-widget-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-widget-bubble ${msg.role === 'user' ? 'chat-widget-bubble-user' : 'chat-widget-bubble-assistant'}`}
              >
                {msg.role === 'assistant' ? formatAssistantText(msg.text) : msg.text}
              </div>
            ))}
            {loading ? (
              <div className="chat-widget-bubble chat-widget-bubble-assistant chat-widget-typing" aria-hidden>
                <span className="chat-widget-dot" />
                <span className="chat-widget-dot" />
                <span className="chat-widget-dot" />
              </div>
            ) : null}
            <div ref={endRef} />
          </div>
          <div className="chat-widget-suggestions" role="group" aria-label="Suggested questions">
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className="chat-widget-chip"
                onClick={() => onSuggest(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="chat-widget-input-row">
            <input
              type="text"
              className="chat-widget-input"
              placeholder="Ask about money in India…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void send()
              }}
              disabled={loading}
              maxLength={4000}
              aria-label="Message"
            />
            <button type="button" className="chat-widget-send" onClick={() => void send()} disabled={loading}>
              Send
            </button>
          </div>
          <p className="chat-widget-disclaimer">Educational info only — not financial, legal, or tax advice.</p>
        </div>
      )}
      <button
        type="button"
        className="chat-widget-fab"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close MYFI Assistant' : 'Open MYFI Assistant'}
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}
