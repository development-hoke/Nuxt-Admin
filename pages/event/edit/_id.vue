<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <event-form
          v-if="!$fetchState.pending"
          :inputs="inputs"
          form-type="edit"
          :event-id="eventId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import 'vue2-timepicker/dist/VueTimepicker.css'
import EventForm from '@/components/templates/event/Form'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import { splitDatetime } from '@/utils/prop'
import { createNewItem } from '@/components/templates/event/form/basic/BundleInfo'

export default {
  components: {
    EventForm,
    Breadcrumb,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([
      this.$store.dispatch('event/fetchOne', { id }),
      this.$store.dispatch('enum/fetch'),
    ])

    this.initializeInputs()
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'イベント管理',
          route: { name: 'event' },
        },
        {
          name: '編集',
          route: { name: 'event-edit-id', id: this.eventId },
        },
      ],
      inputs: {},
    }
  },
  computed: {
    eventId() {
      return Number(this.$route.params.id)
    },
    event() {
      return this.$store.getters['event/data'].find(
        ({ id }) => Number(id) === this.eventId
      )
    },
  },
  methods: {
    extractDatetimeParams(datetime) {
      return splitDatetime(datetime)
    },
    initializeInputs() {
      this.inputs = {
        ...this.event,
        eventBundleSales: this.event.eventBundleSales.length
          ? [...this.event.eventBundleSales.map((data) => ({ ...data }))]
          : [createNewItem()],
      }
    },
  },
}
</script>
