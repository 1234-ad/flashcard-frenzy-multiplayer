import { NextResponse } from 'next/server'
import { getGameHistory } from '../../../lib/mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const history = await getGameHistory(userId)
    
    return NextResponse.json({
      success: true,
      history: history || []
    })
  } catch (error) {
    console.error('Error fetching game history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch game history' },
      { status: 500 }
    )
  }
}