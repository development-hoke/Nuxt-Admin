<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <help-form
          v-if="!$fetchState.pending"
          :inputs="inputs"
          form-type="edit"
          :help-id="helpId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HelpForm from '@/components/templates/help/Form'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    HelpForm,
    Breadcrumb,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([
      this.$store.dispatch('help/fetchOne', { id }),
      this.$store.dispatch('helpCategory/fetch'),
      this.$store.dispatch('enum/fetch'),
    ])

    this.inputs = { ...this.help }
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'ヘルプ管理',
          route: { name: 'help' },
        },
        {
          name: 'ヘルプ編集',
          route: { name: 'help-edit-id', id: this.helpId },
        },
      ],
      inputs: {},
    }
  },
  computed: {
    helpId() {
      return Number(this.$route.params.id)
    },
    help() {
      return this.$store.getters['help/find'](this.helpId)
    },
  },
}
</script>
