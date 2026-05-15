import http from '../http'

export const listIssues = () =>
  http.get('/tickets/').then((r) => r.data)

export const getIssue = (id) =>
  http.get(`/tickets/${id}`).then((r) => r.data)

export const createIssue = (data) =>
  http.post('/tickets/', data).then((r) => r.data)

export const updateIssue = (id, data) =>
  http.put(`/tickets/${id}`, data).then((r) => r.data)

export const deleteIssue = (id) =>
  http.delete(`/tickets/${id}`).then((r) => r.data)

export const getChangelog = (id) =>
  http.get(`/tickets/${id}/activities`).then((r) => r.data)

export const searchIssues = (params) =>
  http.get('/search', { params }).then((r) => r.data)
