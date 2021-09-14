<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <card-header>
              <template #left>
                <large-title>企画詳細</large-title>
              </template>
              <template #right>
                <rectangle-sign type="available">{{
                  statusDescription
                }}</rectangle-sign>
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
import { getCleanPath } from '@/utils/routing'

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
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([
      this.$store.dispatch('page/fetchOne', { id }),
      this.$store.dispatch('enum/fetch'),
    ])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '企画管理',
          route: { name: 'plan' },
        },
        {
          name: '企画詳細',
        },
      ],
    }
  },
  middleware({ redirect, route }) {
    if (route.name === 'plan-detail-id') {
      const path = getCleanPath(route.path)
      return redirect(`${path}/basic`)
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    tabItems() {
      return [
        {
          title: '企画基本情報',
          route: { name: 'plan-detail-id-basic', params: { id: this.id } },
        },
        {
          title: '商品一覧掲載設定',
          route: {
            name: 'plan-detail-id-item',
            params: { id: this.id },
          },
        },
      ]
    },
    plan() {
      return this.$store.getters['plan/find'](this.id)
    },
    statusDescription() {
      if (this.plan) {
        return this.$store.getters['plan/statusDescription'](this.plan)
      }
      return null
    },
  },
}
</script>

<style scoped>
.card {
  display: flow-root;
}
</style>
