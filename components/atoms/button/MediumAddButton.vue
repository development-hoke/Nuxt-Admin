<template>
  <button
    class="btn mb-1 waves-effect waves-light mr-1"
    @click="$emit('click')"
  >
    <slot>追加</slot>
    <i class="material-icons left">add</i>
  </button>
</template>

<script>
export default {
  name: 'MediumAddButton',
  emits: ['click'],
}
</script>
