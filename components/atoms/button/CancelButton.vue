<template>
  <a class="btn-flat" @click.prevent="handleClick"
    ><i class="material-icons">clear</i></a
  >
</template>

<script>
export default {
  name: 'SearchButton',
  emits: ['click'],
  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>
