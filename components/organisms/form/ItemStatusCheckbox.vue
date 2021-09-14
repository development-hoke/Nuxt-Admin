<template>
  <Checkbox
    v-model="value"
    class="switch"
    label-class="lever"
    @input="handleChangeStatus"
  />
</template>

<script>
import Checkbox from '@/components/molecules/form/Checkbox'

export default {
  name: 'ItemStatusCheckbox',
  components: {
    Checkbox,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: this.item.status,
    }
  },
  methods: {
    async handleChangeStatus(status) {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        const { id } = this.item
        this.$store.commit('common/loading', true)
        await this.$store.dispatch('item/updateStatus', { id, status })
      } catch (error) {
        console.error(error)
        this.value = !status
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>
