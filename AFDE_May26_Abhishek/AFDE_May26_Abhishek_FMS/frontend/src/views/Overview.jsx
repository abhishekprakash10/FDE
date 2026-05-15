/**
 * Overview.jsx — Dashboard page showing stats, course averages, and recent entries
 */

import React, { useEffect, useState } from 'react'
import { fetchAll } from '../data/surveyApi'
import SurveyTile from '../widgets/SurveyTile'
import ScoreMeter from '../widgets/ScoreMeter'
import { useNotify } from '../widgets/Notification'
import './Overview.css'

function computeStats(entries) {
  const total = entries.length
  if (total === 0) return { total: 0, avg: 0, fiveStars: 0, programs: 0 }

  const avg = entries.reduce((acc, e) => acc + e.score, 0) / total
  const fiveStars = entries.filter((e) => e.score === 5).length
  const programs = new Set(entries.map((e) => e.course_name)).size
  return { total, avg: avg.toFixed(1), fiveStars, programs }
}

function computeCourseAvg(entries) {
  const map = {}
  for (const e of entries) {
    if (!map[e.course_name]) map[e.course_name] = { sum: 0, count: 0 }
    map[e.course_name].sum += e.score
    map[e.course_name].count += 1
  }
  return Object.entries(map)
    .map(([name, { sum, count }]) => ({ name, avg: (sum / count).toFixed(1), count }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export default function Overview() {
  const notify = useNotify()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
      .then(setEntries)
      .catch(() => notify('Could not load data.', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const stats = computeStats(entries)
  const courseAvg = computeCourseAvg(entries)
  const recent = entries.slice(0, 8)

  if (loading) {
    return (
      <div className="overview-page" style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: '3rem' }}>
        <div className="spinner" /> Loading overview…
      </div>
    )
  }

  return (
    <div className="overview-page">
      <h1>Overview</h1>
      <p className="overview-subtitle">Summary of all submitted feedback</p>

      {/* Stats */}
      <div className="stats-strip">
        <div className="stat-card teal">
          <span className="stat-icon">📋</span>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-title">Total Entries</div>
          </div>
        </div>
        <div className="stat-card emerald">
          <span className="stat-icon">⭐</span>
          <div className="stat-info">
            <div className="stat-value">{stats.avg}</div>
            <div className="stat-title">Average Score</div>
          </div>
        </div>
        <div className="stat-card amber">
          <span className="stat-icon">🏆</span>
          <div className="stat-info">
            <div className="stat-value">{stats.fiveStars}</div>
            <div className="stat-title">5-Star Ratings</div>
          </div>
        </div>
        <div className="stat-card blue">
          <span className="stat-icon">📚</span>
          <div className="stat-info">
            <div className="stat-value">{stats.programs}</div>
            <div className="stat-title">Programs</div>
          </div>
        </div>
      </div>

      {/* Lower grid */}
      <div className="overview-grid">
        {/* Course averages */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div className="section-title">Average Score by Program</div>
          {courseAvg.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📊</span>
              <p>No data yet.</p>
            </div>
          ) : (
            <div className="course-table-wrap">
              <table className="avg-table">
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Avg Score</th>
                    <th>Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {courseAvg.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>
                      <td>
                        <ScoreMeter score={parseFloat(row.avg)} showFraction showLabel={false} />
                      </td>
                      <td>
                        <span className="badge badge-teal">{row.count}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent entries */}
        <div className="card" style={{ padding: '1.3rem' }}>
          <div className="section-title">Recent Entries</div>
          {recent.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>No entries submitted yet.</p>
            </div>
          ) : (
            <div className="recent-list">
              {recent.map((e) => (
                <SurveyTile key={e.entry_id} entry={e} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
