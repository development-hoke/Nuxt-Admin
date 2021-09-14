import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetchAvailableCoupons(memberId, params = {}) {
    return axios.fetch(
      `member/${memberId}/coupons/`,
      {},
      { query: filterQueryParams(params) }
    )
  },
}
