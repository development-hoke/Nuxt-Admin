<template>
  <validation-provider
    v-slot="{ errors, validated }"
    ref="provider"
    :rules="rules"
    :name="validateName"
    :vid="computedVid"
    :class="wrapperClass"
    :tag="wrapperTag"
  >
    <div
      :class="[
        'input-group',
        'color-picker',
        getValidateCss(errors, validated),
        ...inputFieldClass.split(' '),
      ]"
      @click.stop="() => {}"
    >
      <span class="input-group-addon color-picker-container">
        <label
          :for="`colorinput_${colorId || '1'}`"
          :class="[{ 'cursor-default': !colorChangeable }, 'current-color']"
          :style="{ backgroundColor: innerValue }"
        ></label>
        <chrome-picker v-if="displayPicker" v-model="innerValue" />
      </span>
      <input
        :id="`colorinput_${colorId || '1'}`"
        v-model="innerValue"
        type="text"
        readonly
        :class="[{ 'cursor-default': !colorChangeable }, 'form-control']"
        @focus="openPicker()"
      />
    </div>
    <error-message v-for="(error, key) in errors" :key="key">
      {{ error }}
    </error-message>
  </validation-provider>
</template>

<script>
import { Chrome as ChromePicker } from 'vue-color'
import ErrorMessage from '@/components/atoms/form/ErrorMessage'
import formFieldMixin from '@/components/molecules/form/mixins/formFieldMixin'
export default {
  components: {
    ChromePicker,
    ErrorMessage,
  },
  mixins: [formFieldMixin],
  props: {
    value: {
      type: String,
      required: true,
    },
    showColorPicker: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    colorId: {
      type: Number || String,
      required: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    colorChangeable: {
      type: Boolean,
      default: true,
    },
    // eslint-disable-next-line vue/require-default-prop
    parentDataName: {
      type: String,
      required: false,
    },
    clearButton: {
      type: Boolean,
      default: true,
    },
    inputFieldClass: {
      type: String,
      default: 'input-field inline',
    },
  },
  data() {
    return {
      closePicker: () => {
        this.displayPicker = false
      },
      showPicker: false,
    }
  },
  computed: {
    innerValue: {
      set({ hex }) {
        this.$emit('input', hex)
      },
      get() {
        return this.value
      },
    },
    displayPicker: {
      set(val) {
        this.parentDataName
          ? this.$emit('update:showColorPicker', val)
          : (this.showPicker = val)
      },
      get() {
        return this.parentDataName ? this.showColorPicker : this.showPicker
      },
    },
  },
  beforeDestroy() {
    window.removeEventListener('click', this.closePicker)
  },
  methods: {
    openPicker() {
      if (this.colorChangeable) {
        this.displayPicker = true
        if (this.parentDataName && this.$parent.$data[this.parentDataName])
          this.$parent.$data[this.parentDataName].forEach((color) => {
            if (color.id !== this.colorId) color.showColorPicker = false
          })
      }
      window.addEventListener('click', this.closePicker)
    },
    setValidateClass(errors, validated) {
      if (!validated) return ''
      return errors.length ? 'validate invalid' : 'validate valid'
    },
  },
}
</script>

<style scoped>
.current-color {
  display: inline-flex;
  width: 47px;
  height: 47px;
  background-color: #000;
  cursor: pointer;
}
input {
  width: auto !important;
  height: 45px !important;
  border: 0.5px solid #e0e0e0 !important;
  text-align: center;
  margin: 0 !important;
  color: inherit !important;
  cursor: pointer;
}
.cursor-default {
  cursor: default;
}
.vc-chrome {
  margin: auto;
  position: absolute;
}
.input-group {
  display: inline-flex;
}
.color-picker {
  margin-bottom: 0;
}
</style>
