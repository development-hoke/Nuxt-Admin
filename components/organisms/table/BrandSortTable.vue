<template>
  <SortableTable
    :key="componentKey"
    :value="sortedIndices"
    :disabled="sortPending"
    @update="handleUpdateSort"
  >
    <template #header>
      <tr>
        <th data-field="section">ブランド区分</th>
        <th data-field="name">ブランド名</th>
        <th data-field="store_brand">所属ストアブランド</th>
        <th data-field="kana">読み</th>
        <th data-field="category">分類</th>
        <th data-field="sort">表示順</th>
        <th data-field="action"></th>
      </tr>
    </template>
    <template #body>
      <tr v-for="brand in sortedItems" :key="brand.id">
        <td>{{ brandSection[Number(brand.section)] }}</td>
        <td>{{ brand.name }}</td>
        <td>
          {{ commonStoreBrand[Number(brand.storeBrand)] }}
        </td>
        <td>{{ brand.kana }}</td>
        <td>{{ showBrandCategory(brand.category) }}</td>
        <td>{{ brand.sort }}</td>
        <td>
          <div class="sub-btns">
            <nuxt-link
              :to="{
                name: 'master-brand-detail-id',
                params: { id: brand.id },
              }"
              class="btn waves-effect waves-light lightrn-1"
              >詳細</nuxt-link
            >
            <nuxt-link
              :to="{
                name: 'master-brand-edit-id',
                params: { id: brand.id },
              }"
              class="btn waves-effect waves-light purple accent-2"
              >編集</nuxt-link
            >
          </div>
          <small-error-message-list
            v-show="errors.global.length"
            :messages="errors.global"
          />
        </td>
      </tr>
      <NoDataTableRow v-if="sortedItems.length === 0" />
      <tr class="loading-tr">
        <td colspan="8">
          <Loading :show="fetchPending" />
        </td>
      </tr>
    </template>
  </SortableTable>
</template>

<script>
import SortableTable from '@/components/organisms/input/SortableTable'
import { extractValidationError } from '@/plugins/vee-validate'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import NoDataTableRow from '@/components/molecules/table/NoDataTableRow'

export default {
  name: 'BrandSortTable',
  emits: ['sorted', 'add', 'error'],
  components: {
    SortableTable,
    SmallErrorMessageList,
    NoDataTableRow,
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
  async fetch() {
    await Promise.all([this.$store.dispatch('enum/fetch')])
  },
  data() {
    return {
      itemCache: [],
      sortPending: false,
      pendingIndex: null,
      componentKey: 0,
      errors: {
        global: [],
      },
    }
  },
  computed: {
    loading() {
      return this.$store.getters['common/loading']
    },
    enumValueLabels() {
      return this.$store.getters['enum/valueLabel']
    },
    commonStoreBrand() {
      return this.enumValueLabels['common/storeBrand'] ?? {}
    },
    brandSection() {
      return this.enumValueLabels['brand/section'] ?? {}
    },
    brandCategory() {
      return this.enumValueLabels['brand/category'] ?? {}
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
        await this.$store.commit('common/pending', true)

        // console.log(item)
        // console.log(sort)

        await this.$store.dispatch('brand/updateSort', {
          id: item.id,
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

      // console.log(newIndex)
      // console.log(oldIndex)
      // console.log(sort)

      this.$set(this.itemCache[oldIndex], 'sort', sort)

      console.log(this.itemCache)

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
    showBrandCategory(category) {
      return category ? this.brandCategory[Number(category)] : '-'
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
