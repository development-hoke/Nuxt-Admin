<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <page-form :inputs="inputs" form-type="create" />
      </div>
    </div>
  </div>
</template>

<script>
import PageForm from '@/components/templates/page/Form'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    PageForm,
    Breadcrumb,
  },
  async fetch({ store }) {
    await store.dispatch('enum/fetch')
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'ページ管理',
          route: { name: 'page' },
        },
        {
          name: '静的ページ作成',
          route: { name: 'page-create' },
        },
      ],
      inputs: {
        title: '',
        slug: '',
        body: '',
        status: false,
        publishFrom: null,
        publishTo: null,
      },
    }
  },
  computed: {},
}
</script>
