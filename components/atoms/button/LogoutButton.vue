<template>
  <a :class="className" @click.prevent="handleClick">
    <slot>ログアウト</slot>
  </a>
</template>

<script>
export default {
  name: 'LogoutButton',
  props: {
    className: {
      type: String,
      default: 'waves-light btn-small white-text',
    },
  },
  methods: {
    async handleClick() {
      try {
        this.$store.commit('common/loading', true)

        await this.$store.dispatch('currentUser/logout')

        this.$router.push({ name: 'login' })
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>
