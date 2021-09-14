<template>
  <a
    href=""
    class="btn-floating btn-small waves-effect waves-light"
    @click.prevent="$emit('click')"
    ><i class="material-icons">add</i></a
  >
</template>

<script>
export default {
  name: 'AddButton',
  emits: ['click'],
}
</script>
