<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <div class="row mb-1">
              <div class="col s3">
                <LargeTitle>売り上げ集計</LargeTitle>
              </div>
              <div class="col s9 right-align-md mt-2">
                <ButtonContainer
                  :disabled="$fetchState.pending"
                  @click="handleClickSearch"
                  >検索</ButtonContainer
                >
                <ButtonContainer @click="handleExportCsv(CSV_TYPE_ORDER)"
                  >CSV出力（全体）</ButtonContainer
                >
                <ButtonContainer @click="handleExportCsv(CSV_TYPE_ORDER_DETAIL)"
                  >CSV出力（商品込）</ButtonContainer
                >
              </div>
            </div>
            <OrderSalesReportForm
              v-if="!$fetchState.pending"
              v-show="showSearchForm"
              ref="orderSalesReportForm"
              :server-errors="serverErrors"
              :target.sync="target"
              :sum-group1-flg.sync="sumGroup1Flg"
              :sum-group2-flg.sync="sumGroup2Flg"
              @close="showSearchForm = false"
            />
            <SelectPerPageControlPanel
              :options="perPageOptions"
              :default-per-page="50"
            />
            <div class="row mb-3">
              <div class="col s12">
                <OrderSalesReportTable
                  v-if="!$fetchState.pending"
                  :target="target"
                  :sum-group1-flg="sumGroup1Flg"
                  :sum-group2-flg="sumGroup2Flg"
                  @click-target="handleClickTarget"
                />
                <Loading :show="$fetchState.pending" />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col s12">
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

    <OrderSalesReportDetailModal ref="detailModal" />
  </div>
</template>

<script>
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import OrderSalesReportTable from '@/components/organisms/table/OrderSalesReportTable'
import OrderSalesReportForm, {
  isDefaultQuery,
} from '@/components/organisms/form/OrderSalesReportForm'
import OrderSalesReportDetailModal from '@/components/organisms/modal/OrderSalesReportDetailModal'
import Pagination from '@/components/molecules/pagination/Pagination'
import SelectPerPageControlPanel from '@/components/organisms/panel/SelectPerPageControlPanel'
import { assignErrors } from '@/plugins/vee-validate'
import { TARGET_TYPE_PRICE } from '@/constants/salesReport/targetType'
import {
  preprocessStringfyingQuery,
  extractAttachmentFileName,
} from '@/utils/http'
import { downloadFile } from '@/utils/file'

const CSV_TYPE_ORDER = 'order'
const CSV_TYPE_ORDER_DETAIL = 'order_detail'

export default {
  components: {
    Breadcrumb,
    LargeTitle,
    ButtonContainer,
    OrderSalesReportTable,
    OrderSalesReportForm,
    OrderSalesReportDetailModal,
    Pagination,
    SelectPerPageControlPanel,
  },
  watchQuery: true,
  async fetch() {
    const query = isDefaultQuery(this.$route.query)
      ? { useDefault: 1, ...this.$route.query }
      : this.$route.query

    this.useDefault = Boolean(query.useDefault)

    this.$store.commit('salesAggregation/order/clear')

    await Promise.all([
      this.$store.dispatch('enum/fetch'),
      this.$store.dispatch('onlineCategory/fetch'),
      this.$store.dispatch('master/fetchDivisions'),
      this.$store.dispatch('master/fetchDepartments'),
      this.$store.dispatch('master/fetchOrganizations'),
      this.$store
        .dispatch('salesAggregation/order/fetch', query)
        .catch((error) => {
          assignErrors(this.serverErrors, error)
          const errorString = this.serverErrors.global || []
          this.$toast.error(...errorString)
        }),
    ])

    this.target = Number(query.target ?? TARGET_TYPE_PRICE)
    this.sumGroup1Flg = Number(query.sum_group1_flg ?? 0)
    this.sumGroup2Flg = Number(query.sum_group2_flg ?? 0)

    this.queryCache = query.useDefault
      ? query
      : preprocessStringfyingQuery(
          this.$store.getters['salesAggregation/order/requestParams']
        )
  },
  data() {
    return {
      CSV_TYPE_ORDER,
      CSV_TYPE_ORDER_DETAIL,
      breadcrumbs: [
        {
          name: 'レポート',
          route: { name: 'report-sales-tally' },
        },
        {
          name: '売り上げ集計',
          route: { name: 'report-sales-tally' },
        },
      ],
      perPageOptions: [30, 50, 100, 200, 500],
      showSearchForm: false,
      serverErrors: {},
      target: TARGET_TYPE_PRICE,
      sumGroup1Flg: 0,
      sumGroup2Flg: 0,
      queryCache: {},
    }
  },
  computed: {
    pagination() {
      return this.$store.getters['salesAggregation/order/pagination']
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    handleClickSearch() {
      this.showSearchForm = !this.showSearchForm
    },

    handleClickTarget(params) {
      if (this.queryCache.productNumber) {
        params.productNumber = [...this.queryCache.productNumber]
      }
      if (this.queryCache.makerProductNumber) {
        params.makerProductNumber = [...this.queryCache.makerProductNumber]
      }
      this.$refs.detailModal.open(params)
    },

    async handleExportCsv(type) {
      try {
        this.$store.commit('common/loading', true)
        const query = this.$refs.orderSalesReportForm.convertInputs2Query()

        if (isDefaultQuery(query)) {
          query.useDefault = 1
        }

        const { data, headers } = await new Promise((resolve) => {
          ;(type === CSV_TYPE_ORDER
            ? this.$api.salesAggregation.downloadOrderCsv(query)
            : this.$api.salesAggregation.downloadOrderDetailCsv(query)
          ).then(resolve)
        })

        const fileName = extractAttachmentFileName(headers)

        downloadFile(data, fileName)
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>
