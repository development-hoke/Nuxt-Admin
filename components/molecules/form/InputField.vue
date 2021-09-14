<template>
  <div class="doc" :class="inputFieldClass">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    inputFieldClass: {
      type: String,
      default: 'input-field',
    },
  },
}
</script>
