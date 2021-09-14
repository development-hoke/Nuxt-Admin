<template>
  <small class="error pink-text text-accent-2">
    <slot></slot>
  </small>
</template>

<script>
export default {
  name: 'ErrorMessage',
}
</script>

<style lang="scss" scoped>
.error {
  display: block;
}
</style>
