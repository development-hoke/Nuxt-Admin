<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <information-form :inputs="inputs" form-type="create" />
      </div>
    </div>
  </div>
</template>

<script>
import InformationForm from '@/components/templates/information/Form'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    InformationForm,
    Breadcrumb,
  },
  async fetch({ store }) {
    await store.dispatch('enum/fetch')
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'お知らせ管理',
          route: { name: 'information' },
        },
        {
          name: 'お知らせ作成',
          route: { name: 'information-create' },
        },
      ],
      inputs: {},
    }
  },
  computed: {},
  created() {
    this.inputs = {
      title: '',
      body: '',
      publishAtDate: null,
      publishAtTime: null,
      publishAt: null,
      priority: '',
      isStoreTop: false,
      status: false,
    }
  },
}
</script>
