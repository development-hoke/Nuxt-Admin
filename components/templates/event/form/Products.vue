<template>
  <div>
    <div class="row">
      <div class="col s12" style="margin: 1rem 0; text-align: right;">
        <a class="btn" href="" @click.prevent="handleClickCreate">登録</a>
        <a class="btn" href="" @click.prevent="openCsvInput = !loading && true"
          >一括登録</a
        >
        <span>CSV(カンマ区切り)ファイルを選択してください。</span>
        <file-input
          v-if="openCsvInput"
          @input="handleInputCsv"
          @close="openCsvInput = false"
        />
      </div>
    </div>
    <NoticeList class="row" />
    <div class="row mb-2">
      <div class="col s12">
        <table class="">
          <thead>
            <tr>
              <th data-field="photo"></th>
              <th data-field="product-name">商品名</th>
              <th data-field="product-no">商品番号</th>
              <th data-field="prev">上代</th>
              <th data-field="rate">イベント値引率</th>
              <th data-field="count">在庫数</th>
              <th data-field="action">編集</th>
            </tr>
          </thead>
          <tbody>
            <event-product-item
              v-for="eventItem in eventItems"
              :key="eventItem.id"
              :event-item="eventItem"
            />
          </tbody>
        </table>
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
    <create-form-modal
      v-if="showCreateFormModal"
      @close="showCreateFormModal = false"
    />
  </div>
</template>

<script>
import EventProductItem from '@/components/templates/event/form/products/EventProductItem'
import CreateFormModal from '@/components/templates/event/form/products/CreateFormModal'
import FileInput from '@/components/atoms/input/FileInput'
import Pagination from '@/components/molecules/pagination/Pagination'
import api from '@/api'
import { extractValidationError } from '@/plugins/vee-validate'

export default {
  name: 'EventProducts',
  components: {
    EventProductItem,
    CreateFormModal,
    FileInput,
    Pagination,
  },
  async fetch() {
    if (this.$route.name === 'event-create') {
      return
    }
    const { id } = this.$route.params
    const params = this.$route.query
    await this.$store.dispatch('eventItem/fetch', { eventId: id, params })
  },
  data() {
    return {
      showCreateFormModal: false,
      openCsvInput: false,
    }
  },
  computed: {
    eventItems() {
      return this.$store.getters['eventItem/data']
    },
    pagination() {
      return this.$store.getters['eventItem/pagination']
    },
    eventId() {
      return this.$route.params.id
    },
    loading() {
      return this.$store.getters['common/loading']
    },
  },
  methods: {
    handleClickCreate() {
      this.showCreateFormModal = true
    },

    async handleInputCsv(input) {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)
        this.$store.commit('notice/clearAll')

        const { data } = await api.eventItem.createByCsv(this.eventId, {
          content: input.base64,
        })

        await this.$store.dispatch('eventItem/fetch', { eventId: this.eventId })

        if (data.failed.length > 0) {
          this.$toast.warning('一部のデータを取り込めませんでした。')
          this.$store.commit('notice/putError', data.failed)
        } else {
          this.$toast.success('アップロードが完了しました。')
        }
      } catch (error) {
        const { global } = extractValidationError(error)
        this.$toast.error(global[0])
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>
