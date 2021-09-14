<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <brand-detail v-if="!$fetchState.pending" :brand="brand" />
      </div>
    </div>
  </div>
</template>

<script>
import BrandDetail from '@/components/templates/brand/Detail'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    BrandDetail,
    Breadcrumb,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([this.$store.dispatch('brand/fetchOne', { id })])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'ブランドマスタ',
          route: { name: 'master-brand' },
        },
        {
          name: 'ブランド編集',
          route: { name: 'master-brand-detail-id', id: this.brandId },
        },
      ],
    }
  },
  computed: {
    brandId() {
      return Number(this.$route.params.id)
    },
    brand() {
      return this.$store.getters['brand/data'].find(
        ({ id }) => Number(id) === this.brandId
      )
    },
  },
}
</script>
