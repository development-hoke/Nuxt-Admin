<template>
  <div class="row">
    <Breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <div class="title">販売タイプ一覧</div>
              <div class="row mb-2">
                <ControlPanel class="col s12">
                  <ButtonContainer
                    type="primary"
                    @click="handleClickDownloadCsv"
                    >CSV出力</ButtonContainer
                  >
                  <a class="btn" @click.prevent="add">新しい販売タイプ</a>
                </ControlPanel>
              </div>
              <div class="row">
                <div class="col s12">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>表示販売タイプ名</th>
                        <th>文字色</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in items" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>
                          <color-picker-with-input
                            v-model="item.textColor"
                            :color-id="item.id"
                            :color-changeable="false"
                          />
                        </td>
                        <td>
                          <a
                            href="#"
                            class="btn-floating btn-small waves-effect waves-light"
                            @click.prevent="edit(item)"
                            ><i class="material-icons">edit</i></a
                          >
                          <DeleteButton
                            title="販売タイプ削除"
                            :body="comfirmationBody(item.id)"
                            @click="remove(item.id)"
                          />
                        </td>
                      </tr>
                      <NoDataTableRow v-if="items.length === 0" />
                    </tbody>
                  </table>
                  <Loading :show="$fetchState.pending" />
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
    <sales-type-form-modal ref="formModal" />
  </div>
</template>

<script>
import EventEmitter from 'events'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import ControlPanel from '@/components/molecules/panel/ControlPanel'
import Pagination from '@/components/molecules/pagination/Pagination'
import { downloadFile } from '@/utils/file'
import { extractAttachmentFileName } from '@/utils/http'
import ColorPickerWithInput from '@/components/molecules/input/ColorPickerWithInput'
import DeleteButton from '@/components/atoms/button/DeleteButton'
import { extractValidationError } from '@/plugins/vee-validate'
import SalesTypeFormModal from '@/components/organisms/modal/SalesTypeFormModal'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'

export default {
  components: {
    Breadcrumb,
    ButtonContainer,
    ControlPanel,
    Pagination,
    ColorPickerWithInput,
    DeleteButton,
    SalesTypeFormModal,
    NoDataTableRow,
  },
  validate({ query }) {
    return query.page ? /^\d+$/.test(query.page) : true
  },
  watchQuery: ['page'],
  async fetch() {
    const { query } = this.$route
    this.$store.commit('salesType/clear')
    await this.$store.dispatch('salesType/fetch', { page: query.page })
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'マスタ管理',
          route: { name: 'master' },
        },
        {
          name: '販売タイプ管理',
          route: { name: 'master-sales-type' },
        },
        {
          name: '販売タイプ一覧',
          route: { name: 'master-sales-type' },
        },
      ],
      events: new EventEmitter(),
      isModalVisible: false,
      temp: {
        id: 0,
        name: '',
        textColor: '',
      },
      colors: [],
    }
  },
  computed: {
    items() {
      return this.$store.getters['salesType/data']
    },
    pagination() {
      return this.$store.getters['salesType/pagination']
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    showModal(mode) {
      this.$refs.formModal.open(mode, this.temp)
    },
    comfirmationBody(ItemId) {
      const salesType = this.items.find(
        (item) => Number(item.id) === Number(ItemId)
      )
      return `「${salesType.name}」を削除します。よろしいですか？`
    },
    async remove(id) {
      try {
        this.$store.commit('common/loading', true)
        await this.$store.dispatch('salesType/delete', { id })
        this.$toast.success('販売タイプを削除しました。')
      } catch (error) {
        const errors = extractValidationError(error)
        const errorString = errors.global || []
        this.$toast.error(...errorString)
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    add() {
      this.temp = {
        id: null,
        name: '',
        textColor: '#000000',
      }

      this.showModal('create')
    },
    edit(item) {
      this.temp.id = item.id
      this.temp.name = item.name
      this.temp.textColor = item.textColor
      this.showModal('edit')
    },
    async handleClickDownloadCsv() {
      try {
        this.$store.commit('common/loading', true)
        const { data, headers } = await this.$api.salesType.downloadCsv()
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
.title {
  font-size: 20px !important;
  margin-bottom: 20px;
}
.new-create-btn {
  text-align: right;
  padding: 15px;
}
.breadcrumbs-bg-image {
  background-image: url('~assets/breadcrumb-bg.jpg') !important;
}
</style>
