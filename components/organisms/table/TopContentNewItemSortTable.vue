<template>
  <SortableTable
    :key="componentKey"
    :value="sortedIndices"
    :disabled="sortPending"
    @update="handleUpdateSort"
  >
    <template #header>
      <tr>
        <th>表示順序</th>
        <th></th>
        <th>商品名</th>
        <th>商品番号</th>
        <th>上代</th>
        <th>販売価格</th>
        <th>在庫数</th>
        <th></th>
      </tr>
    </template>
    <template #body>
      <TopContentNewItemSortTableRow
        v-for="(item, index) in sortedItems"
        :key="index"
        :class="{ pending: sortPending && pendingIndex === index }"
        :item="item.item"
        :sort="index + 1"
        :new-item="item"
        @error="(error) => $emit('error', error)"
      />
      <tr class="loading-tr">
        <td colspan="8">
          <Loading :show="fetchPending" />
        </td>
      </tr>
      <tr>
        <td colspan="8">
          <ButtonContainer
            v-if="items.length < 4"
            :disabled="fetchPending || loading"
            @click="$emit('add')"
            >追加</ButtonContainer
          >
        </td>
      </tr>
    </template>
  </SortableTable>
</template>

<script>
import SortableTable from '@/components/organisms/input/SortableTable'
import TopContentNewItemSortTableRow from '@/components/molecules/table/TopContentNewItemSortTableRow'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import { extractValidationError } from '@/plugins/vee-validate'

export default {
  name: 'TopContentNewItemSortTable',
  emits: ['sorted', 'add', 'error'],
  components: {
    SortableTable,
    TopContentNewItemSortTableRow,
    ButtonContainer,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    fetchPending: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      itemCache: [],
      sortPending: false,
      pendingIndex: null,
      componentKey: 0,
    }
  },
  computed: {
    loading() {
      return this.$store.getters['common/loading']
    },

    topContent() {
      return this.$store.getters['topContent/data']
    },

    sortedItems() {
      const items = this.sortPending ? this.itemCache : this.items

      return items
        .map((item) => ({ ...item }))
        .sort((i1, i2) => i1.sort - i2.sort)
    },

    sortedIndices() {
      return this.sortedItems.map((_, i) => i)
    },
  },
  methods: {
    async handleUpdateSort({ newIndex, oldIndex }) {
      if (this.sortPending) {
        return
      }

      try {
        const item = this.sortedItems[oldIndex]
        const sort = newIndex + 1

        this.adjustSort(newIndex, oldIndex, sort)
        this.sortPending = true
        this.pendingIndex = newIndex
        this.$store.commit('common/pending', true)

        await this.$store.dispatch('topContent/updateNewItems', {
          id: this.topContent.id,
          itemId: item.itemId,
          params: {
            sort,
          },
        })
        this.componentKey += 1
        this.$emit('sorted')
      } catch (error) {
        console.error(error)
        this.$emit('error', extractValidationError(error).global)
      } finally {
        this.pendingIndex = null
        this.sortPending = false
        this.$store.commit('common/pending', false)
      }
    },

    adjustSort(newIndex, oldIndex, sort) {
      this.itemCache = this.sortedItems.map((item) => ({ ...item }))

      const target = this.itemCache[oldIndex]

      const upward = target.sort < sort

      this.$set(this.itemCache[oldIndex], 'sort', sort)

      this.itemCache.forEach((item, index) => {
        if (Number(item.itemId) === Number(target.itemId)) {
          return
        }

        if (upward) {
          if (index > newIndex) {
            this.$set(item, 'sort', item.sort + 1)
          } else {
            this.$set(item, 'sort', item.sort - 1)
          }
        } else if (index >= newIndex) {
          this.$set(item, 'sort', item.sort + 1)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.pending {
  opacity: 0.5;
}
.loading-tr {
  border: 0;
  padding: 0;
  margin: 0;
  td {
    border: 0;
    padding: 0;
    margin: 0;
  }
}
</style>
