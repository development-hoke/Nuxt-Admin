<template>
  <OrderTextareaForm
    v-model="value"
    :submit-hander="() => handleSubmit()"
    :server-errors="serverErrors"
    :disabled-submit="loading"
  />
</template>

<script>
import OrderTextareaForm from '@/components/organisms/form/OrderTextareaForm'
export default {
  name: 'OrderTextareaFormContainer',
  components: {
    OrderTextareaForm,
  },
  props: {
    orderId: {
      type: Number,
      required: true,
    },
    parameterName: {
      type: String,
      required: true,
      validate(value) {
        return ['memo1', 'memo2', 'shopMemo'].includes(value)
      },
    },
    parameterDisplayName: {
      type: String,
      required: true,
    },
    defaultValue: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      value: this.defaultValue,
      serverErrors: {},
    }
  },
  computed: {
    loading() {
      return this.$store.getters['common/loading']
    },
  },
  methods: {
    async handleSubmit() {
      if (this.loading) {
        return
      }
      try {
        this.$store.commit('common/loading', true)
        const params = { [this.parameterName]: this.value }
        await this.$store.dispatch('order/update', { id: this.orderId, params })
        this.$toast.success(`${this.parameterDisplayName}を更新しました。`)
      } catch (error) {
        console.error(error)
        this.$toast.error(`${this.parameterDisplayName}の更新に失敗しました。`)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>
