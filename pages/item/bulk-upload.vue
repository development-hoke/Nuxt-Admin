<template>
  <div>
    <breadcrumb :items="breadcrumbs" />
    <div class="container">
      <div class="section">
        <div class="card">
          <div class="card-content">
            <div class="row">
              <div class="col s3">
                <large-title>商品情報一括登録</large-title>
              </div>
            </div>
            <div class="row mb-2">
              <ControlPanel class="col s12">
                <select
                  v-model="selectedFormat"
                  class="browser-default format-select"
                >
                  <option
                    v-for="(option, index) in itemBulkUploadFormatOptions"
                    :key="index"
                    :value="option.code"
                  >
                    {{ option.name }}
                  </option>
                </select>
                <ButtonContainer
                  :disabled="loading"
                  @click="hanleClickGetItemCsvFormat"
                  >フォーマット取得</ButtonContainer
                >
                <FileInputGroup
                  v-if="isSelectedImageFormat"
                  :disabled="loading"
                  encoding="none"
                  @input="handleInputFile"
                >
                  <template #button>一括登録</template>
                </FileInputGroup>
                <FileInputGroup
                  v-else
                  :disabled="loading"
                  @input="handleInputFile"
                >
                  <template #button>一括登録</template>
                </FileInputGroup>
              </ControlPanel>
            </div>
            <div class="row">
              <div class="col s12">
                <ItemBulkUploadResultTable
                  v-if="!$fetchState.pending"
                  :items="itemBulkUploads"
                />
                <Loading :show="$fetchState.pending" />
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
import FileInputGroup from '@/components/molecules/input/FileInputGroup'
import ItemBulkUploadResultTable from '@/components/organisms/table/ItemBulkUploadResultTable'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import ControlPanel from '@/components/molecules/panel/ControlPanel'
import { extractValidationError } from '@/plugins/vee-validate'
import { downloadFile } from '@/utils/file'
import { extractAttachmentFileName } from '@/utils/http'

export default {
  name: 'ItemBulkUpload',
  components: {
    Breadcrumb,
    LargeTitle,
    FileInputGroup,
    ItemBulkUploadResultTable,
    ButtonContainer,
    ControlPanel,
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('itemBulkUpload/fetch'),
      this.$store.dispatch('enum/fetch'),
    ])

    this.selectedFormat = this.itemBulkUploadFormatKv.image
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '商品管理',
          route: { name: 'item' },
        },
        {
          name: '商品情報一括登録',
          route: { name: 'item-bulk-upload' },
        },
      ],
      selectedFormat: null,
    }
  },
  computed: {
    ...mapGetters({
      itemBulkUploads: 'itemBulkUpload/data',
      loading: 'common/loading',
      enumKv: 'enum/kv',
      enumOptions: 'enum/options',
    }),
    itemBulkUploadFormatKv() {
      return this.enumKv['itemBulkUpload/format'] || {}
    },
    itemBulkUploadFormatOptions() {
      return this.enumOptions['itemBulkUpload/format'] || []
    },
    isSelectedImageFormat() {
      return this.selectedFormat === this.itemBulkUploadFormatKv.image
    },
  },
  methods: {
    async handleInputFile(input) {
      if (this.loading) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        const data = await (this.isSelectedImageFormat
          ? this.sendItemImages(input)
          : this.sendItemCsv(input))

        this.$store.commit('itemBulkUpload/setOnePrepend', data, true)
        this.$toast.success('アップロードが完了しました。')
      } catch (error) {
        const errors = extractValidationError(error)
        const key =
          Object.keys(errors).find((key) => key !== 'global') || 'global'
        this.$toast.error(errors[key][0])
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    async sendItemCsv(input) {
      const { data } = await this.$api.itemBulkUpload.storeItemCsv({
        content: input.base64,
        fileName: input.name,
      })

      return data
    },

    async sendItemImages(file) {
      const payload = new FormData()

      payload.append('content', file)

      const { data } = await this.$api.itemBulkUpload.storeItemImages(payload)

      return data
    },

    async hanleClickGetItemCsvFormat() {
      try {
        this.$store.commit('common/loading', true)

        const { data, headers } = await (this.isSelectedImageFormat
          ? this.$api.itemBulkUpload.downloadItemImageCsvFormat()
          : this.$api.itemBulkUpload.downloadItemCsvFormat())

        const fileName = extractAttachmentFileName(headers)

        downloadFile(data, fileName)
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.format-select {
  max-width: 200px;
}
</style>
