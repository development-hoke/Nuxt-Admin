<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading v-if="$fetchState.pending"></Loading>
        <help-form v-else :inputs="inputs" form-type="create" />
      </div>
    </div>
  </div>
</template>

<script>
import HelpForm from '@/components/templates/help/Form'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import Loading from '@/components/atoms/preloader/Circular'

export default {
  components: {
    HelpForm,
    Breadcrumb,
    Loading,
  },
  async fetch() {
    await this.$store.dispatch('helpCategory/fetch')
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'ヘルプ管理',
          route: { name: 'help' },
        },
        {
          name: 'ヘルプ作成',
          route: { name: 'help-create' },
        },
      ],
      inputs: {
        title: '',
        body: '',
        sort: '',
        isFaq: false,
        helpCategories: [],
      },
    }
  },
  computed: {},
  created() {},
}
</script>
