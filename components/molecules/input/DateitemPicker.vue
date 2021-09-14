<template>
  <div class="dateitem-picker">
    <Datepicker
      v-model="valueDate"
      name="date"
      :clear-button="clearButton"
      :class-name="className"
      :disabled="disabled"
    />
    <Timepicker
      v-model="valueTime"
      name="time"
      valid-name="開始時刻"
      :clear-button="clearButton"
      :class-name="className"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import Datepicker from '@/components/atoms/input/Datepicker'
import Timepicker from '@/components/atoms/input/Timepicker'

export default {
  name: 'DateitemPicker',
  components: {
    Datepicker,
    Timepicker,
  },
  props: {
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
      default: true,
    },
  },
  computed: {
    valueDate: {
      get() {
        if (typeof this.value !== 'string') {
          return null
        }

        return this.value.split(' ')[0] ?? null
      },
      set(newValue) {
        if (typeof this.value !== 'string') {
          this.$emit('input', newValue)
          return
        }

        const time = this.value.split(' ')[1]

        this.$emit('input', [newValue, time ?? ''].join(' '))
      },
    },
    valueTime: {
      get() {
        if (typeof this.value !== 'string') {
          return null
        }

        return this.value.split(' ')[1] ?? null
      },
      set(newValue) {
        if (typeof this.value !== 'string') {
          this.$emit('input', ` ${newValue}`)
          return
        }

        const date = this.value.split(' ')[0]

        this.$emit('input', [date ?? '', newValue].join(' '))
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.dateitem-picker {
  display: flex;

  &::v-deep .time-picker {
    margin: 3px 0 0 8px;
  }
}
::v-deep .vue__time-picker input.display-time {
  padding-right: 0;
  width: 100%;
}
</style>
