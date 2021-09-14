<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <large-title>お知らせ管理</large-title>
              <div class="row mb-2">
                <ControlPanel class="col s12">
                  <div class="input-field inline panel-content">
                    <SelectNavigation
                      :options="publishOptions"
                      :default-value="selectedPublish"
                      param-name="status"
                    />
                  </div>
                  <div class="new-create-btn">
                    <nuxt-link
                      class="btn waves-effect waves-light lightrn-1"
                      :to="{ name: 'information-create' }"
                      >新規作成</nuxt-link
                    >
                  </div>
                </ControlPanel>
              </div>
              <div class="row">
                <div class="col s12">
                  <table class="bordered">
                    <thead>
                      <tr>
                        <th data-field="information-id">ID</th>
                        <th data-field="title">タイトル</th>
                        <th data-field="date">公開日時</th>
                        <th data-field="status">ステータス</th>
                        <th data-field="on-store-top">ストアトップ掲載</th>
                        <SortableHeaderCell
                          :order="sortState.priority"
                          @click="handleSort('priority')"
                          ><span>優先度</span></SortableHeaderCell
                        >
                        <th data-field="action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="information in informations"
                        :key="information.id"
                      >
                        <td>{{ information.id }}</td>
                        <td>{{ information.title }}</td>
                        <td>
                          {{
                            dayjs(information.publishAt).format(
                              'YYYY/MM/DD HH:mm'
                            )
                          }}
                        </td>
                        <td>
                          {{ commonStatusDict[Number(information.status)] }}
                        </td>
                        <td>
                          {{ information.isStoreTop === true ? '○' : '' }}
                        </td>
                        <td>{{ information.priority }}</td>
                        <td>
                          <div class="sub-btns">
                            <nuxt-link
                              :to="{
                                name: 'information-detail-id',
                                params: { id: information.id },
                              }"
                              class="btn waves-effect waves-light lightrn-1"
                              >詳細</nuxt-link
                            >
                            <nuxt-link
                              :to="{
                                name: 'information-edit-id',
                                params: { id: information.id },
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
                      <NoDataTableRow v-if="informations.length === 0" />
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
import { mapGetters } from 'vuex'
import 'vue2-timepicker/dist/VueTimepicker.css'
import dayjs from 'dayjs'
import sortableMixin from '@/components/organisms/table/mixins/sortableMixin'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import Pagination from '@/components/molecules/pagination/Pagination'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'
import ControlPanel from '@/components/molecules/panel/ControlPanel'
import SelectNavigation from '@/components/molecules/input/SelectNavigation'
import SortableHeaderCell from '@/components/molecules/table/SortableHeaderCell'
import { ORDER_ASC } from '@/constants/sort'

export default {
  components: {
    Breadcrumb,
    Pagination,
    LargeTitle,
    SmallErrorMessageList,
    NoDataTableRow,
    ControlPanel,
    SelectNavigation,
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

    const status = this.$route.query.status ?? null

    await Promise.all([
      this.$store.dispatch('information/fetch', cleanQueryParams),
      this.$store.dispatch('enum/fetch'),
    ])

    this.selectedPublish = status
  },
  data() {
    const sortState = {
      priority: ORDER_ASC,
    }
    if (this.$route.query.sort) {
      const [order, column] = this.extractQueryParam(this.$route.query.sort)
      sortState[column] = order
    }
    return {
      dayjs,
      breadcrumbs: [
        {
          name: 'お知らせ管理',
          route: { name: 'information' },
        },
        {
          name: 'お知らせ一覧',
          route: { name: 'information' },
        },
      ],
      errors: {
        global: [],
      },
      selectedPublish: null,
      sortState,
    }
  },
  computed: {
    ...mapGetters({ enumOptions: 'enum/options' }),
    publishOptions() {
      const options = [{ name: '総合', code: null }]

      return options.concat(this.enumOptions['common/status'] ?? [])
    },
    informations() {
      return this.$store.getters['information/data']
    },
    pagination() {
      return this.$store.getters['information/pagination']
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
