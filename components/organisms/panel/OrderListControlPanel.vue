<template>
  <div class="row">
    <div class="col s12 pane">
      <select v-model="inputCsvType" class="browser-default select">
        <option
          v-for="option in options"
          :key="option.code"
          :value="option.code"
          >{{ option.name }}</option
        >
      </select>
      <ButtonContainer class="export-csv-button" @click="handleClickDownload"
        >検索結果をダウンロード</ButtonContainer
      >
    </div>
  </div>
</template>

<script>
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import { downloadFile } from '@/utils/file'
import { extractAttachmentFileName } from '@/utils/http'

const CSV_TYPE_ORDER = 1
const CSV_TYPE_ORDER_DETAIL = 2

export default {
  name: 'OrderListControlPanel',
  components: {
    ButtonContainer,
  },
  data() {
    return {
      options: [
        { code: CSV_TYPE_ORDER, name: '受注単位' },
        { code: CSV_TYPE_ORDER_DETAIL, name: '明細単位' },
      ],
      inputCsvType: CSV_TYPE_ORDER,
    }
  },
  methods: {
    async handleClickDownload() {
      try {
        this.$store.commit('common/loading', true)

        const query = { ...this.$route.query }

        delete query.page

        const { data, headers } =
          this.inputCsvType === CSV_TYPE_ORDER
            ? await this.$api.order.downloadCsv(query)
            : await this.$api.order.downloadDetailCsv(query)

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

<style scoped lang="scss">
.pane {
  display: flex;

  .select {
    max-width: 240px;
  }

  .export-csv-button {
    display: block;
    margin: 4px 0 0 12px;
    min-width: 244px;
  }
}
</style>
