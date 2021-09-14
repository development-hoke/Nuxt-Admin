import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('staffs/', {}, { query: filterQueryParams(params) })
  },
}
