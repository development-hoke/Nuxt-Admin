<template>
  <a class="btn-floating waves-effect waves-light" @click.prevent="handleClick"
    ><i class="material-icons">clear_all</i></a
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
