<template>
  <table class="bordered striped highlight centered scroll">
    <thead>
      <tr>
        <th>商品サムネイル</th>
        <th>事部品番</th>
        <th>メーカー品番</th>
        <th>上代</th>
        <th>販売価格</th>
        <SortableHeaderCell
          :order="sortState.totalAmount"
          @click="handleSort('totalAmount')"
          >販売数量</SortableHeaderCell
        >
        <SortableHeaderCell
          :order="sortState.totalPrice"
          @click="handleSort('totalPrice')"
          >売上</SortableHeaderCell
        >
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td>
          <ItemThumbnail class="thumbnail" :image="item.itemImages[0]" />
        </td>
        <td>{{ item.productNumber }}</td>
        <td>{{ item.makerProductNumber }}</td>
        <td>{{ formatNumber(item.retailPrice) }}</td>
        <td>{{ formatNumber(item.contractedPrice) }}</td>
        <td>{{ item.totalAmount }}</td>
        <td>{{ formatNumber(item.totalPrice) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import sortableMixin from '@/components/organisms/table/mixins/sortableMixin'
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import SortableHeaderCell from '@/components/molecules/table/SortableHeaderCell'
import { ORDER_ASC } from '@/constants/sort'
import { formatNumber } from '@/utils/format'

export default {
  name: 'OrderSalesReportDetailTable',
  components: {
    ItemThumbnail,
    SortableHeaderCell,
  },
  mixins: [sortableMixin],
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    const sortState = {
      totalAmount: ORDER_ASC,
      totalPrice: ORDER_ASC,
    }

    if (this.$route.query.sort) {
      const [column, order] = this.extractQueryParam(this.$route.query.sort)
      sortState[column] = order
    }

    return {
      sortState,
    }
  },
  methods: {
    updateSortView(route, query) {
      this.$emit('sort', query)
    },
    formatNumber(...args) {
      return formatNumber(...args)
    },
  },
}
</script>

<style lang="scss" scoped>
.thumbnail {
  margin: auto;
}
</style>
