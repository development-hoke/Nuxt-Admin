import querystring from 'querystring'
import EventEmitter from 'events'
import axios from 'axios'
import merge from 'lodash.merge'
import { decamelizeKeys, camelizeKeys } from '@/utils'
import { preprocessStringfyingQuery } from '@/utils/http'
import * as httpStatusCode from '@/constants/httpStatusCode'

const HEADER_AUTHORIZATION = 'Authorization'

const BASE_API_URI = process.env.apiBaseUrl
const FRONT_API_BASE_URL = process.env.apiFrontBaseUrl

const EVENT_TYPE_TOKEN_REFRESHED = 'token_refreshed'

const httpClient = axios.create()

const normalizeValidationErrorKeys = (data) => {
  if (!data.errors || typeof data.errors !== 'object') {
    return data
  }

  Object.keys(data.errors).forEach((key) => {
    if (!String(key).includes('.')) {
      return
    }

    const groupKey = key.split('.')[0]

    if (!data.errors[groupKey]) {
      data.errors[groupKey] = []
    }

    if (!Array.isArray(data.errors[groupKey])) {
      data.errors[groupKey] = [data.errors[groupKey]]
    }

    data.errors[groupKey].push(...data.errors[key])
  })

  return data
}

const Client = {
  config: {
    headers: {
      'Content-Type': 'application/json',
    },
  },

  tokenRefreshPending: false,
  events: new EventEmitter(),
  store: null,
  redirect: null,

  init({ store, redirect }) {
    this.store = store
    this.redirect = redirect
    this.setAccessToken(store.getters['currentUser/accessToken'])
  },

  setAccessToken(token) {
    this.setHeader(HEADER_AUTHORIZATION, `Bearer ${token}`)
  },

  removeAccessToken() {
    this.removeHeader(HEADER_AUTHORIZATION)
  },

  setHeader(name, value) {
    this.config.headers[name] = value
  },

  removeHeader(name) {
    delete this.config.headers[name]
  },

  fetch(url, config = {}, options = {}) {
    return this.request({ method: 'get', url }, config, options)
  },

  post(url, data = {}, config = {}, options = {}) {
    return this.request({ method: 'post', url, data }, config, options)
  },

  put(url, data = {}, config = {}, options = {}) {
    return this.request({ method: 'put', url, data }, config, options)
  },

  delete(url, config = {}, options = {}) {
    return this.request({ method: 'delete', url }, config, options)
  },

  request(request, config, options = {}, retry = false) {
    const {
      decamelizeRequest = true,
      camelizeResponse = true,
      query = {},
      withHeaders = false,
      isFront = false,
    } = options

    if (!retry) {
      const { url } = request
      const encodedQuery =
        Object.keys(query).length > 0
          ? '?' + querystring.stringify(preprocessStringfyingQuery(query))
          : ''
      request.url = `${
        isFront ? FRONT_API_BASE_URL : BASE_API_URI
      }/${url}${encodedQuery}`

      if (decamelizeRequest && request.data) {
        request.data = decamelizeKeys(request.data)
      }
    }

    this.setHeader(
      'Admin-Referer',
      window.location.href.replace(window.location.search, '')
    )

    return httpClient
      .request(merge({}, this.config, config, request))
      .then((response) => (withHeaders ? response : response.data))
      .then((data) => (camelizeResponse ? camelizeKeys(data) : data))
      .catch((error) => this.handleError(error, { request, config, options }))
  },

  async handleError(error, requestParams) {
    if (!error.isAxiosError) {
      throw error
    }

    const { status } = error.response

    switch (status) {
      case httpStatusCode.UNAUTHORIZED:
      case httpStatusCode.FORBIDDEN:
        return await this.handleUnauthorizedError(error, requestParams)
      case httpStatusCode.UNPROCESSABLE_ENTITY:
        error.response.data = camelizeKeys(
          normalizeValidationErrorKeys(error.response.data)
        )
        break
      default:
        break
    }

    throw error
  },

  async handleUnauthorizedError(error, requestParams) {
    if ((error.response.config.url || '').match(/\/auth\/refresh/)) {
      this.store.commit('currentUser/deleteAccessToken')
      this.redirect({ name: 'login' })
      return error
    }

    if ((error.response.config.url || '').match(/\/auth\/login/)) {
      throw error
    }

    if (this.tokenRefreshPending) {
      if (
        !(await new Promise((resolve) =>
          this.events.once(EVENT_TYPE_TOKEN_REFRESHED, resolve)
        ))
      ) {
        throw error
      }
      return await this.retryRequest(requestParams)
    }

    try {
      this.tokenRefreshPending = true

      await this.store.dispatch('currentUser/refreshToken')

      this.events.emit(EVENT_TYPE_TOKEN_REFRESHED, true)

      return await this.retryRequest(requestParams)
    } catch (error) {
      this.events.emit(EVENT_TYPE_TOKEN_REFRESHED, false)
      throw error
    } finally {
      this.tokenRefreshPending = false
    }
  },

  retryRequest(requestParams) {
    const { request, config, options } = requestParams

    return this.request(request, config, options, true)
  },
}

export default Client
