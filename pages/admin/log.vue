<template>
  <div class="row">
    <Breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <LargeTitle>管理者ログ</LargeTitle>
              <div class="row">
                <div class="col s12 mt-2 right-align">
                  <ButtonContainer @click="handleClickSearch"
                    >検索</ButtonContainer
                  >
                  <ButtonContainer
                    type="primary"
                    @click="handleClickDownloadCsv"
                    >CSV出力</ButtonContainer
                  >
                </div>
              </div>
              <AdminLogSearchForm
                v-if="!$fetchState.pending"
                v-show="showSearchForm"
                ref="searchForm"
                @close="showSearchForm = false"
              />
              <div class="row">
                <div class="col s12 mt-2">
                  <AdminLogListTable :items="adminLogs" />
                  <Loading :show="$fetchState.pending" />
                </div>
                <div class="col s12 right-align-md mt-1">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import AdminLogSearchForm from '@/components/organisms/form/AdminLogSearchForm'
import AdminLogListTable from '@/components/organisms/table/AdminLogListTable'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import Pagination from '@/components/molecules/pagination/Pagination'
import { downloadFile } from '@/utils/file'
import { extractAttachmentFileName } from '@/utils/http'

export default {
  components: {
    Breadcrumb,
    LargeTitle,
    AdminLogSearchForm,
    AdminLogListTable,
    ButtonContainer,
    Pagination,
  },
  async fetch() {
    const { query } = this.$route

    this.$store.commit('adminLog/clear')

    await Promise.all([
      this.$store.dispatch('adminLog/fetch', query),
      this.$store.dispatch('master/fetchActionNames'),
    ])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '管理者管理',
          route: { name: 'admin-log' },
        },
        {
          name: '管理者ログ',
          route: { name: 'admin-log' },
        },
      ],
      showSearchForm: false,
    }
  },
  computed: {
    ...mapGetters({
      adminLogs: 'adminLog/data',
      pagination: 'adminLog/pagination',
    }),
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    handleClickSearch() {
      this.showSearchForm = !this.showSearchForm
    },
    async handleClickDownloadCsv() {
      try {
        this.$store.commit('common/loading', true)
        const params = { ...this.$route.query }
        const { data, headers } = await this.$api.adminLog.downloadCsv(params)
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
