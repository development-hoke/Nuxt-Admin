<template>
  <div>
    <breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <div class="row mb-3">
              <div class="col s3">
                <large-title>過去の商品一覧</large-title>
              </div>
              <div class="col s4">
                <search-button @click="toggleSearchForm" />
                <clear-filter-button @click="handleClickClearButton" />
              </div>
            </div>
            <past-item-search-form
              v-show="showSearchForm"
              ref="pastItemSearchForm"
              :errors="valitationErrors"
              @close="toggleSearchForm"
            />
            <div class="row">
              <div class="col s12">
                <past-item-list :items="items" />
                <Loading :show="$fetchState.pending" />
              </div>
              <div class="col s12 pagination">
                <pagination
                  :total-count="pagination.total"
                  :current-page="pagination.currentPage"
                  :per-page="50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import Pagination from '@/components/molecules/pagination/Pagination'
import SearchButton from '@/components/atoms/button/SearchButton'
import ClearFilterButton from '@/components/atoms/button/ClearFilterButton'
import PastItemSearchForm from '@/components/organisms/form/PastItemSearchForm'
import PastItemList from '@/components/organisms/table/PastItemList'
import * as httpStatusCode from '@/constants/httpStatusCode'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  components: {
    Breadcrumb,
    LargeTitle,
    Pagination,
    SearchButton,
    ClearFilterButton,
    PastItemSearchForm,
    PastItemList,
  },
  watchQuery: true,
  async fetch() {
    try {
      const { query } = this.$route

      this.$store.commit('item/clear')

      await Promise.all([
        this.$store.dispatch('enum/fetch'),
        this.$store.dispatch('pastItem/fetch', query),
      ])
    } catch (error) {
      console.error(error)

      if (
        !error.response ||
        error.response.status !== httpStatusCode.UNPROCESSABLE_ENTITY
      ) {
        throw error
      }

      const valitationErrors = {}

      assignErrors(valitationErrors, error)

      return { valitationErrors }
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '商品管理',
          route: { name: 'item' },
        },
        {
          name: '過去の商品一覧',
          route: { name: 'past-item' },
        },
      ],
      showSearchForm: false,
      valitationErrors: {},
      selectedFormat: null,
    }
  },
  computed: {
    ...mapGetters({
      items: 'pastItem/data',
      pagination: 'pastItem/pagination',
      enumKv: 'enum/kv',
      enumOptions: 'enum/options',
      loading: 'common/loading',
    }),
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    toggleSearchForm() {
      this.showSearchForm = !this.showSearchForm
    },
    handleClickClearButton() {
      this.$refs.pastItemSearchForm.reset()
    },
  },
}
</script>
