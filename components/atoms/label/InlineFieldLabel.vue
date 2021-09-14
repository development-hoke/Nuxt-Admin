<template>
  <label class="inline-field-label"><slot></slot></label>
</template>

<script>
export default {
  name: 'InlineFieldLabel',
}
</script>

<style lang="scss" scoped>
.inline-field-label {
  margin-top: 14px;
  text-align: center;
  font-size: 15px;
}
</style>
