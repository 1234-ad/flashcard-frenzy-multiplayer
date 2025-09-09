'use client'

export default function PlayerScore({ 
  player, 
  score = 0, 
  isCurrentUser = false, 
  maxScore = 5,
  isWinner = false,
  gameStatus = 'waiting'
}) {
  const getPlayerStatus = () => {
    if (gameStatus === 'finished' && isWinner) {
      return '👑 Winner!'
    }
    if (isCurrentUser) {
      return '👤 You'
    }
    return '👥 Opponent'
  }

  const getScoreColor = () => {
    if (isWinner) return 'text-yellow-600'
    if (isCurrentUser) return 'text-primary-600'
    return 'text-gray-600'
  }

  const getCardStyle = () => {
    let baseStyle = 'card transition-all duration-300 '
    
    if (isWinner) {
      baseStyle += 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg '
    } else if (isCurrentUser) {
      baseStyle += 'bg-gradient-to-r from-blue-50 to-blue-100 border-primary-300 '
    } else {
      baseStyle += 'bg-white border-gray-200 '
    }
    
    return baseStyle
  }

  return (
    <div className={getCardStyle()}>
      <div className="text-center">
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-500">
            {getPlayerStatus()}
          </span>
        </div>
        
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 truncate" title={player?.email || player?.name || 'Player'}>
            {player?.email?.split('@')[0] || player?.name || 'Player'}
          </h3>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <div className={`text-3xl font-bold ${getScoreColor()}`}>
            {score}
          </div>
          <div className="text-gray-400 text-lg">
            / {maxScore}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                isWinner 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                  : isCurrentUser 
                    ? 'bg-gradient-to-r from-primary-400 to-primary-600'
                    : 'bg-gradient-to-r from-gray-400 to-gray-600'
              }`}
              style={{ width: `${Math.min((score / maxScore) * 100, 100)}%` }}
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={maxScore}
              aria-label={`${player?.email?.split('@')[0] || 'Player'} score: ${score} out of ${maxScore}`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((score / maxScore) * 100)}% complete
          </p>
        </div>
        
        {/* Status indicators */}
        {gameStatus === 'playing' && (
          <div className="mt-3 flex justify-center">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Playing</span>
            </div>
          </div>
        )}
        
        {gameStatus === 'waiting' && (
          <div className="mt-3 flex justify-center">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-600 font-medium">Waiting</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}