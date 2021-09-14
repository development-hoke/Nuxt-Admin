import decamelize from 'decamelize'
import camelcase from '@/utils/camelcase'
import { ORDER_ASC, ORDER_DESC } from '@/constants/sort'

export default {
  props: {
    route: {
      type: Object,
      default: null,
    },
  },
  methods: {
    extractQueryParam(query) {
      const [column, order] = query.split('-')

      return [camelcase(column), order]
    },

    getOppositeOrder(value) {
      return value === ORDER_ASC ? ORDER_DESC : ORDER_ASC
    },

    handleSort(column) {
      const order = this.getOppositeOrder(this.sortState[column])

      Object.keys(this.sortState).forEach((key) => {
        if (key !== column) {
          this.$set(this.sortState, key, ORDER_ASC)
        }
      })

      this.$set(this.sortState, column, order)

      const sort = `${decamelize(column)}-${order}`
      const route = this.route ?? this.$route
      const query = { ...route.query, sort }

      this.updateSortView(route, query)
    },

    updateSortView(route, query) {
      this.$router.push({ ...route, query })
    },
  },
}
