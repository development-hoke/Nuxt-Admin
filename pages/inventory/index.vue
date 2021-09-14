<template>
  <div>
    <Breadcrumb :items="breadcrumbs" />

    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <div class="row mb-2">
              <div class="col s3">
                <large-title>在庫一覧</large-title>
              </div>
              <div class="col s4">
                <ClearFilterButton @click="handleClickClearButton" />
              </div>
              <div class="col s5 right-align-md">
                <ButtonContainer
                  type="danger"
                  button-class="accent-2"
                  @click="handleClickSearchButotn"
                  >検索</ButtonContainer
                >
                <ButtonContainer type="primary" @click="handleClickDownloadCsv"
                  >CSV出力</ButtonContainer
                >
              </div>
            </div>
            <InventorySearchForm
              v-show="showSearchForm"
              ref="searchForm"
              :server-errors="valitationErrors"
              @close="showSearchForm = false"
            />
            <div class="row mb-1">
              <div class="col offset-s5 s7 right-align-md">
                <Pagination
                  :total-count="pagination.total"
                  :current-page="pagination.currentPage"
                  :per-page="pagination.perPage"
                />
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <InventoryListTable :items="identifications" />
                <Loading :show="$fetchState.pending" />
              </div>
              <div class="col s12 right-align-md">
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
import Pagination from '@/components/molecules/pagination/Pagination'
import InventorySearchForm, {
  castQueryParams,
} from '@/components/organisms/form/InventorySearchForm'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import ClearFilterButton from '@/components/atoms/button/ClearFilterButton'
import InventoryListTable from '@/components/organisms/table/InventoryListTable'
import * as httpStatusCode from '@/constants/httpStatusCode'
import { assignErrors } from '@/plugins/vee-validate'
import { downloadFile } from '@/utils/file'
import { extractAttachmentFileName } from '@/utils/http'

export default {
  name: 'InventoryIndex',
  components: {
    Breadcrumb,
    LargeTitle,
    Pagination,
    InventorySearchForm,
    ButtonContainer,
    ClearFilterButton,
    InventoryListTable,
  },
  watchQuery: true,
  async fetch() {
    try {
      const { query } = this.$route
      const cleanQueryParams = {}

      Object.keys(query).forEach((key) => {
        cleanQueryParams[key] = castQueryParams(key, query[key])
      })

      this.$store.commit('itemDetailIdentifications/clear')

      await Promise.all([
        this.$store.dispatch('enum/fetch'),
        this.$store.dispatch('master/fetchOrganizations'),
        this.$store.dispatch(
          'itemDetailIdentifications/fetch',
          cleanQueryParams
        ),
      ])
    } catch (error) {
      console.error(error)

      if (
        !error.response ||
        error.response.status !== httpStatusCode.UNPROCESSABLE_ENTITY
      ) {
        throw error
      }

      this.valitationErrors = {}

      assignErrors(this.valitationErrors, error)
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '商品管理',
          route: { name: 'inventory' },
        },
        {
          name: '在庫一覧',
          route: { name: 'inventory' },
        },
      ],
      showSearchForm: false,
      valitationErrors: {},
    }
  },
  computed: {
    ...mapGetters({
      identifications: 'itemDetailIdentifications/data',
      pagination: 'itemDetailIdentifications/pagination',
    }),
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    handleClickClearButton() {
      this.$refs.searchForm.reset()
    },
    handleClickSearchButotn() {
      this.showSearchForm = !this.showSearchForm
    },
    async handleClickDownloadCsv() {
      try {
        this.$store.commit('common/loading', true)

        const query = { ...this.$route.query }

        delete query.page

        const { data, headers } = await this.$api.itemDetail.downloadCsv(query)
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

<style scoped>
.right-align-md {
  padding: 0;
}
</style>
