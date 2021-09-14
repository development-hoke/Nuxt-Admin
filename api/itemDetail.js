import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch(
      'item_details/',
      {},
      { query: filterQueryParams(params) }
    )
  },

  fetchIdentifications(params = {}) {
    return axios.fetch(
      'item_details/identifications',
      {},
      { query: filterQueryParams(params) }
    )
  },

  fetchByItemId(itemId) {
    return axios.fetch(`items/${itemId}/item_details/`)
  },

  fetchItemDetailIndividuals(params = {}) {
    return axios.fetch(
      'item_detail_individuals/',
      {},
      { query: filterQueryParams(params) }
    )
  },

  downloadCsv(params = {}) {
    return axios.fetch(
      'item_details/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },
}
