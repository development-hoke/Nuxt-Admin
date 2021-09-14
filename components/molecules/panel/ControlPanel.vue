<template>
  <div :class="derectionCss">
    <slot></slot>
  </div>
</template>

<script>
const directionCssMap = {
  right: 'right-style',
  left: 'left-style',
}

export default {
  name: 'ControlPanel',
  props: {
    direction: {
      type: String,
      default: 'right',
      validate(value) {
        return Object.keys(directionCssMap).includes(value)
      },
    },
  },
  computed: {
    derectionCss() {
      return directionCssMap[this.direction]
    },
  },
}
</script>

<style lang="scss" scoped>
.right-style {
  display: flex;
  justify-content: flex-end;

  > *:not(:first-child) {
    margin-left: 8px;
  }
}

.left-style {
  display: flex;
  justify-content: flex-start;

  > *:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
