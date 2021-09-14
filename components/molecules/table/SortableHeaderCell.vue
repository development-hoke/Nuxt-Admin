<template>
  <th @click="$emit('click')">
    <div class="sortable">
      <slot></slot>
      <i class="material-icons">{{ sortIcon[order] }}</i>
    </div>
  </th>
</template>

<script>
import { ORDER_ASC, ORDER_DESC } from '@/constants/sort'

export default {
  name: 'SortableHeaderCell',
  props: {
    order: {
      type: String,
      default: ORDER_ASC,
      validate(value) {
        return [ORDER_ASC, ORDER_DESC].includes(value)
      },
    },
  },
  data() {
    return {
      sortIcon: {
        asc: 'arrow_downward',
        desc: 'arrow_upward',
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.sortable {
  display: flex;
  position: relative;

  &:hover {
    cursor: pointer;
  }

  .material-icons {
    font-size: 13px;
    position: relative;
    display: block;
    margin: auto 0;
  }
}
</style>
