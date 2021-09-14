<template>
  <table>
    <thead>
      <slot name="header"></slot>
    </thead>
    <Draggable
      v-model="sort"
      :class="{ disabled: disabled }"
      tag="tbody"
      :disabled="disabled"
      @update="(event) => $emit('update', event)"
    >
      <slot name="body"></slot>
    </Draggable>
  </table>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'SortableTable',
  emits: ['input', 'update'],
  components: {
    Draggable,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sort: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style scoped lang="scss">
table tbody {
  ::v-deep tr {
    cursor: move;
  }

  &.disabled {
    ::v-deep tr {
      cursor: default;
    }
  }
}
</style>
