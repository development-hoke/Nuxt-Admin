<template>
  <span :class="css" class="sign"><slot></slot></span>
</template>

<script>
const typeCssMap = {
  available: {
    css: 'available',
  },
  normal: {
    css: 'normal',
  },
}

export default {
  name: 'RectangleSign',
  props: {
    type: {
      type: String,
      required: true,
      validate(value) {
        return Object.keys(typeCssMap).includes(value)
      },
    },
  },
  computed: {
    css() {
      return typeCssMap[this.type].css
    },
  },
}
</script>

<style scoped lang="scss">
.sign {
  padding: 10px;
}
.available {
  border: 1px #81c784 solid;
}
.normal {
  border: 1px #9e9e9e solid;
}
</style>
