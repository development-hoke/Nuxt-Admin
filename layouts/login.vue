<template>
  <div class="row root doc">
    <transition name="page">
      <Nuxt />
    </transition>
  </div>
</template>

<script>
export default {
  head: {
    bodyAttrs: {
      class:
        'vertical-layout vertical-menu-collapsible page-header-dark vertical-modern-menu 1-column login-bg blank-page blank-page',
    },
  },
}
</script>

<style lang="scss">
#login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .card-panel.border-radius-6.login-card {
    margin-left: 0 !important;
  }
}
</style>
