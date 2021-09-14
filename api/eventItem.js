import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(eventId, params = {}) {
    return axios.fetch(
      `events/${eventId}/items/`,
      {},
      { query: filterQueryParams(params) }
    )
  },

  create(eventId, payload) {
    return axios.post(`events/${eventId}/items/`, payload)
  },

  createByCsv(eventId, payload) {
    return axios.post(`events/${eventId}/items/csv`, payload)
  },

  update(eventId, id, payload) {
    return axios.put(`events/${eventId}/items/${id}/`, payload)
  },

  delete(eventId, id) {
    return axios.delete(`events/${eventId}/items/${id}/`)
  },
}
