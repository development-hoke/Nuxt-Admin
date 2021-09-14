import api, { HttpClient } from '@/api'

export default (context, inject) => {
  inject('api', api)

  HttpClient.init(context)
}
