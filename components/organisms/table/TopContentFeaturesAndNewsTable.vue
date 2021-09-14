<template>
  <SortableTable
    :value="sortedIndices"
    :disabled="sortPending"
    @update="handleUpdateSort"
  >
    <template #header>
      <tr>
        <th>表示順序</th>
        <th>タイトル</th>
      </tr>
    </template>
    <template #body>
      <tr v-for="n of 6" :key="n">
        <td>{{ n }}</td>
        <td>
          <SelectInput
            v-model="items[n - 1]"
            :options="itemPlanOptions"
            name="items"
            type="text"
            :rules="{
              integer: true,
            }"
            :valid-name="name"
            @input="handleSelectItem"
          />
        </td>
      </tr>
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
import SelectInput from '@/components/molecules/form/SelectInput'
import { extractValidationError } from '@/plugins/vee-validate'

const DISPLAY_PLACE_FEATURE = 1
const DISPLAY_PLACE_NEWS = 2

export default {
  name: 'TopContentFeaturesAndNewsTable',
  emits: ['sorted', 'add', 'error'],
  components: {
    SortableTable,
    SelectInput,
  },
  props: {
    plans: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    itemOrigin: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      required: true,
    },
    place: {
      type: Number,
      required: true,
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
    }
  },
  computed: {
    itemPlanOptions() {
      const itemPlans = this.plans.filter((plan) => plan.place === this.place)
      return itemPlans.map((itemPlan) => ({
        code: itemPlan.id,
        name: itemPlan.title,
      }))
    },
    loading() {
      return this.$store.getters['common/loading']
    },

    sortedPlans() {
      const items = this.sortPending ? this.itemCache : this.itemOrigin

      return items
        .map((item) => ({ ...item }))
        .sort((i1, i2) => i1.sort - i2.sort)
    },
    sortedIndices() {
      return this.sortedPlans.map((_, i) => i)
    },
    topContent() {
      return this.$store.getters['topContent/data']
    },
  },
  methods: {
    handleSelectItem() {
      const items = this.items.filter(function (x, i, self) {
        return self.indexOf(x) === i && x !== null
      })
      this.$emit('add', items)
    },
    async handleUpdateSort({ newIndex, oldIndex }) {
      if (this.sortPending) {
        return
      }

      try {
        const item = this.sortedPlans[oldIndex]
        const sort = newIndex + 1

        this.adjustSort(newIndex, oldIndex, sort)
        this.sortPending = true
        this.pendingIndex = newIndex
        this.$store.commit('common/pending', true)
        if (this.place === DISPLAY_PLACE_NEWS) {
          await this.$store.dispatch('topContent/updateSortNews', {
            id: this.topContent.id,
            planId: item.planId,
            params: {
              sort,
            },
          })
        } else if (this.place === DISPLAY_PLACE_FEATURE) {
          await this.$store.dispatch('topContent/updateSortFeatures', {
            id: this.topContent.id,
            planId: item.planId,
            params: {
              sort,
            },
          })
        }
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
      this.itemCache = this.sortedPlans.map((item) => ({ ...item }))

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
