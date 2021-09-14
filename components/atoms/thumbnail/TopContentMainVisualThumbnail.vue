<template>
  <img
    :class="className"
    :width="width"
    :height="height"
    :alt="alt"
    :src="imageUrl"
  />
</template>

<script>
export default {
  name: 'TopContentMainVisualThumbnail',
  props: {
    alt: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: 120,
    },
    height: {
      type: Number,
      default: null,
    },
    className: {
      type: String,
      default: 'materialboxed',
    },
  },
  computed: {
    imageUrl() {
      if (!this.url) {
        return require('~/assets/img/no-image.jpg')
      }
      return this.url
    },
  },
}
</script>
