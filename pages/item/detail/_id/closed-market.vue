<template>
  <div class="tab-content active">
    <div class="container">
      <div class="row">
        <MediumTitle class="col s6">発行一覧</MediumTitle>
      </div>
      <div class="row mb-2">
        <div class="col s12">
          <table class="bordered striped">
            <thead>
              <tr>
                <th data-field="photo">タイトル名</th>
                <th data-field="product-name">url</th>
                <th data-field="product-no">pass</th>
                <th data-field="prev">色番</th>
                <th data-field="rate">サイズ番</th>
                <th data-field="count">個数</th>
                <th data-field="action">有効期限</th>
              </tr>
            </thead>
            <tbody>
              <ClosedMarketTableItem
                v-for="closedMarket in closedMarkets"
                :key="closedMarket.id"
                :closed-market="closedMarket"
                :show-control="false"
              />
            </tbody>
          </table>
          <Loading :show="$fetchState.pending" />
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MediumTitle from '@/components/atoms/title/MediumTitle'
import ClosedMarketTableItem from '@/components/molecules/tableItem/ClosedMarketTableItem'
import Pagination from '@/components/molecules/pagination/Pagination'

export default {
  name: 'ItemEditClosedMarket',
  components: {
    MediumTitle,
    ClosedMarketTableItem,
    Pagination,
  },
  async fetch() {
    const itemId = this.itemId
    const { query } = this.$route
    await Promise.all([
      this.$store.dispatch('closedMarket/fetch', { itemId, params: query }),
    ])
  },
  computed: {
    ...mapGetters({
      closedMarkets: 'closedMarket/data',
      pagination: 'closedMarket/pagination',
    }),
    itemId() {
      return Number(this.$route.params.id)
    },
  },
}
</script>
