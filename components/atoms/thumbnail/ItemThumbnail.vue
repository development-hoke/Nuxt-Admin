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
  name: 'ItemThumbnail',
  props: {
    alt: {
      type: String,
      default: '',
    },
    url: {
      type: [String],
      default: null,
    },
    image: {
      type: [Object],
      default: null,
    },
    width: {
      type: Number,
      default: 80,
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
      if (!this.url && !this.image) {
        return require('~/assets/img/no-image.jpg')
      }

      if (!this.image) {
        return this.url
      }

      return this.image.urlM
    },
  },
}
</script>

<style lang="scss" scoped>
img {
  cursor: inherit;
}
</style>
