<template>
  <datepicker
    :id="id"
    v-model="innerValue"
    :class="className"
    format="yyyy/M/d"
    :language="language"
    :monday-first="true"
    :clear-button="clearButton"
    :disabled="disabled"
    placeholder="日付を選択してください"
  ></datepicker>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import { ja as language } from 'vuejs-datepicker/dist/locale'
import dayjs from 'dayjs'

export default {
  components: {
    Datepicker,
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
  data() {
    return {
      language,
    }
  },
  computed: {
    innerValue: {
      get() {
        return !this.value ? null : dayjs(this.value).toDate()
      },
      set(newValue) {
        this.$emit(
          'input',
          newValue ? dayjs(newValue).format('YYYY-MM-DD') : null
        )
      },
    },
  },
}
</script>

<style scoped lang="scss">
.datepicker-wrapper::v-deep .vdp-datepicker > div {
  position: relative;
}
::v-deep .vdp-datepicker__clear-button {
  display: block;
  position: absolute;
  right: 0;
  top: 12px;
}
</style>
