<template>
  <div
    class="color-panel"
    :style="{
      backgroundColor: color,
      width: `${width}px`,
      height: `${height}px`,
    }"
  ></div>
</template>

<script>
export default {
  name: 'ColorPanel',
  props: {
    color: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 80,
    },
    height: {
      type: Number,
      default: 100,
    },
  },
}
</script>
