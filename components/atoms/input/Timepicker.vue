<template>
  <vue-timepicker
    :id="id"
    v-model="innerValue"
    :class="className"
    :hide-clear-button="!clearButton"
    :disabled="disabled"
    format="HH:mm"
    advanced-keyboard
    placeholder="時刻を選択してください"
  ></vue-timepicker>
</template>

<script>
import VueTimepicker from 'vue2-timepicker'

export default {
  components: {
    VueTimepicker,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    clearButton: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    innerValue: {
      get() {
        if (!this.value) {
          return null
        }

        const [HH, mm] = this.value.split(':')

        return { HH, mm }
      },
      set(newValue) {
        if (!newValue || (!newValue.HH && !newValue.mm)) {
          this.$emit('input', null)
          return
        }

        if (!newValue.HH) {
          this.$emit('input', `00:${newValue.mm}`)
          return
        }

        if (!newValue.mm) {
          this.$emit('input', `${newValue.HH}:00`)
          return
        }

        this.$emit('input', `${newValue.HH}:${newValue.mm}`)
      },
    },
  },
}
</script>

<style scoped lang="scss">
.datepicker-wrapper::v-deep .vdp-datepicker > div {
  position: relative;
}

::v-deep .clear-btn {
  position: relative;

  .char {
    position: absolute;
    top: 15px;
    right: 0;
    color: #787878;
    font-size: 15px !important;
    font-weight: 200;
  }
}

::v-deep input {
  border-top: 0 !important;
  border-right: 0 !important;
  border-left: 0 !important;
}
</style>
