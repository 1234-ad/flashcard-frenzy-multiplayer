import { NextResponse } from 'next/server'
import { getFlashcards, initializeFlashcards } from '../../../lib/mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10

    // Initialize flashcards if needed
    await initializeFlashcards()
    
    const flashcards = await getFlashcards(limit)
    
    return NextResponse.json({
      success: true,
      flashcards: flashcards || []
    })
  } catch (error) {
    console.error('Error fetching flashcards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    )
  }
}