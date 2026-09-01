import { useEffect, useRef, useState } from 'react'
import { Send, Mic, Sparkles } from 'lucide-react'
import { aiService } from '../../services/aiService'
import ChatMessage from './ChatMessage'
import SuggestedQuestions from './SuggestedQuestions'

export default function ChatWindow({ suggestedQuestions }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function send(text) {
    const question = (text ?? input).trim()
    if (!question || sending) return

    setInput('')
    setSending(true)
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: question },
      { id: 'pending', role: 'assistant', loading: true, content: null }
    ])

    try {
      const answer = await aiService.askQuestion(question)
      setMessages((prev) =>
        prev.map((m) => (m.id === 'pending' ? { id: crypto.randomUUID(), role: 'assistant', content: answer } : m))
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === 'pending'
            ? {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: {
                  title: 'Something went wrong',
                  summary: "Couldn't reach the AI service. Please try again.",
                  sections: []
                }
              }
            : m
        )
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] min-h-[480px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin space-y-5 pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="h-11 w-11 rounded-full bg-primary-lighter flex items-center justify-center mb-3">
              <Sparkles size={18} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-ink">Ask about your operations</p>
            <p className="text-xs text-ink-muted mt-1 max-w-xs">
              Try a question about production, equipment risk, quality, or downtime.
            </p>
            <div className="mt-5">
              <SuggestedQuestions questions={suggestedQuestions} onSelect={send} />
            </div>
          </div>
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}
      </div>

      <div className="mt-4 border-t border-surface-border pt-4">
        {messages.length > 0 && (
          <div className="mb-3">
            <SuggestedQuestions questions={suggestedQuestions.slice(0, 3)} onSelect={send} />
          </div>
        )}
        <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-3 py-2 focus-within:border-primary transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask a question about your manufacturing operations..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
          />
          <button className="text-ink-muted hover:text-ink transition-colors">
            <Mic size={16} />
          </button>
          <button
            onClick={() => send()}
            disabled={sending || !input.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white disabled:opacity-40 hover:bg-primary-dark transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
