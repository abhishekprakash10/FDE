/**
 * surveyApi.js — API service functions for survey entries
 * All calls use the shared http (axios) instance.
 */

import http from '../http'

/** Fetch all feedback entries */
export async function fetchAll() {
  const { data } = await http.get('/feedback/')
  return data
}

/** Fetch a single entry by id */
export async function fetchOne(id) {
  const { data } = await http.get(`/feedback/${id}`)
  return data
}

/** Submit a new feedback entry */
export async function submitEntry(payload) {
  const { data } = await http.post('/feedback/', payload)
  return data
}

/** Partially update an existing entry (admin) */
export async function patchEntry(id, payload) {
  const { data } = await http.put(`/feedback/${id}`, payload)
  return data
}

/** Delete an entry by id (admin) */
export async function removeEntry(id) {
  await http.delete(`/feedback/${id}`)
}

/**
 * Search entries with optional filters.
 * @param {{ keyword?: string, rating?: number, program_name?: string }} params
 */
export async function searchEntries(params = {}) {
  const query = new URLSearchParams()
  if (params.keyword) query.append('keyword', params.keyword)
  if (params.rating) query.append('rating', params.rating)
  if (params.program_name) query.append('program_name', params.program_name)
  const { data } = await http.get(`/search?${query.toString()}`)
  return data
}
