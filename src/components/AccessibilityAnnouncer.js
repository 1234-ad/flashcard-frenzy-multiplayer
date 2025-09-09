'use client'
import { useEffect, useRef } from 'react'

export default function AccessibilityAnnouncer({ message, priority = 'polite' }) {
  const announcerRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (message && announcerRef.current) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Clear the current message first
      announcerRef.current.textContent = ''
      
      // Set the new message after a brief delay to ensure screen readers pick it up
      timeoutRef.current = setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message
        }
      }, 100)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [message])

  return (
    <>
      {/* Primary announcer for important messages */}
      <div
        ref={announcerRef}
        aria-live={priority}
        aria-atomic="true"
        className="sr-only"
        role="status"
        aria-label="Game announcements"
      />
      
      {/* Secondary announcer for redundancy */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="log"
        aria-label="Game activity log"
      >
        {message && (
          <span key={Date.now()}>
            {message}
          </span>
        )}
      </div>
    </>
  )
}