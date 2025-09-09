'use client'
import { useState, useEffect, useRef } from 'react'

export default function FlashCard({ card, onSubmitAnswer, disabled = false }) {
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    // Focus the input when a new card appears
    if (card && inputRef.current && !disabled) {
      inputRef.current.focus()
    }
  }, [card, disabled])

  useEffect(() => {
    // Clear answer when card changes
    setAnswer('')
    setShowHint(false)
    setIsSubmitting(false)
  }, [card])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (answer.trim() && !disabled && !isSubmitting) {
      setIsSubmitting(true)
      await onSubmitAnswer(answer.trim())
      setAnswer('')
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (!card) {
    return (
      <div className="card max-w-2xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card max-w-2xl mx-auto game-card-enter">
      <div className="mb-6">
        <h2 
          className="text-2xl font-bold mb-4 text-gray-900" 
          id="flashcard-question"
          tabIndex="-1"
        >
          {card.question}
        </h2>
        
        {card.hint && (
          <div className="mb-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-primary-600 hover:text-primary-800 underline text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              aria-expanded={showHint}
              aria-controls="hint-content"
              type="button"
            >
              {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
            </button>
            {showHint && (
              <div 
                id="hint-content" 
                className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                role="region"
                aria-label="Hint"
              >
                <p className="text-yellow-800 italic text-sm">
                  💡 <strong>Hint:</strong> {card.hint}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="answer-input" className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer
          </label>
          <input
            ref={inputRef}
            id="answer-input"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer and press Enter..."
            className="input-field text-lg"
            aria-describedby="flashcard-question"
            disabled={disabled || isSubmitting}
            autoComplete="off"
            spellCheck="false"
          />
          <p className="mt-1 text-xs text-gray-500">
            Press Enter to submit your answer quickly
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!answer.trim() || disabled || isSubmitting}
            className="flex-1 btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              '🚀 Submit Answer'
            )}
          </button>
          
          {answer && (
            <button
              type="button"
              onClick={() => setAnswer('')}
              className="btn-secondary px-4 py-3"
              aria-label="Clear answer"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {disabled && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600 text-sm">
            ⏳ Waiting for the next question...
          </p>
        </div>
      )}
    </div>
  )
}