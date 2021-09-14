<template>
  <small class="pink-text text-accent-2">
    <slot></slot>
  </small>
</template>

<script>
export default {
  name: 'SmallErrorMessage',
}
</script>

<style scoped lang="scss">
.error {
  display: block;
}
</style>
