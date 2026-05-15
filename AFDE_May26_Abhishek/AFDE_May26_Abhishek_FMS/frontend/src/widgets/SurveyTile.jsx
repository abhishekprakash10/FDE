/**
 * SurveyTile.jsx — Compact card showing a survey entry summary
 */

import React from 'react'
import ScoreMeter from './ScoreMeter'
import './SurveyTile.css'

export default function SurveyTile({ entry }) {
  const initial = (entry.respondent_name || '?').charAt(0).toUpperCase()

  return (
    <div className="survey-tile">
      <div className="tile-avatar" aria-hidden="true">{initial}</div>
      <div className="tile-info">
        <div className="tile-name">{entry.respondent_name}</div>
        <div className="tile-course">{entry.course_name}</div>
      </div>
      <div className="tile-score">
        <ScoreMeter score={entry.score} showLabel={false} showFraction />
      </div>
    </div>
  )
}
