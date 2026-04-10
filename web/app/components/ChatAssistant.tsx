'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Msg = { role: 'user' | 'assistant'; text: string }

const API_BASE = (process.env.NEXT_PUBLIC_MYFI_API_URL || '').replace(/\/$/, '')

/** Mirrors backend stub when API URL is unset or request fails (static export friendly). */
function localStubReply(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  let reply =
    "Thanks for using MYFI Assistant (preview). I'm not connected to live financial data or a full RAG pipeline yet—this is a stub response for integration testing.\n\n"
  if (/debt|pay off|balance|interest/i.test(userMessage)) {
    reply +=
      'For credit card debt in general: prioritize high-APR balances, pay at least the minimum on all cards, and consider the avalanche (highest rate first) or snowball (smallest balance first) strategy. Verify numbers against your actual statements in the MYFI app.'
  } else if (/credit score|utilization|crif|experian/i.test(lower)) {
    reply +=
      "Credit scores often improve when utilization stays low and payments are on time. Check your latest score and factors inside MYFI's credit section once live data is linked."
  } else if (/save|savings|sip|invest/i.test(lower)) {
    reply +=
      'For savings and investing, align amount and horizon with your goals. MYFI will surface personalized insights once your accounts and risk profile are connected.'
  } else {
    reply +=
      "Ask me about debt payoff, credit utilization, or savings goals—I'll respond with educational guidance grounded in MYFI policies once RAG is enabled."
  }
  return reply
}

async function fetchAssistantReply(message: string): Promise<string> {
  if (!API_BASE) {
    return localStubReply(message)
  }
  try {
    const res = await fetch(`${API_BASE}/api/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    const json = await res.json()
    if (!res.ok || !json?.success || !json?.data?.reply) {
      return localStubReply(message)
    }
    return String(json.data.reply)
  } catch {
    return localStubReply(message)
  }
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text: "Hi — I'm the MYFI Assistant (preview). Ask about debt, credit, or savings — or say hello.",
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: trimmed }])
    setLoading(true)
    try {
      const text = await fetchAssistantReply(trimmed)
      setMessages((m) => [...m, { role: 'assistant', text }])
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  return (
    <div className="chat-widget-root" aria-live="polite">
      {open && (
        <div className="chat-widget-panel" role="dialog" aria-label="MYFI Assistant chat">
          <div className="chat-widget-header">
            <span className="chat-widget-title">MYFI Assistant</span>
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
                {msg.text.split('\n').map((line, j) => (
                  <span key={j}>
                    {j > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </div>
            ))}
            {loading ? (
              <div className="chat-widget-bubble chat-widget-bubble-assistant chat-widget-typing">…</div>
            ) : null}
            <div ref={endRef} />
          </div>
          <div className="chat-widget-input-row">
            <input
              type="text"
              className="chat-widget-input"
              placeholder="Type a message…"
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
          <p className="chat-widget-disclaimer">Educational info only — not financial advice.</p>
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
