/**
 * RatingSelector.jsx — Numbered button (1-5) rating picker with labels
 * Labels: 1=Terrible, 2=Poor, 3=Okay, 4=Good, 5=Excellent
 */

import React from 'react'
import './RatingSelector.css'

const SCORE_LABELS = {
  1: 'Terrible',
  2: 'Poor',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
}

export default function RatingSelector({ value, onChange, label = 'Score' }) {
  return (
    <div className="rating-selector">
      {label && <span className="rating-selector-label">{label}</span>}
      <div className="rating-buttons">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            className={`rating-btn${value === num ? ' selected' : ''}`}
            onClick={() => onChange(num)}
            aria-label={`Score ${num}: ${SCORE_LABELS[num]}`}
            aria-pressed={value === num}
          >
            <span className="rating-btn-number">{num}</span>
            <span className="rating-btn-text">{SCORE_LABELS[num]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
