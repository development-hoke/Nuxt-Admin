<template>
  <table class="bordered striped">
    <tbody>
      <tr>
        <td colspan="2">受注コード</td>
        <td colspan="2">
          {{ order.code
          }}<spam v-if="order.isGuest" class="ml-1">（ゲスト購入）</spam>
        </td>
      </tr>
      <tr>
        <td colspan="2">受注日時</td>
        <td colspan="2">
          {{ dayjs(order.orderDate).format('YYYY/MM/DD HH:mm:ss') }}
        </td>
      </tr>
      <tr>
        <td colspan="2">ステータス</td>
        <td colspan="2">{{ statusValueLabel[order.status] }}</td>
      </tr>
      <tr>
        <td rowspan="6" style="width: 20%;"></td>
        <td>注文</td>
        <td colspan="2">{{ orderTypeValueLabel[order.orderType] }}</td>
      </tr>
      <tr>
        <td>決済</td>
        <td colspan="2">{{ paymentTypeValueLabel[order.paymentType] }}</td>
      </tr>
      <tr>
        <td>配送</td>
        <td colspan="2">{{ deliveryTypeValueLabel[order.deliveryType] }}</td>
      </tr>
      <tr>
        <td>入金</td>
        <td>{{ orderLabels.paid[order.paid] }}</td>
        <td>
          <template v-if="order.paidDate">{{
            dayjs(order.paidDate).format('YYYY/MM/DD')
          }}</template>
        </td>
      </tr>
      <tr>
        <td>検品</td>
        <td>{{ orderLabels.inspected[order.inspected] }}</td>
        <td>
          <template v-if="order.inspectedDate">{{
            dayjs(order.inspectedDate).format('YYYY/MM/DD')
          }}</template>
        </td>
      </tr>
      <tr>
        <td>発送</td>
        <td>{{ orderLabels.deliveryed[order.deliveryed] }}</td>
        <td>
          <template v-if="order.deliveryedDate">{{
            dayjs(order.deliveryedDate).format('YYYY/MM/DD')
          }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import orderLabels from '@/assets/label/order'

export default {
  name: 'OrderInfoTable',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      orderLabels,
    }
  },
  computed: {
    ...mapGetters({
      enumValueLabel: 'enum/valueLabel',
    }),
    paymentTypeValueLabel() {
      return this.enumValueLabel['order/paymentType'] ?? {}
    },
    deliveryTypeValueLabel() {
      return this.enumValueLabel['order/deliveryType'] ?? {}
    },
    deliveryTimeValueLabel() {
      return this.enumValueLabel['order/deliveryTime'] ?? {}
    },
    orderTypeValueLabel() {
      return this.enumValueLabel['order/orderType'] ?? {}
    },
    statusValueLabel() {
      return this.enumValueLabel['order/status'] ?? {}
    },
  },
  methods: {
    dayjs(...args) {
      return dayjs(...args)
    },
  },
}
</script>
