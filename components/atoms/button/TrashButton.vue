<template>
  <a href="" @click.prevent="$emit('click')"
    ><i class="material-icons">delete_forever</i></a
  >
</template>

<script>
export default {
  name: 'TrashButton',
  emits: ['click'],
}
</script>
