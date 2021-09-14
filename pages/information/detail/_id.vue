<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <information-detail
          v-if="!$fetchState.pending"
          :information="information"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InformationDetail from '@/components/templates/information/Detail'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    InformationDetail,
    Breadcrumb,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([this.$store.dispatch('information/fetchOne', { id })])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'お知らせ管理',
          route: { name: 'information' },
        },
        {
          name: '詳細',
          route: { name: 'information-detail-id', id: this.informationId },
        },
      ],
    }
  },
  computed: {
    informationId() {
      return Number(this.$route.params.id)
    },
    information() {
      return this.$store.getters['information/data'].find(
        ({ id }) => Number(id) === this.informationId
      )
    },
  },
}
</script>
