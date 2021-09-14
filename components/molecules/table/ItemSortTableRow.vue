<template>
  <tr :class="{ pending: deletePending }">
    <td>{{ sort }}</td>
    <td>
      <ItemThumbnail :image="item.item.itemImages[0]" :width="60" />
    </td>
    <td>{{ item.item.name }}</td>
    <td>{{ item.item.productNumber }}</td>
    <td>{{ item.item.retailPrice }}</td>
    <td>{{ item.item.discountedPrice }}</td>
    <td>{{ item.item.ecStock }}</td>
    <td><DeleteButton @click="handleClickDelete" /></td>
  </tr>
</template>

<script>
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import DeleteButton from '@/components/atoms/button/DeleteButton'

export default {
  name: 'ItemSortTableRow',
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
  },
  data() {
    return {
      deletePending: false,
    }
  },
  methods: {
    async handleClickDelete() {
      if (this.deletePending || this.$store.getters['common/pending']) {
        return
      }

      try {
        this.deletePending = true
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('itemSort/delete', {
          id: this.item.id,
        })
        this.$toast.success('商品優先度表示を削除しました。')
        const params = {
          storeBrand: this.item.storeBrand ?? null,
        }

        this.$store.dispatch('itemSort/fetch', { params })
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
