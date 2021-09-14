import Vue from 'vue'
import dayjs from 'dayjs'

export default () => {
  function formatDate(date) {
    if (!date) return ''
    return dayjs(date).format('YYYY/MM/DD HH:mm')
  }
  Vue.filter('date', formatDate)
}
