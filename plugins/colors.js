import Vue from 'vue'

const colors = {
  primary: 'cyan',
  secondary: 'grey darken-1',
  success: 'green darken-1',
  danger: 'red accent-2',
  warning: 'yellow darken-1',
  info: 'purple lightrn-1',
}

Vue.prototype.$colors = colors
export { colors }
export default ({ app }, inject) => {
  app.colors = () => colors
}
