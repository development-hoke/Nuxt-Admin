<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <Loading :show="$fetchState.pending" />
        <event-detail v-if="!$fetchState.pending" :event="event" />
      </div>
    </div>
  </div>
</template>

<script>
import EventDetail from '@/components/templates/event/Detail'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'

export default {
  components: {
    EventDetail,
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
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'イベント管理',
          route: { name: 'event' },
        },
        {
          name: '詳細',
          route: { name: 'event-edit-id', id: this.eventId },
        },
      ],
    }
  },
  computed: {
    eventId() {
      return Number(this.$route.params.id)
    },
    event() {
      return this.$store.getters['event/find'](this.eventId)
    },
  },
}
</script>
