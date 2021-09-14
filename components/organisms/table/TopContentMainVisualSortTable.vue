<template>
  <SortableTable
    :key="componentKey"
    :value="sortedIndices"
    :disabled="sortPending"
    @update="handleUpdateSort"
  >
    <template #header>
      <tr>
        <th></th>
        <th>SP用バナー</th>
        <th>PC用バナー</th>
        <th>公開状態</th>
        <th>URL</th>
        <th>削除</th>
      </tr>
    </template>
    <template #body>
      <TopContentMainVisualSortTableRow
        v-for="(item, index) in sortedMainVisuals"
        :key="item.id"
        :class="{ pending: sortPending && pendingIndex === index }"
        :item="item"
        :sort="index + 1"
        :main-visual="item"
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
import TopContentMainVisualSortTableRow from '@/components/molecules/table/TopContentMainVisualSortTableRow'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import { extractValidationError } from '@/plugins/vee-validate'

export default {
  name: 'TopContentMainVisualSortTable',
  emits: ['sorted', 'add', 'error'],
  components: {
    SortableTable,
    TopContentMainVisualSortTableRow,
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

    sortedMainVisuals() {
      const items = this.sortPending ? this.itemCache : this.items

      return items
        .map((item) => ({ ...item }))
        .sort((i1, i2) => i1.sort - i2.sort)
    },
    sortedIndices() {
      return this.sortedMainVisuals.map((_, i) => i)
    },
    topContent() {
      return this.$store.getters['topContent/data']
    },
  },
  methods: {
    async handleUpdateSort({ newIndex, oldIndex }) {
      if (this.sortPending) {
        return
      }

      try {
        const item = this.sortedMainVisuals[oldIndex]
        const sort = newIndex + 1

        this.adjustSort(newIndex, oldIndex, sort)
        this.sortPending = true
        this.pendingIndex = newIndex
        this.$store.commit('common/pending', true)

        await this.$store.dispatch('topContent/updateMainVisuals', {
          id: this.topContent.id,
          params: {
            oldIndex,
            ...item,
            newSort: sort,
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
      this.itemCache = this.sortedMainVisuals.map((item) => ({ ...item }))

      const target = this.itemCache[oldIndex]

      const upward = target.sort < sort

      this.$set(this.itemCache[oldIndex], 'sort', sort)

      this.itemCache.forEach((item, index) => {
        if (Number(item.id) === Number(target.id)) {
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
