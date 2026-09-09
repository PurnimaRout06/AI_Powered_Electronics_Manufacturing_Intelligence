export default function SuggestedQuestions({ questions, onSelect }) {
  if (!questions?.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="rounded-full border border-surface-border bg-white px-3 py-1.5 text-xs text-ink-muted hover:border-primary hover:text-primary transition-colors"
        >
          {q}
        </button>
      ))}
    </div>
  )
}
