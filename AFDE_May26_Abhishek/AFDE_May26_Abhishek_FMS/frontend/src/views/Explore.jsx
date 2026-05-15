/**
 * Explore.jsx — Search and filter feedback entries
 */

import React, { useState, useEffect } from 'react'
import { fetchAll, searchEntries } from '../data/surveyApi'
import ScoreMeter from '../widgets/ScoreMeter'
import EntryPanel from './panels/EntryPanel'
import EntryForm from './panels/EntryForm'
import RemovePanel from './panels/RemovePanel'
import { useSession } from '../context/SessionContext'
import { useNotify } from '../widgets/Notification'
import './Explore.css'

export default function Explore() {
  const { isAdmin } = useSession()
  const notify = useNotify()

  const [keyword, setKeyword] = useState('')
  const [rating, setRating] = useState('')
  const [programName, setProgramName] = useState('')
  const [programs, setPrograms] = useState([])

  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const [viewEntry, setViewEntry] = useState(null)
  const [editEntry, setEditEntry] = useState(null)
  const [deleteEntry, setDeleteEntry] = useState(null)

  // Load distinct program names for the dropdown
  useEffect(() => {
    fetchAll()
      .then((data) => {
        const unique = [...new Set(data.map((e) => e.course_name))].sort()
        setPrograms(unique)
      })
      .catch(() => {})
  }, [])

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const params = {}
      if (keyword.trim()) params.keyword = keyword.trim()
      if (rating) params.rating = Number(rating)
      if (programName) params.program_name = programName
      const data = await searchEntries(params)
      setResults(data)
      setSearched(true)
    } catch {
      notify('Search failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setKeyword('')
    setRating('')
    setProgramName('')
    setResults([])
    setSearched(false)
  }

  function handleSaved(updated) {
    setResults((prev) => prev.map((e) => (e.entry_id === updated.entry_id ? updated : e)))
  }

  function handleRemoved(id) {
    setResults((prev) => prev.filter((e) => e.entry_id !== id))
  }

  return (
    <div className="explore-page">
      <h1>Explore</h1>
      <p className="explore-subtitle">Search and filter feedback entries</p>

      {/* Filters */}
      <div className="explore-filters">
        <form onSubmit={handleSearch}>
          <div className="explore-filters-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="ex-keyword">Keyword</label>
              <input
                id="ex-keyword"
                className="form-control"
                placeholder="Search name, program, remarks…"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="ex-rating">Score</label>
              <select
                id="ex-rating"
                className="form-control"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1 — Terrible</option>
                <option value="2">2 — Poor</option>
                <option value="3">3 — Okay</option>
                <option value="4">4 — Good</option>
                <option value="5">5 — Excellent</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="ex-program">Program</label>
              <select
                id="ex-program"
                className="form-control"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
              >
                <option value="">All programs</option>
                {programs.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="explore-filter-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleClear}
            >
              Clear
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Searching…' : '🔍 Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <>
          <p className="explore-results-info">
            Found <strong>{results.length}</strong> {results.length === 1 ? 'entry' : 'entries'}
          </p>

          {results.length === 0 ? (
            <div className="card empty-state">
              <span className="empty-icon">🔍</span>
              <p>No entries match your filters.</p>
            </div>
          ) : (
            <div className="table-wrapper card">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Respondent</th>
                    <th>Program</th>
                    <th>Score</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((entry, idx) => (
                    <tr key={entry.entry_id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{idx + 1}</td>
                      <td>{entry.respondent_name}</td>
                      <td>{entry.course_name}</td>
                      <td>
                        <ScoreMeter score={entry.score} showFraction showLabel={false} />
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 200 }}>
                        {entry.remarks
                          ? (entry.remarks.length > 60 ? entry.remarks.slice(0, 60) + '…' : entry.remarks)
                          : <em style={{ color: 'var(--text-light)' }}>—</em>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="action-icon-btn"
                            onClick={() => setViewEntry(entry)}
                            title="View"
                            style={{ background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: '0.88rem', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s' }}
                          >
                            👁
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => setEditEntry(entry)}
                                title="Edit"
                                style={{ background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: '0.88rem', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s' }}
                              >
                                ✏
                              </button>
                              <button
                                onClick={() => setDeleteEntry(entry)}
                                title="Delete"
                                style={{ background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: '0.88rem', cursor: 'pointer', color: 'var(--danger)', transition: 'all 0.15s' }}
                              >
                                🗑
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!searched && !loading && (
        <div className="card empty-state">
          <span className="empty-icon">🔍</span>
          <p>Use the filters above to search for entries.</p>
        </div>
      )}

      {/* Panels */}
      <EntryPanel entry={viewEntry} onClose={() => setViewEntry(null)} />
      <EntryForm entry={editEntry} onClose={() => setEditEntry(null)} onSaved={handleSaved} />
      <RemovePanel entry={deleteEntry} onClose={() => setDeleteEntry(null)} onRemoved={handleRemoved} />
    </div>
  )
}
