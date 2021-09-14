<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <LargeTitle>受注一覧</LargeTitle>
            <div class="row">
              <div class="col s12 right-align-md">
                <ButtonContainer
                  type="primary"
                  button-class="accent-2"
                  @click="handleClickSearchButotn"
                  >検索</ButtonContainer
                >
                <OrderListControlPanel class="order-list-panel" />
              </div>
            </div>
            <OrderSearchForm
              v-show="showSearchForm"
              ref="searchForm"
              :server-errors="valitationErrors"
              @close="showSearchForm = false"
            />
            <SelectPerPageControlPanel class="mb-1 mt-1" />
            <div class="row mb-2 mt-2 table-wrapper">
              <OrderListTable :items="orders" />
              <Loading :show="$fetchState.pending" />
            </div>
            <div class="row">
              <div class="col s12 pagination">
                <Pagination
                  :total-count="pagination.total"
                  :current-page="pagination.currentPage"
                  :per-page="pagination.perPage"
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
import OrderSearchForm from '@/components/organisms/form/OrderSearchForm'
import OrderListControlPanel from '@/components/organisms/panel/OrderListControlPanel'
import SelectPerPageControlPanel from '@/components/organisms/panel/SelectPerPageControlPanel'
import OrderListTable from '@/components/organisms/table/OrderListTable'
import Pagination from '@/components/molecules/pagination/Pagination'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'

export default {
  components: {
    LargeTitle,
    Breadcrumb,
    OrderSearchForm,
    OrderListControlPanel,
    SelectPerPageControlPanel,
    OrderListTable,
    Pagination,
    ButtonContainer,
  },
  async fetch() {
    const { query } = this.$route

    this.$store.commit('order/clear')

    await Promise.all([
      this.$store.dispatch('enum/fetch'),
      this.$store.dispatch('order/fetch', query),
    ])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '受注管理',
          route: { name: 'order' },
        },
        {
          name: '受注一覧',
          route: { name: 'order' },
        },
      ],
      showSearchForm: false,
      valitationErrors: {},
    }
  },
  computed: {
    ...mapGetters({
      orders: 'order/data',
      pagination: 'order/pagination',
    }),
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    handleClickSearchButotn() {
      this.showSearchForm = !this.showSearchForm
    },
  },
}
</script>

<style lang="scss" scoped>
.table-wrapper {
  overflow-x: scroll;
}
.right-align-md {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
