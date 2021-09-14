<template>
  <div>
    <breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <div class="row mb-3">
              <div class="col s3">
                <large-title>商品一覧</large-title>
              </div>
              <div class="col s4">
                <search-button @click="toggleSearchForm" />
                <clear-filter-button @click="handleClickClearButton" />
              </div>
              <div class="col s5 right-align-md right-style">
                <select
                  v-model="selectedFormat"
                  class="browser-default format-select"
                >
                  <option
                    v-for="(option, index) in itemBulkDownloadFormatOptions"
                    :key="index"
                    :value="option.code"
                  >
                    {{ option.name }}
                  </option>
                </select>
                <ButtonContainer @click="handleExportCsv"
                  >CSV出力</ButtonContainer
                >
              </div>
            </div>
            <item-search-form
              v-show="showSearchForm"
              ref="itemSearchForm"
              :errors="valitationErrors"
              @close="toggleSearchForm"
            />
            <div class="row">
              <div class="col s12">
                <item-list :items="items" />
                <Loading :show="$fetchState.pending" />
              </div>
              <div class="col s12 pagination">
                <pagination
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
import SearchButton from '@/components/atoms/button/SearchButton'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import ClearFilterButton from '@/components/atoms/button/ClearFilterButton'
import ItemSearchForm from '@/components/organisms/form/ItemSearchForm'
import ItemList from '@/components/organisms/table/ItemList'
import * as httpStatusCode from '@/constants/httpStatusCode'
import { assignErrors } from '@/plugins/vee-validate'
import { downloadFile } from '@/utils/file'
import { extractAttachmentFileName } from '@/utils/http'

export default {
  components: {
    Breadcrumb,
    LargeTitle,
    Pagination,
    SearchButton,
    ClearFilterButton,
    ButtonContainer,
    ItemSearchForm,
    ItemList,
  },
  watchQuery: true,
  async fetch() {
    try {
      const { query } = this.$route

      this.$store.commit('item/clear')

      await Promise.all([
        this.$store.dispatch('enum/fetch'),
        this.$store.dispatch('item/fetch', query),
      ])

      this.selectedFormat = this.itemBulkDownloadFormatKv.all
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
          name: '商品一覧',
          route: { name: 'item' },
        },
      ],
      showSearchForm: false,
      valitationErrors: {},
      selectedFormat: null,
    }
  },
  computed: {
    ...mapGetters({
      items: 'item/data',
      pagination: 'item/pagination',
      enumKv: 'enum/kv',
      enumOptions: 'enum/options',
    }),
    itemBulkDownloadFormatKv() {
      return this.enumKv['itemBulkDownload/format'] || {}
    },
    itemBulkDownloadFormatOptions() {
      return this.enumOptions['itemBulkDownload/format'] || []
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    toggleSearchForm() {
      this.showSearchForm = !this.showSearchForm
    },
    handleClickClearButton() {
      this.$refs.itemSearchForm.reset()
    },
    async handleExportCsv() {
      try {
        this.$store.commit('common/loading', true)

        const query = { ...this.$route.query }

        delete query.page

        const { data, headers } = await (this.selectedFormat ===
        this.itemBulkDownloadFormatKv.image
          ? this.$api.item.downloadImageCsv(query)
          : this.selectedFormat === this.itemBulkDownloadFormatKv.info
          ? this.$api.item.downloadInfoCsv(query)
          : this.$api.item.downloadCsv(query))

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

<style lang="scss" scoped>
.right-style {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  > *:not(:first-child) {
    margin-left: 8px;
  }
}
.format-select {
  max-width: 200px;
}
</style>
