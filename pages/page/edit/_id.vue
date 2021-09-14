<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <page-form
          v-if="!$fetchState.pending"
          :inputs="inputs"
          form-type="edit"
          :page-id="pageId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import 'vue2-timepicker/dist/VueTimepicker.css'
import PageForm from '@/components/templates/page/Form'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    PageForm,
    Breadcrumb,
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

    this.inputs = { ...this.page }
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'コンテンツ管理',
          route: { name: 'page' },
        },
        {
          name: '静的ページ編集',
          route: { name: 'page-edit-id', id: this.pageId },
        },
      ],
      inputs: {},
    }
  },
  computed: {
    pageId() {
      return Number(this.$route.params.id)
    },
    page() {
      return this.$store.getters['page/find'](this.pageId)
    },
  },
}
</script>
