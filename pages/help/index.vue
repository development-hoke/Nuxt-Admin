<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <large-title>ヘルプ管理</large-title>
              <div class="row">
                <div class="new-create-btn">
                  <nuxt-link
                    class="btn waves-effect waves-light lightrn-1"
                    :to="{ name: 'help-create' }"
                    >新規作成</nuxt-link
                  >
                </div>
                <div class="col s12">
                  <table class="bordered">
                    <thead>
                      <tr>
                        <th data-field="help-id">ID</th>
                        <th data-field="title">タイトル</th>
                        <th data-field="on-store-top">よくある質問に掲載</th>
                        <th data-field="">優先度</th>
                        <th data-field="">公開ステータス</th>
                        <SortableHeaderCell
                          :order="sortState.good"
                          @click="handleSort('good')"
                          ><span>役に立った</span></SortableHeaderCell
                        >
                        <SortableHeaderCell
                          :order="sortState.bad"
                          @click="handleSort('bad')"
                          ><span>役に立たなかった</span></SortableHeaderCell
                        >
                        <th data-field="action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="help in helps" :key="help.id">
                        <td>{{ help.id }}</td>
                        <td>{{ help.title }}</td>
                        <td>
                          {{ help.isFaq === true ? '○' : '' }}
                        </td>
                        <td>{{ help.sort }}</td>
                        <td>{{ commonStatusDict[Number(help.status)] }}</td>
                        <td>{{ help.good }}</td>
                        <td>{{ help.bad }}</td>
                        <td>
                          <div class="sub-btns">
                            <nuxt-link
                              :to="{
                                name: 'help-detail-id',
                                params: { id: help.id },
                              }"
                              class="btn waves-effect waves-light lightrn-1"
                              >詳細</nuxt-link
                            >
                            <nuxt-link
                              :to="{
                                name: 'help-edit-id',
                                params: { id: help.id },
                              }"
                              class="btn waves-effect waves-light purple accent-2"
                              >編集</nuxt-link
                            >
                          </div>
                          <small-error-message-list
                            v-show="errors.global.length"
                            :messages="errors.global"
                          />
                        </td>
                      </tr>
                      <NoDataTableRow v-if="helps.length === 0" />
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
import sortableMixin from '@/components/organisms/table/mixins/sortableMixin'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import Pagination from '@/components/molecules/pagination/Pagination'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'
import SortableHeaderCell from '@/components/molecules/table/SortableHeaderCell'
import { ORDER_ASC } from '@/constants/sort'

export default {
  components: {
    Breadcrumb,
    Pagination,
    LargeTitle,
    SmallErrorMessageList,
    NoDataTableRow,
    SortableHeaderCell,
  },
  mixins: [sortableMixin],
  validate({ query }) {
    return query.page ? /^\d+$/.test(query.page) : true
  },
  watchQuery: ['page'],
  async fetch() {
    const { query } = this.$route
    const cleanQueryParams = {}

    Object.keys(query).forEach((key) => {
      cleanQueryParams[key] = query[key]
    })

    await Promise.all([
      this.$store.dispatch('help/fetch', cleanQueryParams),
      this.$store.dispatch('enum/fetch'),
    ])
  },
  data() {
    const sortState = {
      good: ORDER_ASC,
      bad: ORDER_ASC,
    }

    if (this.$route.query.sort) {
      const [order, column] = this.extractQueryParam(this.$route.query.sort)
      sortState[column] = order
    }
    return {
      breadcrumbs: [
        {
          name: 'ヘルプ管理',
          route: { name: 'help' },
        },
        {
          name: 'ヘルプ一覧',
          route: { name: 'help' },
        },
      ],
      errors: {
        global: [],
      },
      sortState,
    }
  },
  computed: {
    helps() {
      return this.$store.getters['help/data']
    },
    pagination() {
      return this.$store.getters['help/pagination']
    },
    commonStatusDict() {
      return this.$store.getters['enum/valueLabel']['common/status'] || {}
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {},
}
</script>

<style scoped>
.new-create-btn {
  text-align: right;
  padding: 15px;
}
</style>
