<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <information-form
          v-if="!$fetchState.pending"
          :inputs="inputs"
          form-type="edit"
          :information-id="informationId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import 'vue2-timepicker/dist/VueTimepicker.css'
import InformationForm from '@/components/templates/information/Form'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    InformationForm,
    Breadcrumb,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([
      this.$store.dispatch('information/fetchOne', { id }),
      this.$store.dispatch('enum/fetch'),
    ])

    this.initializeInputs()
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'お知らせ管理',
          route: { name: 'information' },
        },
        {
          name: '編集',
          route: { name: 'information-edit-id', id: this.informationId },
        },
      ],
      inputs: {},
    }
  },
  computed: {
    informationId() {
      return Number(this.$route.params.id)
    },
    information() {
      return this.$store.getters['information/data'].find(
        ({ id }) => Number(id) === this.informationId
      )
    },
  },
  methods: {
    extractDatetimeParams(datetime) {
      if (!datetime) {
        return [null, null]
      }

      return datetime.split(' ')
    },
    initializeInputs() {
      const params = { ...this.information }
      const [publishAtDate, publishAtTime] = this.extractDatetimeParams(
        params.publishAt
      )

      params.publishAtDate = publishAtDate
      params.publishAtTime = publishAtTime

      this.inputs = params
    },
  },
}
</script>
