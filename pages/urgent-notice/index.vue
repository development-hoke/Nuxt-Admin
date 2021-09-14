<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <urgent-notice-form
          v-if="!$fetchState.pending"
          :inputs="inputs"
          :urgent-notice-id="urgentNoticeId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UrgentNoticeForm from '@/components/templates/urgentNotice/Form'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    UrgentNoticeForm,
    Breadcrumb,
  },
  async fetch() {
    await this.$store.dispatch('urgentNotice/fetch')
    this.initializeInputs()
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '緊急お知らせ管理',
          route: { name: 'urgentNotice' },
        },
      ],
      inputs: {},
      urgentNoticeId: '',
    }
  },
  computed: {
    urgentNotice() {
      return this.$store.getters['urgentNotice/data']
    },
  },
  methods: {
    initializeInputs() {
      this.inputs = { ...this.urgentNotice }
      this.urgentNoticeId = this.inputs.id
    },
  },
}
</script>
