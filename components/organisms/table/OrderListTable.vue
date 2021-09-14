<template>
  <table class="bordered striped">
    <thead>
      <tr>
        <th>受注コード</th>
        <th>受注日時</th>
        <th>顧客名</th>
        <th>決済種別</th>
        <th>配送</th>
        <th>通信欄</th>
        <th>お届け先</th>
        <th>お届け希望日</th>
        <th>請求金額</th>
        <th>注文</th>
        <th>入金st</th>
        <th>入金日</th>
        <th>発送st</th>
        <th>発送日</th>
        <th>ステータス</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items"
        :key="item.id"
        :class="{
          'black-user': Number(item.member && item.member.blackStatus),
        }"
      >
        <td class="order-code">
          <nuxt-link
            :to="{ name: 'order-id-detail', params: { id: item.id } }"
            >{{ item.code }}</nuxt-link
          >
        </td>
        <td>{{ dayjs(item.orderDate).format('YYYY/MM/DD HH:mm') }}</td>
        <td class="member-name">
          {{ getMemberName(item) }}
        </td>
        <td>{{ paymentTypeValueLabel[item.paymentType] }}</td>
        <td>{{ deliveryTypeValueLabel[item.deliveryType] }}</td>
        <td>{{ item.memo1 }}</td>
        <td>{{ item.deliveryAddress.pref.name }}</td>
        <td>{{ deliveryTimeValueLabel[item.deliveryHopeTime] }}</td>
        <td>{{ yen(item.price) }}</td>
        <td>{{ orderTypeValueLabel[item.orderType] }}</td>
        <td>{{ orderLabels.paid[item.paid] }}</td>
        <td>
          {{
            item.paidDate ? dayjs(item.paidDate).format('YYYY/MM/DD HH:mm') : ''
          }}
        </td>
        <td>{{ orderLabels.deliveryed[item.deliveryed] }}</td>
        <td>
          {{
            item.deliveryedDate
              ? dayjs(item.deliveryedDate).format('YYYY/MM/DD HH:mm')
              : ''
          }}
        </td>
        <td>{{ statusValueLabel[item.status] }}</td>
      </tr>
      <NoDataTableRow v-if="items.length === 0" />
    </tbody>
  </table>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import orderLabels from '@/assets/label/order'
import { yen } from '@/utils/format'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'

export default {
  name: 'OrderListTable',
  components: {
    NoDataTableRow,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
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
    yen(...args) {
      return yen(args)
    },
    getMemberName(item) {
      if (!item.member) {
        return ''
      }
      return `${item.member.lname} ${item.member.fname} ${item.member.lkana} ${item.member.fkana}`
    },
  },
}
</script>

<style lang="scss" scoped>
tr.black-user {
  .order-code a {
    color: #e91e63;
  }
  .member-name {
    color: #e91e63;
  }
}
</style>
