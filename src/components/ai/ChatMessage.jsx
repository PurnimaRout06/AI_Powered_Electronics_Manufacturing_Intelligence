import { Sparkles, User } from 'lucide-react'
import clsx from 'clsx'

function AnswerBody({ answer }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{answer.title}</p>
      <p className="text-sm text-ink mt-1 leading-relaxed">{answer.summary}</p>

      {answer.sections?.map((section, i) => (
        <div key={i} className="mt-3">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">{section.heading}</p>
          {section.type === 'list' ? (
            <ul className="mt-1.5 space-y-1">
              {section.items.map((item, j) => (
                <li key={j} className="text-sm text-ink flex gap-2">
                  <span className="text-primary mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-sm text-ink leading-relaxed">{section.content}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={clsx('flex gap-3 animate-slideIn', isUser && 'flex-row-reverse')}>
      <div
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary-light text-primary-dark' : 'bg-navy text-white'
        )}
      >
        {isUser ? <User size={14} /> : <Sparkles size={14} />}
      </div>

      <div
        className={clsx(
          'max-w-[80%] rounded-card px-4 py-3',
          isUser ? 'bg-primary text-white' : 'bg-surface-card border border-surface-border'
        )}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : message.loading ? (
          <div className="flex items-center gap-1.5 py-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-ink-muted animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        ) : (
          <AnswerBody answer={message.content} />
        )}
      </div>
    </div>
  )
}
