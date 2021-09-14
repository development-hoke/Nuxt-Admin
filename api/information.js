import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('information/', {}, { query: filterQueryParams(params) })
  },

  fetchOne(id) {
    return axios.fetch(`information/${id}/`)
  },

  create(payload) {
    return axios.post('information/', payload)
  },

  update(id, payload) {
    return axios.put(`information/${id}/`, payload)
  },

  delete(id) {
    return axios.delete(`information/${id}/`)
  },

  createPreview(payload) {
    return axios.post(`information/preview`, payload)
  },
}
