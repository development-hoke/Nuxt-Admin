<template>
  <div class="container">
    <div class="row">
      <div class="col s12">
        <h6>対象ユーザータイプ</h6>
        <p>{{ targetUserTypeDict[event.targetUserType] }}</p>
      </div>
    </div>
    <div v-if="event.targetUserType === targetUserType.limit" class="row mb-2">
      <div class="col s12">
        <table>
          <thead>
            <tr>
              <th>会員ID</th>
              <th>会員名</th>
              <th>メールアドレス</th>
            </tr>
          </thead>
          <tbody>
            <EventUserItem
              v-for="eventUser in eventUsers"
              :key="eventUser.id"
              :event-user="eventUser"
              :show-controller="false"
            />
          </tbody>
        </table>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s12 pagination">
        <Pagination
          :total-count="pagination.total"
          :current-page="pagination.currentPage"
          :per-page="pagination.perPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/molecules/pagination/Pagination'
import EventUserItem from '@/components/templates/event/form/users/EventUserItem'

export default {
  name: 'EventUsers',
  components: {
    EventUserItem,
    Pagination,
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  async fetch() {
    const { id } = this.$route.params
    const params = this.$route.query
    await this.$store.dispatch('eventUser/fetch', { eventId: id, params })
  },
  computed: {
    eventUsers() {
      return this.$store.getters['eventUser/data']
    },
    pagination() {
      return this.$store.getters['eventUser/pagination']
    },
    targetUserType() {
      return this.$store.getters['enum/kv']['event/targetUserType'] || {}
    },
    targetUserTypeDict() {
      return (
        this.$store.getters['enum/valueLabel']['event/targetUserType'] || {}
      )
    },
  },
}
</script>

<style scoped>
.row {
  margin-top: 22px;
}
</style>
