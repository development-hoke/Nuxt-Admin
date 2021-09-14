<template>
  <div class="container">
    <Loading :show="$fetchState.pending" />
    <plan-detail v-if="!$fetchState.pending" :plan="plan" />
  </div>
</template>

<script>
import PlanDetail from '@/components/templates/plan/Detail'

export default {
  components: {
    PlanDetail,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([this.$store.dispatch('plan/fetchOne', { id })])
  },
  data() {
    return {}
  },
  computed: {
    planId() {
      return Number(this.$route.params.id)
    },
    plan() {
      return this.$store.getters['plan/data'].find(
        ({ id }) => Number(id) === this.planId
      )
    },
  },
}
</script>
