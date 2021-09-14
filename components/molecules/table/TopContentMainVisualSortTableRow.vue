<template>
  <tr :class="{ pending: deletePending }">
    <td>{{ sort }}</td>
    <td>
      <TopContentMainVisualThumbnail :url="item.spPath" :width="120" />
    </td>
    <td>
      <TopContentMainVisualThumbnail :url="item.pcPath" :width="120" />
    </td>
    <td>
      <MainVisualStatusCheckbox :item="mainVisual" />
    </td>
    <td>{{ item.url }}</td>
    <td><DeleteButton @click="handleClickDelete" /></td>
  </tr>
</template>

<script>
import TopContentMainVisualThumbnail from '@/components/atoms/thumbnail/TopContentMainVisualThumbnail'
import DeleteButton from '@/components/atoms/button/DeleteButton'
import MainVisualStatusCheckbox from '@/components/organisms/form/MainVisualStatusCheckbox'

export default {
  name: 'TopContentMainVisualSortTableRow',
  components: {
    TopContentMainVisualThumbnail,
    DeleteButton,
    MainVisualStatusCheckbox,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    sort: {
      type: Number,
      required: true,
    },
    mainVisual: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deletePending: false,
    }
  },
  computed: {
    topContent() {
      return this.$store.getters['topContent/data']
    },
  },
  methods: {
    async handleClickDelete() {
      if (this.deletePending || this.$store.getters['common/pending']) {
        return
      }

      try {
        this.deletePending = true
        this.$store.commit('common/loading', true)

        const { id, storeBrand } = this.topContent

        await this.$store.dispatch('topContent/deleteMainVisuals', {
          id,
          sort: this.item.sort,
        })
        this.$toast.success('メインバナーを削除しました。')

        this.$store.dispatch('topContent/fetchByStoreBrand', { storeBrand })
      } catch (error) {
        console.error(error)
        this.$emit('error', ['削除に失敗しました'])
      } finally {
        this.$store.commit('common/loading', false)
        this.deletePending = false
      }
    },
  },
}
</script>
