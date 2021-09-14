<template>
  <div class="row mt-2 mb-1">
    <div class="col s2">注文後の変更処理</div>
    <div class="col s2">
      <a
        class="btn waves-effect waves-light lightrn-1"
        @click.prevent="$emit('cancel')"
        >全キャンセル</a
      >
    </div>
    <div class="col s2">
      <nuxt-link
        :to="{ name: 'order-id-cancel-item', params: { id: orderId } }"
        class="btn waves-effect waves-light lightrn-1"
        >一部キャンセル</nuxt-link
      >
    </div>
    <div class="col s2">
      <nuxt-link
        :to="{ name: 'order-id-add-item', params: { id: orderId } }"
        class="btn waves-effect waves-light lightrn-1"
        >商品の追加</nuxt-link
      >
    </div>
    <div class="col s2">
      <nuxt-link
        :to="{ name: 'order-id-add-coupon', params: { id: orderId } }"
        class="btn waves-effect waves-light lightrn-1"
        >クーポンの追加</nuxt-link
      >
    </div>
    <div class="col s2">
      <nuxt-link
        :to="{ name: 'order-id-change-price', params: { id: orderId } }"
        class="btn waves-effect waves-light lightrn-1"
        style="width: 100%;"
        >金額</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderChangeControlPanel',
  emits: ['cancel'],
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },
}
</script>
