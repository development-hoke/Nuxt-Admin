<template>
  <div class="container">
    <Loading :show="$fetchState.pending" />
    <plan-form
      v-if="!$fetchState.pending"
      :inputs="inputs"
      form-type="edit"
      :plan-id="planId"
    />
  </div>
</template>

<script>
import PlanForm from '@/components/templates/plan/Form'

export default {
  components: {
    PlanForm,
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([
      this.$store.dispatch('plan/fetchOne', { id }),
      this.$store.dispatch('enum/fetch'),
    ])

    this.inputs = { ...this.plan }
  },
  data() {
    return {
      inputs: {},
    }
  },
  computed: {
    planId() {
      return Number(this.$route.params.id)
    },
    plan() {
      return this.$store.getters['plan/find'](this.planId)
    },
  },
}
</script>
