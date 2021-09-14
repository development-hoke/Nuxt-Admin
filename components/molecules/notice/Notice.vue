<template>
  <div class="card-alert card lighten-5" :class="colorCss">
    <div class="card-content" :class="`${colorCss}-text`">
      <p>
        <i class="material-icons">{{ icon }}</i>
        <slot></slot>
      </p>
    </div>
    <button
      type="button"
      :class="['close', `${colorCss}-text`]"
      data-dismiss="alert"
      aria-label="Close"
      @click="handleClose"
    >
      <span aria-hidden="true">×</span>
    </button>
  </div>
</template>

<script>
const typeCssMap = {
  error: {
    css: 'red',
    icon: 'error',
  },
  warn: {
    css: 'orange',
    icon: 'warning',
  },
  info: {
    css: 'cyan',
    icon: 'info_outline',
  },
}

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    colorCss() {
      return typeCssMap[this.type].css
    },
    icon() {
      return typeCssMap[this.type].icon
    },
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>
