<template>
  <tr>
    <td>{{ closedMarket.title }}</td>
    <td>
      <span class="closed-market-table-item-url" @click="handleClickUrl">{{
        closedMarket.url
      }}</span>
      <NoticeModal ref="urlCopiedNotice" type="info">
        <template #body>コピーしました</template>
      </NoticeModal>
    </td>
    <td>{{ closedMarket.password }}</td>
    <td>{{ closedMarket.itemDetail.colorId }}</td>
    <td>{{ closedMarket.itemDetail.sizeId }}</td>
    <td>{{ closedMarket.num }}</td>
    <td>{{ dayjs(closedMarket.limitAt).format('YYYY/MM/DD HH:mm:ss') }}</td>
    <td v-if="showControl">
      <EditButton @click="handleClickEdit(closedMarket)" />
      <DeleteButton
        title="闇市設定の削除"
        :body="comfirmationBody(closedMarket.title)"
        @click="handleClickDelete(closedMarket)"
      />
      <SmallErrorMessageList :messages="deleteErrors.global" />
    </td>
  </tr>
</template>

<script>
import EventEmitter from 'events'
import dayjs from 'dayjs'
import DeleteButton from '@/components/atoms/button/DeleteButton'
import EditButton from '@/components/atoms/button/EditButton'
import NoticeModal from '@/components/organisms/modal/NoticeModal'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  name: 'ClosedMarketTableItem',
  components: {
    DeleteButton,
    EditButton,
    NoticeModal,
    SmallErrorMessageList,
  },
  props: {
    closedMarket: {
      type: Object,
      required: true,
    },
    showControl: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      events: new EventEmitter(),
      deleteErrors: {},
    }
  },
  computed: {
    itemId() {
      return Number(this.$route.params.id)
    },
  },
  methods: {
    dayjs(...args) {
      return dayjs(...args)
    },

    handleClickUrl({ target }) {
      const range = document.createRange()
      const selection = window.getSelection()

      range.selectNodeContents(target)
      selection.removeAllRanges()
      selection.addRange(range)

      document.execCommand('copy')

      selection.removeAllRanges()

      this.$refs.urlCopiedNotice.open()
    },

    async handleClickDelete({ id }) {
      try {
        this.$store.commit('common/loading', true)
        await this.$store.dispatch('closedMarket/delete', { id })
      } catch (error) {
        assignErrors(this.deleteErrors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    handleClickEdit(closedMarket) {
      this.$emit('edit', { ...closedMarket })
    },
    comfirmationBody(closedMarketTitle) {
      return `以下の闇市設定を削除します。よろしいですか？\nタイトル：${closedMarketTitle}`
    },
  },
}
</script>

<style scoped lang="scss">
.closed-market-table-item-url:hover {
  cursor: pointer;
}
</style>
