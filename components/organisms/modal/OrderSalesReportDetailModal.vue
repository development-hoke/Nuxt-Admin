<template>
  <ModalContainer ref="container">
    <div class="card lighten-5">
      <div class="card-content darken-1">
        <div class="row">
          <div class="col s6">
            <span class="card-title darken-1">売上内訳</span>
          </div>
          <div class="col s6 right-align">
            <CancelButton class="pr-1" @click="close" />
          </div>
        </div>
        <div class="row table-wrapper">
          <div class="col s12">
            <OrderSalesReportDetailTable :items="items" @sort="handleSort" />
            <Loading :show="pending" class="modal-loading" />
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <Pagination
              :total-count="pagination.total"
              :current-page="pagination.currentPage"
              :per-page="pagination.perPage"
              :click-handler="handleClickPage"
            />
          </div>
        </div>
      </div>
    </div>
  </ModalContainer>
</template>

<script>
import modalMixin from '@/components/organisms/modal/mixins/modalMixin'
import ModalContainer from '@/components/molecules/modal/ModalContainer'
import OrderSalesReportDetailTable from '@/components/organisms/table/OrderSalesReportDetailTable'
import CancelButton from '@/components/atoms/button/CancelButton'
import Pagination from '@/components/molecules/pagination/Pagination'

export default {
  name: 'OrderSalesReportDetailModal',
  emits: ['opened', 'closed', 'close'],
  components: {
    ModalContainer,
    CancelButton,
    OrderSalesReportDetailTable,
    Pagination,
  },
  mixins: [modalMixin],
  data() {
    return {
      params: {},
      pending: false,
    }
  },
  computed: {
    items() {
      return this.$store.getters['salesAggregation/item/data']
    },
    pagination() {
      return this.$store.getters['salesAggregation/item/pagination']
    },
  },
  methods: {
    async open(params) {
      try {
        this.pending = true
        this.$store.commit('salesAggregation/item/clear')
        this.params = params
        this.$refs.container.open()

        await this.$store.dispatch('salesAggregation/item/fetch', params)
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        this.pending = false
      }
    },
    async handleClickPage(page) {
      try {
        this.$store.commit('salesAggregation/item/clear')
        this.pending = true
        await this.$store.dispatch('salesAggregation/item/fetch', {
          ...this.params,
          page,
        })
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        this.pending = false
      }
    },
    async handleSort({ sort }) {
      try {
        this.$store.commit('salesAggregation/item/clear')
        this.pending = true
        await this.$store.dispatch('salesAggregation/item/fetch', {
          ...this.params,
          sort,
        })
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        this.pending = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  max-height: 90%;
  height: 90%;
  max-width: 80%;

  .card-content {
    height: 100%;

    .table-wrapper {
      position: relative;
      height: 82%;
      > .col {
        height: 100%;
        overflow: hidden;
        padding-bottom: 60px;
      }
      .modal-loading {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
      }
    }
  }
}
</style>
