<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />
    <Loading :show="$fetchState.pending" />
    <div v-if="!$fetchState.pending" class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <div class="row mb-2">
              <div class="col s2">
                <SmallTitle>注文情報</SmallTitle>
              </div>
              <div class="col s10">
                <div class="row mb-2">
                  <div class="col s6">
                    <OrderInfoTable :order="order" />
                  </div>
                  <div class="col s6">
                    <OrderInfoForm :default-inputs="order" />
                  </div>
                </div>
                <div class="row mb-2">
                  <div class="col s12">
                    <OrderDetailListTable
                      :total-price="order.price"
                      :items="orderDetailTableItems"
                    />
                  </div>
                </div>
                <OrderChangeControlPanel
                  class="mt-2 mb-1"
                  :order-id="orderId"
                  @cancel="handleCancel"
                />
                <div v-if="orderCancelMessage">
                  <ErrorMessage>{{ orderCancelMessage }}</ErrorMessage>
                </div>
                <div class="row mb-2">
                  <div class="col s12">
                    <OrderChangeHistoryTable :items="changeHistories" />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col s2 mt-4">
                <SmallTitle>発送先情報</SmallTitle>
              </div>
              <div class="col s10">
                <div class="row mb-1">
                  <div class="col s8">
                    <OrderDeliveryInfoTable class="mt-7" :order="order" />
                  </div>
                  <div class="col s4">
                    <OrderDeliveryInfoForm
                      :order="order"
                      :pref-options="prefOptions"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col s2">
                <SmallTitle>お客様情報</SmallTitle>
              </div>
              <div class="col s10">
                <div class="row mb-1">
                  <div class="col s8">
                    <OrderCustomerInfo
                      :member="order.member"
                      :pref-dict="prefDict"
                    />
                  </div>
                  <div
                    v-if="Number(order.member && order.member.blackStatus)"
                    class="col s4"
                  >
                    <div class="black-user">
                      【ブラックリスト注意事項】<br />
                      検品注意してください。
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col s2">
                <SmallTitle>送信メール履歴</SmallTitle>
              </div>
              <div class="col s10">
                <div class="row mb-1">
                  <div class="col s8">
                    <OrderMessageListTable
                      :messages="order.orderMessages"
                      :order-id="orderId"
                    />
                  </div>
                  <div class="col s4">
                    <nuxt-link
                      class="btn waves-effect waves-light"
                      :to="{
                        name: 'order-id-messages-create',
                        params: { id: orderId },
                      }"
                      >＋新規メッセージ作成</nuxt-link
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col s2">
                <SmallTitle>通信欄</SmallTitle>
              </div>
              <OrderTextareaFormContainer
                class="col s10"
                :order-id="orderId"
                parameter-name="memo1"
                parameter-display-name="通信欄"
                :default-value="order.memo1"
              />
            </div>
            <div class="row mb-2">
              <div class="col s2">
                <SmallTitle>お客様への連絡事項</SmallTitle>
              </div>
              <OrderTextareaFormContainer
                class="col s10"
                :order-id="orderId"
                parameter-name="memo2"
                parameter-display-name="お客様への連絡事項"
                :default-value="order.memo2"
              />
            </div>
            <div class="row mb-2">
              <div class="col s2">
                <SmallTitle>ショップメモ</SmallTitle>
              </div>
              <OrderTextareaFormContainer
                class="col s10"
                :order-id="orderId"
                parameter-name="shopMemo"
                parameter-display-name="ショップメモ"
                :default-value="order.shopMemo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmModal
      ref="confirmModal"
      type="danger"
      @ok="events.emit('confirmed', true)"
      @cancel="events.emit('confirmed', false)"
    />
  </div>
</template>

