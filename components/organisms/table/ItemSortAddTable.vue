<template>
  <table class="scroll striped bordered">
    <thead>
      <tr>
        <th></th>
        <th></th>
        <th>商品名</th>
        <th>商品番号</th>
        <th>上代</th>
        <th>販売価格</th>
        <th>在庫数</th>
        <th>公開状態</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td>
          <Checkbox v-model="checked[item.id]" />
          <span></span>
        </td>
        <td>
          <ItemThumbnail :image="item.itemImages[0]" :width="60" />
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.productNumber }}</td>
        <td>{{ item.retailPrice }}</td>
        <td>{{ item.discountedPrice }}</td>
        <td>{{ item.ecStock }}</td>
        <td>{{ commonStatusLabels[item.status] }}</td>
      </tr>
      <NoDataTableRow v-if="items.length === 0" />
      <InfiniteLoading
        ref="infiniteLoading"
        tag="tr"
        @reached-end="(event) => $emit('reached-end', event)"
      />
    </tbody>
  </table>
</template>

<script>
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import InfiniteLoading from '@/components/molecules/pagination/InfiniteLoading'
import Checkbox from '@/components/molecules/form/Checkbox'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'

export default {
  name: 'ItemSortAddTable',
  components: {
    Checkbox,
    ItemThumbnail,
    InfiniteLoading,
    NoDataTableRow,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checked: {},
    }
  },
  computed: {
    enumValueLabel() {
      return this.$store.getters['enum/valueLabel']
    },
    commonStatusLabels() {
      return this.enumValueLabel['common/status'] ?? {}
    },
  },
  methods: {
    resetChecked() {
      this.checked = {}
    },
    resetLoadingState() {
      this.$refs.infiniteLoading.resetLoadingState()
    },
    getCheckedIds() {
      return Object.keys(this.checked)
        .filter((id) => this.checked[id])
        .map(Number)
    },
  },
}
</script>

<style lang="scss" scoped>
table {
  white-space: normal;
}
</style>
