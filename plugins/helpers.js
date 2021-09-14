import Vue from 'vue'
Vue.prototype.$formDisableAll = function (bool) {
  if (this.$el.getElementsByTagName('form').length === 0) return false
  const form = this.$el.getElementsByTagName('form')[0]
  const inputs = form.getElementsByTagName('input')
  const textareas = form.getElementsByTagName('textarea')
  const button = form.querySelectorAll('button[type=submit]')[0]

  for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i]
    element.disabled = bool
  }
  for (let i = 0; i < textareas.length; i++) {
    const element = textareas[i]
    element.disabled = bool
  }
  button.disabled = bool
  this.$store.commit('common/loading', bool)
}

Vue.prototype.$object2Array = function (obj) {
  if (typeof obj !== 'object') return false
  const result = Object.keys(obj).map(function (key) {
    return { choice: key, text: obj[key] }
  })
  return result
}

Vue.prototype.$getParameterByName = function (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

Vue.prototype.$linkToPreviousPage = function () {
  this.$router.back()
}

Vue.prototype.$countCharacters = function (text) {
  const lines = text.split(/\n/)
  let count = 0
  lines.forEach((line) => {
    const eachLines = Math.ceil(line.length / 21)
    count += eachLines
  })
  return count
}
