<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <brand-form :inputs="inputs" form-type="create" />
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
  data() {
    return {
      breadcrumbs: [
        {
          name: 'ブランドマスタ',
          route: { name: 'master-brand' },
        },
        {
          name: 'ブランド作成',
          route: { name: 'brand-master-create' },
        },
      ],
      inputs: {
        storeBrand: '',
        section: '',
        name: '',
        kana: '',
        category: '',
        sort: '',
      },
    }
  },
  computed: {},
  created() {},
}
</script>
