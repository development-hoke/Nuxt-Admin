<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <card-header>
              <template #left>
                <large-title>商品情報編集</large-title>
              </template>
              <template #right>
                <rectangle-sign type="available">{{
                  item ? item.statusText : ''
                }}</rectangle-sign>
                <rectangle-sign type="available">
                  {{ item ? item.reserveText : '' }}
                </rectangle-sign>
              </template>
            </card-header>
            <tab-links :items="tabItems" />
            <nuxt-child />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LargeTitle from '@/components/atoms/title/LargeTitle'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import CardHeader from '@/components/molecules/header/CardHeader'
import RectangleSign from '@/components/atoms/sign/RectangleSign'
import TabLinks from '@/components/molecules/navigation/TabLinks'

export default {
  components: {
    LargeTitle,
    Breadcrumb,
    CardHeader,
    RectangleSign,
    TabLinks,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '商品管理',
          route: { name: 'item' },
        },
        {
          name: '商品情報編集',
        },
      ],
    }
  },
  middleware({ redirect, route }) {
    if (route.name === 'item-edit-id') {
      return redirect({ name: 'item-edit-id-basic' })
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    tabItems() {
      return [
        {
          title: '商品基本情報',
          route: { name: 'item-edit-id-basic', params: { id: this.id } },
        },
        {
          title: '闇市設定',
          route: {
            name: 'item-edit-id-closed-market',
            params: { id: this.id },
          },
        },
        {
          title: '予約販売設定',
          route: { name: 'item-edit-id-reserves', params: { id: this.id } },
        },
      ]
    },
    item() {
      return this.$store.getters['item/find'](this.id)
    },
  },
}
</script>

<style scoped>
.card {
  display: flow-root;
}
</style>
