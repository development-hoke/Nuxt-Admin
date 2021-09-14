<template>
  <div class="wrapper">
    <table class="bordered striped">
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
          <th>色番</th>
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
          <td>
            <nuxt-link
              :to="{ name: 'item-edit-id-basic', params: { id: item.id } }"
              >{{ item.productNumber }}</nuxt-link
            >
          </td>
          <td>{{ item.makerProductNumber }}</td>
          <td>{{ formatNumber(item.retailPrice) }}</td>
          <td>{{ formatNumber(item.contractedPrice) }}</td>
          <td>{{ item.totalAmount }}</td>
          <td>
            <tr>
              <template v-for="itemDetail in item.itemDetails">
                <th
                  v-if="itemDetail.amount > 0"
                  :key="itemDetail.id"
                  class="color-num"
                >
                  {{ itemDetail.colorId }}
                </th>
              </template>
            </tr>
            <tr>
              <template v-for="itemDetail in item.itemDetails">
                <td
                  v-if="itemDetail.amount > 0"
                  :key="itemDetail.id"
                  class="color-num"
                >
                  {{ itemDetail.amount }}
                </td>
              </template>
            </tr>
          </td>
          <td>{{ formatNumber(item.totalPrice) }}</td>
        </tr>
        <NoDataTableRow v-if="items.length === 0" />
      </tbody>
    </table>
  </div>
</template>

<script>
import sortableMixin from '@/components/organisms/table/mixins/sortableMixin'
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import SortableHeaderCell from '@/components/molecules/table/SortableHeaderCell'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'
import { ORDER_ASC } from '@/constants/sort'
import { formatNumber } from '@/utils/format'

export default {
  name: 'ItemSalesReportTable',
  components: {
    ItemThumbnail,
    SortableHeaderCell,
    NoDataTableRow,
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

    const defaultSort =
      this.$route.query.sort ??
      this.$store.getters['salesAggregation/item/requestParams'].sort

    if (defaultSort) {
      const [column, order] = this.extractQueryParam(defaultSort)
      sortState[column] = order
    }

    return {
      sortState,
    }
  },
  methods: {
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
