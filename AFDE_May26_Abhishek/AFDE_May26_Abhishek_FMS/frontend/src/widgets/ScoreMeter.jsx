/**
 * ScoreMeter.jsx — Displays a 1-5 score as filled/empty dots with text label
 * Example: score=4 → ●●●●○ Good
 */

import React from 'react'
import './ScoreMeter.css'

const SCORE_LABELS = {
  1: 'Terrible',
  2: 'Poor',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
}

export default function ScoreMeter({ score, showLabel = true, showFraction = true }) {
  const clamped = Math.max(1, Math.min(5, Math.round(score)))

  return (
    <div className="score-meter" aria-label={`Score: ${clamped} out of 5`}>
      {showFraction && <span className="score-fraction">{clamped}/5</span>}
      <span className="score-dots" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={i <= clamped ? 'score-dot-filled' : 'score-dot-empty'}
          >
            {i <= clamped ? '●' : '○'}
          </span>
        ))}
      </span>
      {showLabel && <span className="score-label">{SCORE_LABELS[clamped]}</span>}
    </div>
  )
}
