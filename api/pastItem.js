import axios from './axios'
import { filterQueryParams } from '@/utils/http'

export default {
  fetch(params = {}) {
    return axios.fetch('past_items/', {}, { query: filterQueryParams(params) })
  },
}
