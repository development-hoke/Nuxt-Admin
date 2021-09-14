<template>
  <h2 class="title"><slot></slot></h2>
</template>

<script>
export default {
  name: 'LargeTitle',
}
</script>

<style scoped>
.title {
  font-size: 20px !important;
}
</style>
