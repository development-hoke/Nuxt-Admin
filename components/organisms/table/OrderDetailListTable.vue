<template>
  <table class="bordered striped">
    <thead>
      <tr>
        <th></th>
        <th>部門番号</th>
        <th>商品番号</th>
        <th>メーカー品番</th>
        <th>部門</th>
        <th>商品グループ</th>
        <th>商品名</th>
        <th>色・サイズ</th>
        <th>販売価格</th>
        <th>数量</th>
        <th v-if="showCheckbox"><slot name="control"></slot></th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, index) in items">
        <tr v-if="item.amount > 0" :key="index">
          <td>
            <template v-if="item.type === ORDER_DETAIL_TYPE_ITEM">
              <ItemThumbnail :url="item.imageUrl" :alt="item.imageAlt" />
            </template>
          </td>
          <td>{{ item.title }}</td>
          <td>{{ item.productNumber }}</td>
          <td>{{ item.makerProductNumber }}</td>
          <td>{{ item.departmentName }}</td>
          <td>{{ item.rootCategories }}</td>
          <td>{{ item.itemName }}</td>
          <td>{{ item.colorAndSize }}</td>
          <td :class="{ 'pink-text': item.price < 0 }">
            {{ formatNumber(item.price) }}
          </td>
          <td>{{ item.amount }}</td>
          <td v-if="showCheckbox">
            <label class="order-detail-list-table-checkbox">
              <input
                :checked="inputs[index]"
                type="checkbox"
                @input="($event) => handleCheck(index, $event)"
              />
              <span></span>
            </label>
          </td>
        </tr>
      </template>
      <tr v-if="showAgg">
        <td colspan="6">注文時 &nbsp; 合計金額</td>
        <td :colspan="3 + Number(showCheckbox)">{{ yen(innerTotalPrice) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import { yen, formatNumber } from '@/utils/format'
import { computeTotalAmount } from '@/utils/aggregating'
import { ORDER_DETAIL_TYPE_ITEM } from '@/store/orderAggregation'

export default {
  name: 'OrderDetailListTable',
  components: {
    ItemThumbnail,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    totalPrice: {
      type: Number,
      default: null,
    },
    showAgg: {
      type: Boolean,
      default: true,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ORDER_DETAIL_TYPE_ITEM,
    }
  },
  computed: {
    innerTotalPrice() {
      return this.totalPrice ?? computeTotalAmount(this.items)
    },
    inputs() {
      return this.value.reduce(
        (inputs, index) => ({ ...inputs, [index]: true }),
        {}
      )
    },
  },
  methods: {
    yen(...args) {
      return yen(...args)
    },
    formatNumber(...args) {
      return formatNumber(...args)
    },
    handleCheck(index, event) {
      const inputs = { ...this.inputs, [index]: event.target.checked }

      const checked = Object.keys(inputs)
        .filter((index) => inputs[index])
        .map(Number)

      this.$emit('input', checked)
    },
  },
}
</script>

<style lang="scss" scoped>
.order-detail-list-table-checkbox {
  margin-left: 10px;
}
</style>
