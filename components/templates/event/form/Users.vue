<template>
  <div>
    <div class="row">
      <radio-box
        v-model="inputs.targetUserType"
        class="col s12"
        :options="targetUserTypeOptions"
        input-class="form-control"
        direction="vertical"
        name="targetUserType"
      />
    </div>
    <div class="row">
      <FileInputGroup
        class="col s12 file-import"
        :disabled="loading"
        @input="handleInputCsv"
      >
        <template #button>一括登録</template>
      </FileInputGroup>
    </div>
    <NoticeList class="row" />
    <div class="row mb-2">
      <div class="col s12">
        <table class="bordered">
          <thead>
            <tr>
              <th data-field="id">会員ID</th>
              <th data-field="name">会員名</th>
              <th data-field="email">メールアドレス</th>
              <th data-field="action"></th>
            </tr>
          </thead>
          <tbody>
            <event-user-item
              v-for="eventUser in eventUsers"
              :key="eventUser.id"
              :event-user="eventUser"
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
import EventUserItem from '@/components/templates/event/form/users/EventUserItem'
import RadioBox from '@/components/molecules/form/RadioBox'
import FileInputGroup from '@/components/molecules/input/FileInputGroup'
import Pagination from '@/components/molecules/pagination/Pagination'
import api from '@/api'
import { extractValidationError } from '@/plugins/vee-validate'

export default {
  name: 'EventUsers',
  components: {
    EventUserItem,
    FileInputGroup,
    RadioBox,
    Pagination,
  },
  props: {
    inputs: {
      type: Object,
      required: true,
    },
  },
  async fetch() {
    if (this.$route.name === 'event-create') {
      return
    }
    const { id } = this.$route.params
    const params = this.$route.query
    await this.$store.dispatch('eventUser/fetch', { eventId: id, params })
  },
  data() {
    return {
      openCsvInput: false,
    }
  },
  computed: {
    eventId() {
      return this.$route.params.id
    },
    event() {
      return this.$store.getters['event/find'](this.eventId)
    },
    eventUsers() {
      return this.$store.getters['eventUser/data']
    },
    pagination() {
      return this.$store.getters['eventUser/pagination']
    },
    targetUserTypeOptions() {
      return this.$store.getters['enum/options']['event/targetUserType']
    },
    loading() {
      return this.$store.getters['common/loading']
    },
  },
  methods: {
    async handleInputCsv(input) {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        this.$store.commit('notice/clearAll')

        const { data } = await api.eventUser.createByCsv(this.eventId, {
          content: input.base64,
        })

        if (data.failed.length > 0) {
          this.$toast.warning('一部のデータを取り込めませんでした。')
          this.$store.commit('notice/putError', data.failed)
        } else {
          this.$toast.success('アップロードが完了しました。')
        }

        await this.$store.dispatch('eventUser/fetch', { eventId: this.eventId })
      } catch (error) {
        console.error(error)

        const { global } = extractValidationError(error)
        const errorString = global || []
        this.$toast.error(...errorString)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.file-import {
  margin: 1rem 0;
  text-align: right;
}
</style>
