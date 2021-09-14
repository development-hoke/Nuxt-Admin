<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <brand-form
          v-if="!$fetchState.pending"
          :inputs="inputs"
          form-type="edit"
          :brand-id="brandId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BrandForm from '@/components/templates/brand/Form'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    BrandForm,
    Breadcrumb,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([
      this.$store.dispatch('brand/fetchOne', { id }),
      this.$store.dispatch('enum/fetch'),
    ])

    this.inputs = { ...this.brand }
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
          route: { name: 'master-brand-edit-id', id: this.brandId },
        },
      ],
      inputs: {},
    }
  },
  computed: {
    brandId() {
      return Number(this.$route.params.id)
    },
    brand() {
      return this.$store.getters['brand/find'](this.brandId)
    },
  },
}
</script>
