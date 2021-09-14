<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <large-title>イベント一覧</large-title>
              <div class="row">
                <div class="new-create-btn">
                  <nuxt-link
                    class="btn waves-effect waves-light lightrn-1"
                    :to="{ name: 'event-create' }"
                    >新規作成</nuxt-link
                  >
                </div>
              </div>
              <div class="row">
                <div class="col s12">
                  <table class="bordered">
                    <thead>
                      <tr>
                        <th data-field="event-name">タイトル名</th>
                        <th data-field="status">公開ステータス</th>
                        <th data-field="start-date">開始日時</th>
                        <th data-field="end-date">終了日時</th>
                        <th data-field="action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="event in events" :key="event.id">
                        <td>{{ event.title }}</td>
                        <td>{{ commonStatusDict[Number(event.published)] }}</td>
                        <td>
                          {{
                            dayjs(event.periodFrom).format('YYYY/MM/DD HH:mm')
                          }}
                        </td>
                        <td>
                          {{ dayjs(event.periodTo).format('YYYY/MM/DD HH:mm') }}
                        </td>
                        <td>
                          <div class="sub-btns">
                            <nuxt-link
                              :to="{
                                name: 'event-detail-id',
                                params: { id: event.id },
                              }"
                              class="btn waves-effect waves-light lightrn-1"
                              >詳細</nuxt-link
                            >
                            <a
                              class="btn waves-effect waves-light dark"
                              @click.prevent="handleClickCopy(event.id)"
                              >複製</a
                            >
                            <nuxt-link
                              :to="{
                                name: 'event-edit-id',
                                params: { id: event.id },
                              }"
                              class="btn waves-effect waves-light purple accent-2"
                              >編集</nuxt-link
                            >
                            <DeleteButton
                              @click="handleClickDelete(event.id)"
                              buttonLong
                            />
                          </div>
                          <small-error-message-list
                            v-show="errors.global.length"
                            :messages="errors.global"
                          />
                        </td>
                      </tr>
                      <NoDataTableRow v-if="events.length === 0" />
                    </tbody>
                  </table>
                  <Loading :show="$fetchState.pending" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <pagination
        :total-count="pagination.total"
        :current-page="pagination.currentPage"
        :per-page="pagination.perPage"
      />
    </div>
  </div>
</template>

<script>
import 'vue2-timepicker/dist/VueTimepicker.css'
import dayjs from 'dayjs'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import Pagination from '@/components/molecules/pagination/Pagination'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import DeleteButton from '@/components/atoms/button/DeleteButton'
import api from '@/api'
import { assignErrors } from '@/plugins/vee-validate'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'

export default {
  components: {
    Breadcrumb,
    Pagination,
    LargeTitle,
    SmallErrorMessageList,
    DeleteButton,
    NoDataTableRow,
  },
  validate({ query }) {
    return query.page ? /^\d+$/.test(query.page) : true
  },
  watchQuery: ['page'],
  async fetch() {
    const { query } = this.$route

    await Promise.all([
      this.$store.dispatch('event/fetch', { page: query.page }),
      this.$store.dispatch('enum/fetch'),
    ])
  },
  data() {
    return {
      dayjs,
      breadcrumbs: [
        {
          name: 'イベント管理',
          route: { name: 'event' },
        },
        {
          name: 'イベント一覧',
          route: { name: 'event' },
        },
      ],
      errors: {
        global: [],
      },
    }
  },
  computed: {
    events() {
      return this.$store.getters['event/data']
    },
    pagination() {
      return this.$store.getters['event/pagination']
    },
    commonStatusDict() {
      return this.$store.getters['enum/valueLabel']['common/status'] || {}
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    async handleClickCopy(id) {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        const { data } = await api.event.copy(id)

        this.$router.push({ name: 'event-edit-id', params: { id: data.id } })
      } catch (error) {
        console.error(error)
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    async handleClickDelete(id) {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        await api.event.delete(id)
        this.$toast.success('イベントを削除しました。')
        const { query } = this.$route
        await Promise.all([
          this.$store.dispatch('event/fetch', { page: query.page }),
          this.$store.dispatch('enum/fetch'),
        ])
      } catch (error) {
        console.error(error)
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style scoped>
.title {
  margin-bottom: 20px;
}
.new-create-btn {
  text-align: right;
  padding: 15px;
}
.breadcrumbs-bg-image {
  background-image: url('~assets/breadcrumb-bg.jpg') !important;
}
</style>