<script>
import EventEmitter from 'events'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import SmallTitle from '@/components/atoms/title/SmallTitle'
import OrderInfoTable from '@/components/organisms/table/OrderInfoTable'
import OrderInfoForm from '@/components/organisms/form/OrderInfoForm'
import OrderDetailListTable from '@/components/organisms/table/OrderDetailListTable'
import OrderChangeControlPanel from '@/components/organisms/panel/OrderChangeControlPanel'
import OrderChangeHistoryTable from '@/components/organisms/table/OrderChangeHistoryTable'
import OrderDeliveryInfoTable from '@/components/organisms/table/OrderDeliveryInfoTable'
import OrderDeliveryInfoForm from '@/components/organisms/form/OrderDeliveryInfoForm'
import OrderCustomerInfo from '@/components/organisms/table/OrderCustomerInfo'
import OrderMessageListTable from '@/components/organisms/table/OrderMessageListTable'
import OrderTextareaFormContainer from '@/components/organisms/form/OrderTextareaFormContainer'
import ErrorMessage from '@/components/atoms/notice/ErrorMessage'
import { extractValidationError } from '@/plugins/vee-validate'
import ConfirmModal from '@/components/organisms/modal/ConfirmModal'

export default {
  name: 'OrderDetail',
  components: {
    Breadcrumb,
    SmallTitle,
    OrderInfoTable,
    OrderInfoForm,
    OrderDetailListTable,
    OrderChangeControlPanel,
    OrderChangeHistoryTable,
    OrderDeliveryInfoTable,
    OrderDeliveryInfoForm,
    OrderCustomerInfo,
    OrderMessageListTable,
    OrderTextareaFormContainer,
    ErrorMessage,
    ConfirmModal,
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
      this.$store.dispatch('master/fetchPrefs'),
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
          route: this.$route,
        },
      ],
      orderCancelMessage: '',
      events: new EventEmitter(),
    }
  },
  computed: {
    prefOptions() {
      return this.$store.getters['master/prefOptions']
    },
    prefDict() {
      return this.$store.getters['master/prefDict']
    },
    order() {
      return this.$store.getters['order/find'](this.orderId)
    },
    orderDetailTableItems() {
      return (
        this.$store.getters['orderAggregation/orderDetails'][this.orderId] ?? []
      )
    },
    changeHistories() {
      return this.$store.getters['orderAggregation/changeHistories'][
        this.orderId
      ]
    },
  },
  methods: {
    async handleCancel() {
      if (this.$store.getters['common/loading']) {
        return
      }

      this.orderCancelMessage = ''

      this.$refs.confirmModal.open({
        message: 'この受注をキャンセルしますがよろしいですか？',
      })

      const confirmation = await new Promise((resolve) =>
        this.events.once('confirmed', resolve)
      )

      this.$refs.confirmModal.close()

      if (!confirmation) {
        return
      }

      const deliveryed = Boolean(Number(this.order.deliveryed))

      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch(
          deliveryed ? 'order/return' : 'order/cancel',
          {
            id: this.orderId,
          }
        )

        this.$toast.success('注文をキャンセルしました')
      } catch (error) {
        console.error(error)
        const { global } = extractValidationError(error)
        this.orderCancelMessage = global[0] || '送信に失敗しました。'
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep input,
::v-deep select {
  height: 40px !important;
  border: 0.5px solid #03a9f4 !important;
  text-align: center;
  margin: 0 !important;
  padding: 10px;
}
::v-deep textarea {
  border: 0.5px solid #03a9f4 !important;
  padding-left: 6px;
  padding-right: 6px;
}
::v-deep input:focus,
::v-deep textarea:focus {
  border-bottom: none !important;
}
::v-deep .blank-modify-input {
  height: 55px;
}
::v-deep .modify-input {
  padding: 5px 0;
}

::v-deep .modify-input-1 {
  padding: 7px 0;
}
.black-user {
  border: 1px solid #e91e63;
  color: #e91e63;
  border-radius: 7px;
  padding: 16px;
  text-align: center;
}
</style>
