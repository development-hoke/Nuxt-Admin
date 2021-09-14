import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch(
      'top_contents/',
      {},
      { query: filterQueryParams(params) }
    )
  },

  fetchByStoreBrand(storeBrand) {
    return axios.fetch(`top_contents/store_brand/${storeBrand ?? ''}`)
  },

  createMainVisuals(id, payload) {
    return axios.post(`top_contents/${id}/main_visuals/`, payload)
  },

  updateMainVisuals(id, payload) {
    return axios.put(`top_contents/${id}/main_visuals/`, payload)
  },

  updateStatusMainVisuals(id, sort, payload) {
    return axios.put(`top_contents/${id}/main_visuals/status/${sort}`, payload)
  },

  deleteMainVisuals(id, sort) {
    return axios.delete(`top_contents/${id}/main_visuals/${sort}`)
  },

  createNewItems(id, payload) {
    return axios.post(`top_contents/${id}/new_items`, payload)
  },

  updateNewItems(id, itemId, payload) {
    return axios.put(`top_contents/${id}/new_items/${itemId}`, payload)
  },

  deleteNewItems(id, itemId) {
    return axios.delete(`top_contents/${id}/new_items/${itemId}`)
  },

  createPickups(id, payload) {
    return axios.post(`top_contents/${id}/pickups`, payload)
  },

  updatePickups(id, itemId, payload) {
    return axios.put(`top_contents/${id}/pickups/${itemId}`, payload)
  },

  deletePickups(id, itemId) {
    return axios.delete(`top_contents/${id}/pickups/${itemId}`)
  },

  updateBackGroundColor(id, payload) {
    return axios.put(`top_contents/${id}/background_color/`, payload)
  },

  updateFeatures(id, payload) {
    return axios.put(`top_contents/${id}/features/`, payload)
  },

  updateSortFeatures(id, planId, payload) {
    return axios.put(`top_contents/${id}/features/${planId}`, payload)
  },

  updateNews(id, payload) {
    return axios.put(`top_contents/${id}/news/`, payload)
  },

  updateSortNews(id, planId, payload) {
    return axios.put(`top_contents/${id}/news/${planId}`, payload)
  },
}
