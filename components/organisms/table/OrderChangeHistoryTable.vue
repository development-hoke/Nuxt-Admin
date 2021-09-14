<template>
  <table class="bordered striped">
    <thead>
      <tr>
        <th></th>
        <th>部門番号</th>
        <th>メーカー品番</th>
        <th>部門</th>
        <th>商品グループ</th>
        <th>商品名</th>
        <th>色・サイズ</th>
        <th>販売価格</th>
        <th>数量</th>
        <th>担当</th>
        <th>変更日付</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in displayingItems" :key="index">
        <td>
          <ItemThumbnail
            v-if="item.isItemEvent"
            :url="item.imageUrl"
            :alt="item.imageAlt"
          />
        </td>
        <td>{{ item.title }}</td>
        <td>{{ item.makerProductNumber }}</td>
        <td>{{ item.departmentName }}</td>
        <td>{{ item.categoryName }}</td>
        <td>{{ item.itemName }}</td>
        <td>{{ item.colorAndSize }}</td>
        <td :class="{ 'pink-text': item.price < 0 }">
          {{ formatNumber(item.price) }}
        </td>
        <td :class="{ 'pink-text': item.amount < 0 }">{{ item.amount }}</td>
        <td>{{ item.staffName }}</td>
        <td>{{ dayjs(item.createdAt).format('YY/MM/DD') }}</td>
      </tr>
      <tr>
        <td colspan="8">注文時 &nbsp; 合計金額</td>
        <td colspan="4" :class="{ 'pink-text': totalPrice < 0 }">
          {{ yen(totalPrice) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import dayjs from 'dayjs'
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import { formatNumber, yen } from '@/utils/format'
import { computeTotalAmount } from '@/utils/aggregating'

export default {
  name: 'OrderChangeHistoryTable',
  components: {
    ItemThumbnail,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    totalPrice() {
      return computeTotalAmount(this.items)
    },
    displayingItems() {
      return this.items.filter(({ price }) => Number(price) !== 0)
    },
  },
  methods: {
    dayjs(...args) {
      return dayjs(...args)
    },
    yen(...args) {
      return yen(...args)
    },
    formatNumber(...args) {
      return formatNumber(...args)
    },
  },
}
</script>
