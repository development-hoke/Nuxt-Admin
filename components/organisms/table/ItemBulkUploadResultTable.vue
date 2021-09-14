<template>
  <table class="bordered striped">
    <thead>
      <tr>
        <th>日付</th>
        <th>ファイル名</th>
        <th>フォーマット</th>
        <th>ステータス</th>
        <th>結果</th>
        <th>エラーリスト</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{ dayjs(item.createdAt).format('YYYY/MM/DD HH:mm') }}</td>
        <td>{{ item.fileName }}</td>
        <td>{{ itemBulkUploadFormat[item.format] }}</td>
        <td>{{ itemBulkUploadStatus[item.status] }}</td>
        <td>成功: {{ item.success }}件<br />失敗: {{ item.failure }}件</td>
        <td>
          <ButtonContainer @click="handleGetErrors(item.id)"
            >取得</ButtonContainer
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import dayjs from 'dayjs'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import { downloadFile } from '@/utils/file'
import { extractAttachmentFileName } from '@/utils/http'

export default {
  name: 'ItemBulkUploadResultTable',
  components: {
    ButtonContainer,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    enumValueLabel() {
      return this.$store.getters['enum/valueLabel']
    },
    itemBulkUploadFormat() {
      return this.enumValueLabel['itemBulkUpload/format'] ?? {}
    },
    itemBulkUploadStatus() {
      return this.enumValueLabel['itemBulkUpload/status'] ?? {}
    },
  },
  methods: {
    dayjs(...args) {
      return dayjs(...args)
    },
    async handleGetErrors(id) {
      const { data, headers } = await this.$api.itemBulkUpload.downloadErrorCsv(
        id
      )

      const fileName = extractAttachmentFileName(headers)

      downloadFile(data, fileName)
    },
  },
}
</script>
