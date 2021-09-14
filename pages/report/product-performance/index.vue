<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <div class="row mb-3">
              <div class="col s7">
                <LargeTitle>
                  商品実績
                </LargeTitle>
              </div>
              <div class="col s5 right-align-md mt-2">
                <ButtonContainer
                  :disabled="$fetchState.pending"
                  @click="handleClickSearch"
                  >検索</ButtonContainer
                >
                <ButtonContainer @click="handleExportCsv"
                  >CSV出力</ButtonContainer
                >
              </div>
            </div>
            <ItemSalesReportForm
              v-if="!$fetchState.pending"
              v-show="showSearchForm"
              ref="itemSalesReportForm"
              :server-errors="serverErrors"
              @close="showSearchForm = false"
            />
            <div class="row mb-2 right-align-md">
              <div class="col s12">
                <Pagination
                  :total-count="pagination.total"
                  :current-page="pagination.currentPage"
                  :per-page="pagination.perPage"
                />
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <ItemSalesReportTable
                  v-if="!$fetchState.pending"
                  :items="items"
                />
                <Loading :show="$fetchState.pending" />
              </div>
            </div>
            <div class="row mb-2 mt-2 right-align-md">
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
  </div>
</template>

<script>
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import ItemSalesReportForm, {
  isDefaultQuery,
} from '@/components/organisms/form/ItemSalesReportForm'
import ItemSalesReportTable from '@/components/organisms/table/ItemSalesReportTable'
import Pagination from '@/components/molecules/pagination/Pagination'
import { assignErrors } from '@/plugins/vee-validate'
import { extractAttachmentFileName } from '@/utils/http'
import { downloadFile } from '@/utils/file'

export default {
  components: {
    Breadcrumb,
    LargeTitle,
    Pagination,
    ButtonContainer,
    ItemSalesReportForm,
    ItemSalesReportTable,
  },
  watchQuery: true,
  async fetch() {
    const query = isDefaultQuery(this.$route.query)
      ? { useDefault: 1, ...this.$route.query }
      : this.$route.query

    this.$store.commit('salesAggregation/item/clear')

    await Promise.all([
      this.$store.dispatch('enum/fetch'),
      this.$store.dispatch('onlineCategory/fetch'),
      this.$store.dispatch('master/fetchDivisions'),
      this.$store.dispatch('master/fetchDepartments'),
      this.$store.dispatch('master/fetchOrganizations'),
      this.$store
        .dispatch('salesAggregation/item/fetch', query)
        .catch((error) => {
          assignErrors(this.serverErrors, error)
          const errorString = this.serverErrors.global || []
          this.$toast.error(...errorString)
        }),
    ])
  },

  data() {
    return {
      breadcrumbs: [
        {
          name: 'レポート',
          route: { name: 'report-sales-tally' },
        },
        {
          name: '商品実績',
          route: { name: 'report-product-performance' },
        },
      ],
      showSearchForm: false,
      serverErrors: {},
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
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    handleClickSearch() {
      this.showSearchForm = !this.showSearchForm
    },

    async handleExportCsv() {
      try {
        this.$store.commit('common/loading', true)
        const query = { ...this.$refs.itemSalesReportForm.inputs }

        delete query.page
        delete query.perPage

        if (isDefaultQuery(query)) {
          query.useDefault = 1
        }

        const {
          data,
          headers,
        } = await this.$api.salesAggregation.downloadItemCsv(query)

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
