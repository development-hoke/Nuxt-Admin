import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(eventId, params = {}) {
    return axios.fetch(
      `events/${eventId}/users/`,
      {},
      { query: filterQueryParams(params) }
    )
  },

  createByCsv(eventId, payload) {
    return axios.post(`events/${eventId}/users/csv`, payload)
  },

  delete(eventId, id) {
    return axios.delete(`events/${eventId}/users/${id}/`)
  },
}
