<template>
  <div>
    <template v-for="type in types">
      <div v-if="notices[type].length > 0" :key="type">
        <notice
          v-for="(message, index) in notices[type]"
          :key="index"
          :type="type"
          @close="$store.commit('notice/remove', { type, index })"
          >{{ message }}</notice
        >
      </div>
    </template>
  </div>
</template>

<script>
import Notice from '@/components/molecules/notice/Notice'
export default {
  components: {
    Notice,
  },
  data() {
    return {
      types: ['info', 'warn', 'error'],
    }
  },
  computed: {
    notices() {
      return this.types.reduce(
        (notices, type) => ({
          ...notices,
          [type]: this.$store.getters[`notice/${type}`],
        }),
        {}
      )
    },
  },
}
</script>
