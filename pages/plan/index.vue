<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <large-title>企画管理</large-title>
              <div class="row">
                <div class="col s12 right-align-md">
                  <ButtonContainer
                    type="primary"
                    button-class="accent-2"
                    @click="handleClickSearchButotn"
                    >検索</ButtonContainer
                  >
                </div>
              </div>
              <PlanSearchForm
                v-if="!$fetchState.pending"
                v-show="showSearchForm"
                ref="searchForm"
                @close="showSearchForm = false"
              />
              <div class="row">
                <div class="new-create-btn">
                  <nuxt-link
                    class="btn waves-effect waves-light lightrn-1"
                    :to="{ name: 'plan-create' }"
                    >新規作成</nuxt-link
                  >
                </div>
                <div class="col s12">
                  <table class="bordered">
                    <thead>
                      <tr>
                        <th data-field="title">企画名</th>
                        <th data-field="slug">URL</th>
                        <th data-field="status">公開ステータス</th>
                        <th data-field="store_brand">ストアブランド</th>
                        <th data-field="place">表示箇所</th>
                        <th data-field="period_from">開始日時</th>
                        <th data-field="period_to">終了日時</th>
                        <th data-field="action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="plan in plans" :key="plan.id">
                        <td>{{ plan.title }}</td>
                        <td>/{{ plan.slug }}</td>
                        <td>
                          {{ statusDescription(plan) }}
                        </td>
                        <td>
                          {{ commonStoreBrand[Number(plan.storeBrand)] }}
                        </td>
                        <td>
                          {{ planPlace[Number(plan.place)] }}
                        </td>
                        <td v-if="plan.status">
                          {{ plan.periodFrom | date }}
                        </td>
                        <td v-else>ー</td>
                        <td v-if="plan.status">
                          {{ plan.periodTo | date }}
                        </td>
                        <td v-else>ー</td>
                        <td>
                          <div class="sub-btns">
                            <nuxt-link
                              :to="{
                                name: 'plan-detail-id-basic',
                                params: { id: plan.id },
                              }"
                              class="btn waves-effect waves-light lightrn-1"
                              >詳細</nuxt-link
                            >
                            <nuxt-link
                              :to="{
                                name: 'plan-edit-id-basic',
                                params: { id: plan.id },
                              }"
                              class="btn waves-effect waves-light purple accent-2"
                              >編集</nuxt-link
                            >
                            <a
                              class="btn waves-effect waves-light dark"
                              @click.prevent="handleClickCopy(plan.id)"
                              >複製</a
                            >
                          </div>
                          <small-error-message-list
                            v-show="errors.global.length"
                            :messages="errors.global"
                          />
                        </td>
                      </tr>
                      <NoDataTableRow v-if="plans.length === 0" />
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
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import Pagination from '@/components/molecules/pagination/Pagination'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import PlanSearchForm from '@/components/organisms/form/PlanSearchForm'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'
import api from '@/api'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  components: {
    Breadcrumb,
    ButtonContainer,
    Pagination,
    LargeTitle,
    PlanSearchForm,
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
      this.$store.dispatch('plan/fetch', query),
      this.$store.dispatch('enum/fetch'),
    ])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '企画管理',
          route: { name: 'plan' },
        },
        {
          name: '企画管理一覧',
          route: { name: 'plan' },
        },
      ],
      showSearchForm: false,
      errors: {
        global: [],
      },
    }
  },
  computed: {
    plans() {
      return this.$store.getters['plan/data']
    },
    pagination() {
      return this.$store.getters['plan/pagination']
    },
    enumValueLabels() {
      return this.$store.getters['enum/valueLabel']
    },
    commonStoreBrand() {
      return this.enumValueLabels['common/storeBrand'] ?? {}
    },
    planPlace() {
      return this.enumValueLabels['plan/place'] ?? {}
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

        const { data } = await api.plan.copy(id)

        this.$router.push({
          name: 'plan-edit-id-basic',
          params: { id: data.id },
        })
        this.$toast.success('企画を複製しました。')
      } catch (error) {
        this.$toast.success('企画の複製に失敗しました。')
        console.error(error)
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    statusDescription(plan) {
      return this.$store.getters['plan/statusDescription'](plan)
    },
    handleClickSearchButotn() {
      this.showSearchForm = !this.showSearchForm
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
