<template>
  <div>
    <div class="container">
      <Loading :show="$fetchState.pending" />
      <div class="section">
        <dl class="row">
          <div class="col s12 ml-1 mb-3">
            {{ isItemSetting }}
          </div>
        </dl>
        <div class="row">
          <div class="col s12">
            <PlanItemListTable
              v-if="!$fetchState.pending"
              :items="plan.items"
              :type="type"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PlanItemListTable from '@/components/organisms/table/PlanItemListTable'

export default {
  components: {
    PlanItemListTable,
  },
  async fetch() {
    const { id } = this.$route.params

    await this.$store.dispatch('plan/fetchOne', { id })
  },
  data() {
    return {
      type: 'detail',
    }
  },
  computed: {
    ...mapGetters({
      loading: 'common/loading',
      enumKv: 'enum/kv',
    }),
    planId() {
      return Number(this.$route.params.id)
    },
    plan() {
      return this.$store.getters['plan/find'](this.planId)
    },
    isItemSetting() {
      if (this.plan) {
        return this.plan.isItemSetting === true
          ? '商品一覧を掲載する'
          : '商品一覧を掲載しない'
      }
      return null
    },
  },
}
</script>
