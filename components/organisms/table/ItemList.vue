<template>
  <table class="bordered striped">
    <thead>
      <tr>
        <th data-field="">サムネイル</th>
        <th data-field="">商品名</th>
        <th data-field="">ヤマダヤ<br />品番</th>
        <th data-field="">メーカー<br />品番</th>
        <th data-field="">上代</th>
        <th data-field="">販売<br />価格</th>
        <th data-field="">総在庫数</th>
        <th data-field="">公開<br />状態</th>
        <th data-field=""></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>
          <ItemThumbnail :alt="item.name" :image="item.itemImages[0]" />
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.productNumber }}</td>
        <td>{{ item.makerProductNumber }}</td>
        <td>{{ item.retailPrice }}</td>
        <td>{{ item.discountedPrice }}</td>
        <td>{{ item.ecStock }}</td>
        <td>
          <ItemStatusCheckbox :item="item" />
        </td>
        <td>
          <nuxt-link
            class="btn-floating btn-small waves-effect waves-light"
            :to="{ name: 'item-edit-id-basic', params: { id: item.id } }"
            ><i class="material-icons">edit</i></nuxt-link
          >
          <nuxt-link
            class="btn-floating btn-small waves-effect waves-light"
            :to="{ name: 'item-detail-id-basic', params: { id: item.id } }"
            ><i class="material-icons">library_books</i></nuxt-link
          >
          <p
            class="btn-floating btn-small red waves-effect waves-light"
            @click="handleRevmoe(item.id)"
          >
            <i class="material-icons">delete</i>
          </p>
        </td>
      </tr>
      <NoDataTableRow v-if="items.length === 0" />
    </tbody>
  </table>
</template>

<script>
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import ItemStatusCheckbox from '@/components/organisms/form/ItemStatusCheckbox'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'

export default {
  name: 'ItemList',
  components: {
    ItemThumbnail,
    ItemStatusCheckbox,
    NoDataTableRow,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async handleRevmoe(id) {
      try {
        this.$store.commit('common/loading', true)
        await this.$store.dispatch('item/deleteItem', { id })
        this.$toast.success('オンライン分類を削除しました。')
      } catch (error) {
        this.$toast.error('オンライン分類の削除に失敗しました。')
        console.error(error)
        throw error
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>
