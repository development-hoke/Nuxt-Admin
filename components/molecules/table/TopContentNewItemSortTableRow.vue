<template>
  <tr :class="{ pending: deletePending }">
    <td>{{ sort }}</td>
    <td>
      <ItemThumbnail :image="item.itemImages[0]" :width="60" />
    </td>
    <td>{{ item.name }}</td>
    <td>{{ item.productNumber }}</td>
    <td>{{ item.retailPrice }}</td>
    <td>{{ item.discountedPrice }}</td>
    <td>{{ item.ecStock }}</td>
    <td><DeleteButton @click="handleClickDelete" /></td>
  </tr>
</template>

<script>
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import DeleteButton from '@/components/atoms/button/DeleteButton'

export default {
  name: 'TopContentNewItemSortTableRow',
  components: {
    ItemThumbnail,
    DeleteButton,
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
    newItem: {
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

        await this.$store.dispatch('topContent/deleteNewItems', {
          id,
          itemId: this.item.id,
        })
        this.$toast.success('新着商品を削除しました。')

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
