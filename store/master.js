import api from '@/api'
import { createDict } from '@/utils/dataStructure'

export const state = () => ({
  terms: [],
  prefs: [],
  divisions: [],
  departments: [],
  organizations: [],
  actionNames: {},
})

export const getters = {
  terms: ({ terms }) => terms,
  divisions: ({ divisions }) => divisions,
  departments: ({ departments }) => departments,
  organizations: ({ organizations }) => organizations,
  actionNames: ({ actionNames }) => actionNames,

  termOptions: ({ terms }) =>
    terms.map(({ id, name }) => ({
      code: id,
      name,
    })),

  prefOptions: ({ prefs }) =>
    prefs.map(({ id, name }) => ({
      code: id,
      name,
    })),

  divisionOptions: ({ divisions }) =>
    divisions.map(({ id, name }) => ({
      code: id,
      name,
    })),

  departmentOptions: ({ departments }) =>
    departments.map(({ id, name }) => ({
      code: id,
      name,
    })),

  organizationOptions: ({ organizations }) =>
    organizations.map(({ id, name }) => ({
      code: id,
      name,
    })),

  actionNameOptions: ({ actionNames }) =>
    Object.keys(actionNames).map((code) => ({
      code,
      name: actionNames[code],
    })),

  termDict: ({ terms }) => createDict(terms),
  prefDict: ({ prefs }) => createDict(prefs),
}

export const mutations = {
  setTerms(state, data) {
    state.terms = data
  },

  setPrefs(state, data) {
    state.prefs = data
  },

  setDivisions(state, data) {
    state.divisions = data
  },

  setDepartments(state, data) {
    state.departments = data
  },

  setOrganizations(state, data) {
    state.organizations = data
  },

  setActionNames(state, data) {
    state.actionNames = data
  },
}

export const actions = {
  async fetchTerms({ commit }) {
    const { data } = await api.master.fetchTerms()
    commit('setTerms', data)
  },

  async fetchPrefs({ commit }) {
    const { data } = await api.master.fetchPrefs()
    commit('setPrefs', data)
  },

  async fetchDivisions({ commit }) {
    const { data } = await api.master.fetchDivisions()
    commit('setDivisions', data)
  },

  async fetchDepartments({ commit }) {
    const { data } = await api.master.fetchDepartments()
    commit('setDepartments', data)
  },

  async fetchOrganizations({ commit }) {
    const { data } = await api.master.fetchOrganizations()
    commit('setOrganizations', data)
  },

  async fetchActionNames({ commit }) {
    const { data } = await api.master.fetchActionNames()
    commit('setActionNames', data)
  },
}
