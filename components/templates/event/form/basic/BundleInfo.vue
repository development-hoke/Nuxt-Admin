<template>
  <div class="vertical-fields">
    <div v-for="(item, index) in value" :key="index" class="control-fields">
      <TextField
        id="bundle_sale_info_count"
        v-model="item.count"
        type="number"
        class="form-control medium"
        valid-name="バンドル販売 個数"
        :rules="{
          required: isSaleTypeBundle,
          min_value: 0,
        }"
        @input="handleInput"
        @focus="handleFocus(index)"
      />
      <span>個</span>
      <PercentField
        id="bundle_sale_info_rate"
        v-model="item.rate"
        type="number"
        class="form-control medium"
        valid-name="バンドル販売 値引率"
        :rules="{
          required: isSaleTypeBundle,
          min_value: 0,
        }"
        @input="handleInput"
        @focus="handleFocus(index)"
      />
      <a
        v-if="showRemoveeButton"
        href=""
        class="remove-button"
        @click.prevent="handleDelete(index)"
      >
        <i class="material-icons">cancel</i>
      </a>
      <a
        v-if="index === value.length - 1"
        href=""
        class="add-button"
        @click.prevent="handleAdd(index)"
      >
        <i class="material-icons">add_circle_outline</i>
      </a>
    </div>
  </div>
</template>

<script>
import TextField from '@/components/molecules/form/TextField'
import PercentField from '@/components/molecules/form/PercentField'

export const createNewItem = () => ({ count: null, rate: null })

export default {
  name: 'BundleInfo',
  components: {
    TextField,
    PercentField,
  },
  props: {
    value: {
      type: Array,
      default: () => [createNewItem()],
    },
    isSaleTypeBundle: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      focusedIndex: Math.max(this.value.length - 1, 0),
    }
  },
  computed: {
    showRemoveeButton() {
      return this.value.length > 1
    },
  },
  methods: {
    handleInput() {
      this.$emit('input', this.value)
    },

    handleDelete(index) {
      this.value.splice(index, 1)
      this.$emit('input', this.value)
    },

    handleAdd(index) {
      this.value.splice(index + 1, 0, createNewItem())
      this.$emit('input', this.value)
    },

    handleFocus(index) {
      this.focusedIndex = index
    },
  },
}
</script>

<style scoped>
.remove-button {
  margin-left: 8px;
}
.title {
  font-size: 20px !important;
  margin-bottom: 20px;
}
.tab-content {
  display: none;
}
.tab-content.active {
  display: block;
}
.control-fields {
  display: flex;
  align-items: center;
  min-height: 54px;
}
.control-label {
  font-size: 1rem;
  line-height: 3rem;
  text-align: right;
  padding-right: 3rem;
  min-width: 15%;
}
.form-control {
  margin: 0 1rem 8px 0 !important;
}
.form-control.medium {
  width: 30%;
  min-width: 30%;
}
.form-control.small {
  width: 15%;
  min-width: 15%;
}
span {
  font-size: 1rem;
  line-height: 3rem;
  margin-right: 1rem;
}
.btn-group {
  display: flex;
  justify-content: space-around;
  margin-top: 3rem;
  margin-bottom: 3rem;
}
.add-button {
  margin-left: 6px;
}
</style>
