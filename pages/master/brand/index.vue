<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <large-title>ブランドマスタ</large-title>
              <div class="row">
                <div class="new-create-btn">
                  <ButtonContainer
                    type="primary"
                    @click="handleClickDownloadCsv"
                    >CSV出力</ButtonContainer
                  >
                  <nuxt-link
                    class="btn waves-effect waves-light lightrn-1"
                    :to="{ name: 'master-brand-create' }"
                    >新規作成</nuxt-link
                  >
                </div>
                <div class="col s12">
                  <BrandSortTable
                    :items="brands"
                    :fetch-pending="$fetchState.pending"
                    @sorted="$toast.success('新着商品を更新しました。')"
                    @error="(error) => $toast.error(...error)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <pagination
        :total-count="pagination.total"
        :current-page="pagination.currentPage"
        :per-page="pagination.perPage"
      />
    </div>
  </div>
</template>
<script>
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import Pagination from '@/components/molecules/pagination/Pagination'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import { downloadFile } from '@/utils/file'
import { extractAttachmentFileName } from '@/utils/http'
import BrandSortTable from '@/components/organisms/table/BrandSortTable'

export default {
  components: {
    ButtonContainer,
    Breadcrumb,
    Pagination,
    LargeTitle,
    BrandSortTable,
  },
  validate({ query }) {
    return query.page ? /^\d+$/.test(query.page) : true
  },
  watchQuery: ['page'],
  async fetch() {
    const { query } = this.$route

    await Promise.all([
      this.$store.dispatch('brand/fetch', { page: query.page }),
      this.$store.dispatch('enum/fetch'),
    ])
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'マスタ管理',
          route: { name: 'master-brand' },
        },
        {
          name: 'ブランドマスタ',
          route: { name: 'master-brand' },
        },
      ],
      errors: {
        global: [],
      },
    }
  },
  computed: {
    brands() {
      return this.$store.getters['brand/data']
    },
    pagination() {
      return this.$store.getters['brand/pagination']
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    async handleClickDownloadCsv() {
      try {
        this.$store.commit('common/loading', true)
        const { data, headers } = await this.$api.brand.downloadCsv()
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
.new-create-btn {
  text-align: right;
  padding: 15px;
}
</style>
