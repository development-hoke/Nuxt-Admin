import axios from './axios'

export default {
  fetch() {
    return axios.fetch('item_bulk_uploads/')
  },

  storeItemCsv(payload) {
    return axios.post('item_bulk_uploads/csv/items/', payload)
  },

  storeItemImages(payload) {
    return axios.post(
      'item_bulk_uploads/item_images/',
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      },
      { decamelizeRequest: false }
    )
  },

  downloadErrorCsv(id) {
    return axios.fetch(
      `item_bulk_uploads/${id}/csv/errors`,
      { responseType: 'blob' },
      { withHeaders: true, camelizeResponse: false }
    )
  },

  downloadItemCsvFormat() {
    return axios.fetch(
      'item_bulk_uploads/csv/format/item',
      { responseType: 'blob' },
      { withHeaders: true, camelizeResponse: false }
    )
  },

  downloadItemImageCsvFormat() {
    return axios.fetch(
      'item_bulk_uploads/csv/format/item_image',
      { responseType: 'blob' },
      { withHeaders: true, camelizeResponse: false }
    )
  },
}
