<template>
  <a
    href=""
    class="btn-floating btn-small waves-effect waves-light"
    @click.prevent="$emit('click')"
    ><i class="material-icons">edit</i></a
  >
</template>

<script>
export default {
  name: 'EditButton',
  emits: ['click'],
}
</script>
