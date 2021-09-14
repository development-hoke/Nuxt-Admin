import axios from './axios'

export default {
  fetchEnums() {
    return axios.fetch('master/enums/', {}, { camelizeResponse: false })
  },

  fetchTerms() {
    return axios.fetch('master/terms/')
  },

  fetchPrefs() {
    return axios.fetch('master/prefs/')
  },

  fetchDivisions() {
    return axios.fetch('master/divisions/')
  },

  fetchDepartments() {
    return axios.fetch('master/departments/')
  },

  fetchOrganizations() {
    return axios.fetch('master/organizations/')
  },

  fetchActionNames() {
    return axios.fetch('master/actionNames/')
  },
}
