<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <page-detail v-if="!$fetchState.pending" :page="page" />
      </div>
    </div>
  </div>
</template>

<script>
import PageDetail from '@/components/templates/page/Detail'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    PageDetail,
    Breadcrumb,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([this.$store.dispatch('page/fetchOne', { id })])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'お知らせ管理',
          route: { name: 'page' },
        },
        {
          name: '詳細',
          route: { name: 'page-detail-id', id: this.pageId },
        },
      ],
    }
  },
  computed: {
    pageId() {
      return Number(this.$route.params.id)
    },
    page() {
      return this.$store.getters['page/data'].find(
        ({ id }) => Number(id) === this.pageId
      )
    },
  },
}
</script>
