<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <LargeTitle>キャンセル処理</LargeTitle>
            <div class="section">
              <div class="row">
                <div class="col s12 right-align mb-2">
                  <ButtonContainer
                    :disabled="checkedItemIndices.length === 0"
                    @click="handleClickCancel"
                    >更新</ButtonContainer
                  >
                </div>
              </div>
              <OrderDetailListTable
                v-model="checkedItemIndices"
                :total-price="order.price"
                :items="orderDetailTableItems"
                :show-checkbox="true"
                :show-agg="false"
              >
                <template #control>削除</template>
              </OrderDetailListTable>
              <Loading :show="$fetchState.pending" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import OrderDetailListTable from '@/components/organisms/table/OrderDetailListTable'
import {
  ORDER_DETAIL_TYPE_ITEM,
  ORDER_DETAIL_TYPE_COUPON,
} from '@/store/orderAggregation'
import { extractValidationError } from '@/plugins/vee-validate'
import { createSequence } from '@/utils/asynchronous'
import FormValidationError from '@/errors/FormValidationError'

const cancellableType = {
  [ORDER_DETAIL_TYPE_ITEM]: 1,
  [ORDER_DETAIL_TYPE_COUPON]: 1,
}

const returnableType = {
  [ORDER_DETAIL_TYPE_ITEM]: 1,
  [ORDER_DETAIL_TYPE_COUPON]: 1,
}

export default {
  name: 'OrderCancelItem',
  components: {
    Breadcrumb,
    LargeTitle,
    ButtonContainer,
    OrderDetailListTable,
  },
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('enum/fetch'),
      this.$store.dispatch('order/fetchOne', { id: this.orderId }),
      this.$store.dispatch('orderDetail/fetch', { orderId: this.orderId }),
    ])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '受注管理',
          route: { name: 'order' },
        },
        {
          name: '詳細',
          route: { name: 'order-id-detail', params: { id: this.orderId } },
        },
        {
          name: 'キャンセル処理',
          route: this.$route,
        },
      ],
      checkedItemIndices: [],
    }
  },
  computed: {
    orderStatusKv() {
      return this.$store.getters['enum/kv']['order/status']
    },
    order() {
      return this.$store.getters['order/find'](this.orderId) ?? {}
    },
    orderDetails() {
      return this.$store.getters['orderDetail/data']
    },
    orderDetailTableItems() {
      const fildterDict = Number(this.order.deliveryed)
        ? returnableType
        : cancellableType

      return (
        this.$store.getters['orderAggregation/orderDetails'][this.orderId] ?? []
      ).filter(({ type }) => fildterDict[type])
    },
  },
  mounted() {
    this.$store.commit('itemDetail/clear')
  },
  methods: {
    async handleClickCancel() {
      if (this.$store.getters['common/loading']) {
        return
      }
      try {
        this.$store.commit('common/loading', true)

        const items = this.checkedItemIndices.map((index) => ({
          ...this.orderDetailTableItems[index],
        }))

        if (!this.validateItemCount(items)) {
          throw new FormValidationError(
            '商品点数を0件に以下に出来ません。注文自体をキャンセルす場合、受注詳細画面より「全キャンセル」を実行してください。'
          )
        }

        const sequence = createSequence(this.createRequests(items), 500)

        await sequence

        this.$store
          .dispatch('orderDetail/fetch', { orderId: this.orderId })
          .catch((error) => {
            this.$toast.error(
              '画面の更新に失敗しました。最新の情報を確認するためにはリロードが必要です。'
            )
            console.error(error)
          })
        this.checkedItemIndices = []
      } catch (error) {
        if (error instanceof FormValidationError) {
          this.$toast.error(error.getMessage())
        }
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    validateItemCount(items) {
      const max = this.orderDetails.length

      const orderDetailParams = items.filter(
        (item) => item.type === ORDER_DETAIL_TYPE_ITEM
      )

      return max > orderDetailParams.length
    },

    createRequests(items) {
      if (Number(this.order.deliveryed)) {
        return [this.returnItem(items)]
      }

      const orderDetailParams = items.filter(
        (item) => item.type === ORDER_DETAIL_TYPE_ITEM
      )
      const couponParams = items.filter(
        (item) => item.type === ORDER_DETAIL_TYPE_COUPON
      )

      const requests = []

      if (orderDetailParams.length > 0) {
        requests.push(this.cancelItem(orderDetailParams))
      }

      return requests.concat(
        couponParams.map((item) => this.cancelCoupon(item))
      )
    },

    cancelItem(items) {
      const ids = items.map(({ orderDetailId }) => orderDetailId)

      return () =>
        this.$store
          .dispatch('orderDetail/cancel', {
            orderId: this.orderId,
            params: { ids },
          })
          .then(() => {
            this.$toast.success('商品をキャンセルしました')
          })
          .catch((error) => {
            const errors = extractValidationError(error)
            const key = Object.keys(errors)[0]
            const message = errors[key]
            this.$toast.error(Array.isArray(message) ? message[0] : message)
          })
    },

    cancelCoupon({ orderUsedCouponId, title }) {
      return () =>
        this.$store
          .dispatch('order/removeCoupon', {
            id: this.orderId,
            params: { orderUsedCouponId },
          })
          .then(() => {
            this.$toast.success(`${title}: キャンセルしました`)
          })
          .catch((error) => {
            const errors = extractValidationError(error)
            const key = Object.keys(errors)[0]
            const message = Array.isArray(errors[key])
              ? errors[key][0]
              : errors[key]
            this.$toast.error(`${title}: ${message}`)
          })
    },

    returnItem(items) {
      const ids = items.map(({ orderDetailId }) => orderDetailId)

      return () =>
        this.$store
          .dispatch('orderDetail/return', {
            orderId: this.orderId,
            params: { ids },
          })
          .then(() => {
            this.$toast.success('商品を返品しました')
          })
          .catch((error) => {
            const errors = extractValidationError(error)
            const key = Object.keys(errors)[0]
            const message = Array.isArray(errors[key])
              ? errors[key][0]
              : errors[key]
            this.$toast.error(message)
          })
    },
  },
}
</script>
