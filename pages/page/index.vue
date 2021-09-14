<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <large-title>静的ページ管理</large-title>
              <div class="row">
                <div class="new-create-btn">
                  <nuxt-link
                    class="btn waves-effect waves-light lightrn-1"
                    :to="{ name: 'page-create' }"
                    >新規作成</nuxt-link
                  >
                </div>
                <div class="col s12">
                  <table class="bordered">
                    <thead>
                      <tr>
                        <th data-field="title">ページ名</th>
                        <th data-field="slug">URL</th>
                        <th data-field="status">公開ステータス</th>
                        <th data-field="publish_from">開始日時</th>
                        <th data-field="publish_to">終了日時</th>
                        <th data-field="action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="page in pages" :key="page.id">
                        <td>{{ page.title }}</td>
                        <td>/{{ page.slug }}</td>
                        <td>
                          {{ statusDescription(page) }}
                        </td>
                        <td>
                          {{ page.publishFrom | date }}
                        </td>
                        <td>
                          {{ page.publishTo | date }}
                        </td>
                        <td>
                          <div class="sub-btns">
                            <nuxt-link
                              :to="{
                                name: 'page-detail-id',
                                params: { id: page.id },
                              }"
                              class="btn waves-effect waves-light lightrn-1"
                              >詳細</nuxt-link
                            >
                            <nuxt-link
                              :to="{
                                name: 'page-edit-id',
                                params: { id: page.id },
                              }"
                              class="btn waves-effect waves-light purple accent-2"
                              >編集</nuxt-link
                            >
                            <a
                              class="btn waves-effect waves-light dark"
                              @click.prevent="handleClickCopy(page.id)"
                              >複製</a
                            >
                          </div>
                          <small-error-message-list
                            v-show="errors.global.length"
                            :messages="errors.global"
                          />
                        </td>
                      </tr>
                      <NoDataTableRow v-if="pages.length === 0" />
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
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import Pagination from '@/components/molecules/pagination/Pagination'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'
import api from '@/api'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  components: {
    Breadcrumb,
    Pagination,
    LargeTitle,
    SmallErrorMessageList,
    NoDataTableRow,
  },
  validate({ query }) {
    return query.page ? /^\d+$/.test(query.page) : true
  },
  watchQuery: ['page'],
  async fetch() {
    const { query } = this.$route

    await Promise.all([
      this.$store.dispatch('page/fetch', { page: query.page }),
      this.$store.dispatch('enum/fetch'),
    ])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'コンテンツ管理',
          route: { name: 'page' },
        },
        {
          name: '静的ページ管理',
          route: { name: 'page' },
        },
      ],
      errors: {
        global: [],
      },
    }
  },
  computed: {
    pages() {
      return this.$store.getters['page/data']
    },
    pagination() {
      return this.$store.getters['page/pagination']
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

        const { data } = await api.page.copy(id)

        this.$router.push({ name: 'page-edit-id', params: { id: data.id } })
        this.$toast.success('静的ページを複製しました。')
      } catch (error) {
        this.$toast.success('静的ページの複製に失敗しました。')
        console.error(error)
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    statusDescription(page) {
      return this.$store.getters['page/statusDescription'](page)
    },
  },
}
</script>

<style scoped>
.new-create-btn {
  text-align: right;
  padding: 15px;
}
</style>
