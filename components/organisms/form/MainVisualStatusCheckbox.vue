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
  name: 'MainVisualStatusCheckbox',
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
  computed: {
    topContent() {
      return this.$store.getters['topContent/data']
    },
  },
  methods: {
    async handleChangeStatus(status) {
      if (this.$store.getters['common/loading']) {
        return
      }

      const { id, storeBrand } = this.topContent

      try {
        this.$store.commit('common/loading', true)
        await this.$store.dispatch('topContent/updateStatusMainVisuals', {
          id,
          sort: this.item.sort,
          params: {
            status: this.value,
          },
        })
        this.$toast.success('メインバナーを更新しました。')

        this.$store.dispatch('topContent/fetchByStoreBrand', { storeBrand })
      } catch (error) {
        console.error(error)
        this.value = !status
        this.$emit('error', ['公開状態の更新に失敗しました'])
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>
