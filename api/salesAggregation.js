import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetchOrders(params = {}) {
    return axios.fetch(
      'sales_aggrigation/orders/',
      {},
      { query: filterQueryParams(params) }
    )
  },

  fetchDailyAggregration() {
    return axios.fetch('sales_aggrigation/dailiy/', {})
  },

  fetchMonthlyAggregration() {
    return axios.fetch('sales_aggrigation/monthly/', {})
  },

  fetchItems(params = {}) {
    return axios.fetch(
      'sales_aggrigation/items/',
      {},
      { query: filterQueryParams(params) }
    )
  },

  downloadOrderCsv(params = {}) {
    return axios.fetch(
      'sales_aggrigation/orders/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },

  downloadOrderDetailCsv(params = {}) {
    return axios.fetch(
      'sales_aggrigation/order_details/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },

  downloadItemCsv(params = {}) {
    return axios.fetch(
      'sales_aggrigation/items/csv/',
      { responseType: 'blob' },
      {
        withHeaders: true,
        camelizeResponse: false,
        query: filterQueryParams(params),
      }
    )
  },
}
