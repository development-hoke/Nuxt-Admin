import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(orderId) {
    return axios.fetch(`orders/${orderId}/details/`)
  },

  create(orderId, payload) {
    return axios.post(`orders/${orderId}/details/`, payload)
  },

  fetchOne(id) {
    return axios.fetch(`order_details/${id}/`)
  },

  cancel(orderId, payload) {
    return axios.put(`orders/${orderId}/details/cancel/`, payload)
  },

  return(orderId, payload) {
    return axios.put(`orders/${orderId}/details/return/`, payload)
  },

  fetchItems(id, params = {}) {
    return axios.fetch(
      `orders/${id}/items/`,
      {},
      {
        query: filterQueryParams(params),
      }
    )
  },
}
