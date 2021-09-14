import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('items/', {}, { query: filterQueryParams(params) })
  },

  fetchOne(id) {
    return axios.fetch(`items/${id}/`)
  },

  update(id, payload) {
    return axios.put(`items/${id}/`, payload)
  },

  delete(id) {
    return axios.delete(`items/${id}/`)
  },

  updateStatus(id, status) {
    return axios.put(`items/${id}/status/`, { status })
  },

  uploadImage(id, payload) {
    return axios.post(
      `items/${id}/image/`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      },
      { decamelizeRequest: false }
    )
  },

  downloadCsv(params = {}) {
    return axios.fetch(
      `items/csv/`,
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },

  downloadInfoCsv(params = {}) {
    return axios.fetch(
      `items/csv_info/`,
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },

  downloadImageCsv(params = {}) {
    return axios.fetch(
      `items/csv_image/`,
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },

  createPreview(id, payload) {
    return axios.post(`items/${id}/preview`, payload)
  },
}
