<template>
  <div class="tab-content active">
    <div class="container">
      <div class="row">
        <MediumTitle class="col s6">発行一覧</MediumTitle>
        <div class="col s6 mt-2 mb-2 ml-0 mr-0 right-align">
          <ButtonContainer @click="handleClickIssue">発行する</ButtonContainer>
        </div>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              <ClosedMarketTableItem
                v-for="closedMarket in closedMarkets"
                :key="closedMarket.id"
                :closed-market="closedMarket"
                @edit="handelEdit"
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
    <ClosedMarketFormModal ref="closedMarketFormModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MediumTitle from '@/components/atoms/title/MediumTitle'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import ClosedMarketTableItem from '@/components/molecules/tableItem/ClosedMarketTableItem'
import ClosedMarketFormModal from '@/components/organisms/modal/ClosedMarketFormModal'
import Pagination from '@/components/molecules/pagination/Pagination'

export default {
  name: 'ItemEditClosedMarket',
  components: {
    MediumTitle,
    ButtonContainer,
    ClosedMarketTableItem,
    ClosedMarketFormModal,
    Pagination,
  },
  async fetch() {
    const itemId = this.itemId
    const { query } = this.$route

    await Promise.all([
      this.$store.dispatch('itemDetail/fetchByItemId', { itemId }),
      this.$store.dispatch('closedMarket/fetch', { itemId, params: query }),
    ])
  },
  computed: {
    ...mapGetters({
      closedMarkets: 'closedMarket/data',
      itemDetails: 'itemDetail/data',
      pagination: 'closedMarket/pagination',
    }),
    itemId() {
      return Number(this.$route.params.id)
    },
  },
  methods: {
    handleClickIssue() {
      this.$refs.closedMarketFormModal.open({
        itemId: this.itemId,
        itemDetails: this.itemDetails,
      })
    },

    handelEdit(closedMarket) {
      const defaultInputs = closedMarket

      const itemDetail = this.itemDetails.find(
        ({ id }) => Number(id) === Number(closedMarket.itemDetailId)
      )

      if (!itemDetail) {
        this.$toast.error('対象のSKUが見つかりませんでした。')
        return
      }

      defaultInputs.colorId = itemDetail.colorId
      defaultInputs.sizeId = itemDetail.sizeId

      this.$refs.closedMarketFormModal.open({
        defaultInputs,
        itemId: this.itemId,
        itemDetails: this.itemDetails,
      })
    },
  },
}
</script>
