<template>
  <div class="row">
    <breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <div class="title">{{ PAGE_TITLE }}</div>
              <div class="row mb-2">
                <div class="col s12 right-align-md">
                  <ButtonContainer
                    type="primary"
                    @click="handleClickDownloadCsv"
                    >CSV出力</ButtonContainer
                  >
                </div>
              </div>
              <div class="row">
                <div class="col s12">
                  <table class="border-outline">
                    <thead>
                      <tr>
                        <th data-field="color-number">色番号</th>
                        <th data-field="color-name">色名称</th>
                        <th data-field="color-value">カラーコード</th>
                        <th data-field="display-name">表示色名</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="color in colorCache" :key="color.id">
                        <td>{{ color.id }}</td>
                        <td>{{ color.name }}</td>
                        <td>
                          <color-picker-with-input
                            v-model="color.colorPanel"
                            :color-id="color.id"
                            parentDataName="colorCache"
                            :show-color-picker.sync="color.showColorPicker"
                            @input="(value) => handleInput(color.id, value)"
                          />
                        </td>
                        <text-field
                          v-model="color.displayName"
                          wrapper-tag="td"
                          type="text"
                          input-field-class="form-control"
                          @input="(value) => handleInput(color.id, value)"
                        />
                        <td>
                          <a
                            href=""
                            class="btn-floating btn-small waves-effect waves-light"
                            @click.prevent="handleClickSave(color.id)"
                            ><i class="material-icons">save</i></a
                          >
                        </td>
                      </tr>
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
  </div>
</template>

<script>
import ColorPickerWithInput from '@/components/molecules/input/ColorPickerWithInput'
import TextField from '@/components/molecules/form/TextField'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import Pagination from '@/components/molecules/pagination/Pagination'
import { downloadFile } from '@/utils/file'
import { extractAttachmentFileName } from '@/utils/http'

const PAGE_TITLE = '色パネル・表示色マスタ'

export default {
  components: {
    ColorPickerWithInput,
    TextField,
    Breadcrumb,
    ButtonContainer,
    Pagination,
  },
  validate({ query }) {
    return query.page ? /^\d+$/.test(query.page) : true
  },
  watchQuery: ['page'],
  async fetch() {
    const { query } = this.$route
    this.colorCache = []
    this.$store.commit('color/clear')
    await this.$store.dispatch('color/fetch', { page: query.page })
    this.initColorCache()
  },
  data() {
    return {
      PAGE_TITLE,
      breadcrumbs: [
        {
          name: 'マスタ管理',
          route: { name: 'master-brand' },
        },
        {
          name: PAGE_TITLE,
          route: { name: 'master-color-panel' },
        },
      ],
      changed: {},
      colorCache: (this.colors || []).map((color) => ({
        ...color,
        showColorPicker: false,
      })),
    }
  },
  computed: {
    colors() {
      return this.$store.getters['color/data']
    },
    pagination() {
      return this.$store.getters['color/pagination']
    },
  },
  watch: {
    '$route.query': '$fetch',
  },
  methods: {
    async handleClickSave(id) {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        if (!this.changed[id]) {
          return
        }

        const params = this.colorCache.find(
          (color) => Number(color.id) === Number(id)
        )

        if (!params) {
          return
        }

        this.$store.commit('common/loading', true)

        await this.$store.dispatch('color/update', {
          params,
          id,
        })

        this.$set(this.changed, id, false)
        this.$toast.success('色パネル・表示色マスタを更新しました')
      } catch (error) {
        this.$toast.error('色パネル・表示色マスタ更新に失敗しました')
        console.error(error)
        throw error
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    initColorCache() {
      this.colorCache = this.colors.map((color) => ({
        ...color,
        showColorPicker: false,
      }))
      this.changed = this.colors.reduce(
        (changed, { id }) => ({ ...changed, [id]: false }),
        {}
      )
    },
    handleInput(id, value) {
      this.$set(this.changed, id, true)
    },
    async handleClickDownloadCsv() {
      try {
        this.$store.commit('common/loading', true)
        const { data, headers } = await this.$api.color.downloadCsv()
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
input {
  width: auto !important;
  height: 45px !important;
  border: 0.5px solid #03a9f4 !important;
  text-align: center;
  margin: 0 !important;
}
input:focus {
  border-bottom: none !important;
}
.breadcrumbs-bg-image {
  background-image: url('~assets/breadcrumb-bg.jpg') !important;
}
.new-create-btn {
  text-align: right;
  padding: 15px;
}
</style>
