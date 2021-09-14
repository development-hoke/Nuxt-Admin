<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <plan-form :inputs="inputs" form-type="create" />
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import PlanForm from '@/components/templates/plan/Form'

export default {
  components: {
    PlanForm,
    Breadcrumb,
  },
  async fetch({ store }) {
    await store.dispatch('enum/fetch')
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '企画管理',
          route: { name: 'plan' },
        },
        {
          name: '企画作成',
          route: { name: 'plan-create' },
        },
      ],
      inputs: {
        title: '',
        storeBrand: null,
        slug: '',
        status: false,
        periodFrom: null,
        periodTo: null,
        thumbnail: '',
        place: null,
        body: '',
        item: [],
      },
    }
  },
  computed: {},
}
</script>
