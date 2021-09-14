import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('orders/', {}, { query: filterQueryParams(params) })
  },

  fetchOne(id) {
    return axios.fetch(`orders/${id}/`)
  },

  update(id, payload) {
    return axios.put(`orders/${id}/`, payload)
  },

  cancel(id) {
    return axios.put(`orders/${id}/cancel`)
  },

  return(id) {
    return axios.put(`orders/${id}/return/`)
  },

  addCoupon(id, payload) {
    return axios.put(`orders/${id}/coupon/add/`, payload)
  },

  removeCoupon(id, payload) {
    return axios.put(`orders/${id}/coupon/remove/`, payload)
  },

  updatePrice(id, payload) {
    return axios.put(`orders/${id}/price/`, payload)
  },

  fetchMessage(id) {
    return axios.fetch(`order_messages/${id}/`)
  },

  sendMessage(orderId, payload) {
    return axios.post(`orders/${orderId}/messages/`, payload)
  },

  downloadCsv(params = {}) {
    return axios.fetch(
      `orders/csv/`,
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },

  downloadDetailCsv(params = {}) {
    return axios.fetch(
      `orders/detail_csv/`,
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },
}
