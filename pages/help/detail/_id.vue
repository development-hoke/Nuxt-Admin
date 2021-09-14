<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <help-detail v-if="!$fetchState.pending" :help="help" />
      </div>
    </div>
  </div>
</template>

<script>
import HelpDetail from '@/components/templates/help/Detail'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    HelpDetail,
    Breadcrumb,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([this.$store.dispatch('help/fetchOne', { id })])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'お知らせ管理',
          route: { name: 'help' },
        },
        {
          name: '詳細',
          route: { name: 'help-detail-id', id: this.helpId },
        },
      ],
    }
  },
  computed: {
    helpId() {
      return Number(this.$route.params.id)
    },
    help() {
      return this.$store.getters['help/data'].find(
        ({ id }) => Number(id) === this.helpId
      )
    },
  },
}
</script>
