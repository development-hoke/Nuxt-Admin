import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('plans/', {}, { query: filterQueryParams(params) })
  },

  fetchOne(id) {
    return axios.fetch(`plans/${id}/`)
  },

  create(payload) {
    return axios.post('plans/', payload)
  },

  update(id, payload) {
    return axios.put(`plans/${id}/`, payload)
  },

  copy(id) {
    return axios.post(`plans/${id}/copy/`)
  },

  delete(id) {
    return axios.delete(`plans/${id}/`)
  },

  deleteListItems(id, itemId) {
    return axios.delete(`plans/${id}/item/${itemId}`)
  },

  createNewItems(id, payload) {
    return axios.post(`plans/${id}/new_items`, payload)
  },

  updateItemSetting(id, payload) {
    return axios.put(`plans/${id}/item_setting/`, payload)
  },

  fetchByStoreBrand(storeBrand) {
    return axios.fetch(`plans/store_brand/${storeBrand ?? ''}`)
  },
}
