<template>
  <button
    class="waves-effect waves-light btn gradient-45deg-red-pink box-shadow-none border-round mr-1 mb-1"
    @click="$emit('click')"
  >
    <slot>X 削除</slot>
  </button>
</template>

<script>
export default {
  name: 'MediumDeleteButton',
  emits: ['click'],
}
</script>
