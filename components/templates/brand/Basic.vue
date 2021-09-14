<template>
  <div>
    <div class="row">
      <form class="col s12">
        <div class="control-fields">
          <label for="section" class="control-label">ブランド区分</label>
          <SelectInput
            v-model="inputs.section"
            :options="sectionOptions"
            :use-unselect-option="false"
            valid-name="ブランド区分"
            class="form-control small"
            name="section"
            rules="required"
          />
        </div>
        <div class="control-fields">
          <label for="name" class="control-label">ブランド名</label>
          <text-field
            id="name"
            v-model="inputs.name"
            name="name"
            type="text"
            class="form-control small"
            valid-name="ブランド名"
            rules="required|max:255"
          />
        </div>
        <div class="control-fields">
          <label for="kana" class="control-label">読み(カナ)</label>
          <text-field
            id="kana"
            v-model="inputs.kana"
            name="kana"
            type="text"
            class="form-control small"
            valid-name="読み(カナ)"
            rules="required|max:255|kana"
          />
        </div>
        <div class="control-fields">
          <label for="store_brand" class="control-label">
            所属ストアブランド
          </label>
          <SelectInput
            v-model="inputs.storeBrand"
            :options="storeBrandOptions"
            :use-unselect-option="false"
            valid-name="所属ストアブランド"
            class="form-control small"
            name="storeBrand"
            rules="required"
          />
        </div>
        <div v-if="showCategory()" class="control-fields">
          <label for="category" class="control-label">分類</label>
          <SelectInput
            v-model="inputs.category"
            :options="categoryOptions"
            :use-unselect-option="false"
            valid-name="分類"
            class="form-control small"
            name="category"
          />
        </div>
        <div class="control-fields">
          <label for="sort" class="control-label">表示順</label>
          <text-field
            id="sort"
            v-model="inputs.sort"
            name="sort"
            type="text"
            class="form-control medium"
            valid-name="表示順"
            rules="required|integer"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import TextField from '@/components/molecules/form/TextField'
import SelectInput from '@/components/molecules/form/SelectInput'

export default {
  components: {
    TextField,
    SelectInput,
  },
  props: {
    inputs: {
      type: Object,
      required: true,
    },
  },
  async fetch() {
    await this.$store.dispatch('enum/fetch')
  },
  data() {
    return {}
  },
  computed: {
    statusOptions() {
      return this.$store.getters['enum/options']['common/status'] || []
    },
    storeBrandOptions() {
      return this.$store.getters['enum/options']['common/storeBrand'] ?? []
    },
    sectionOptions() {
      return this.$store.getters['enum/options']['brand/section'] ?? []
    },
    categoryOptions() {
      return this.$store.getters['enum/options']['brand/category'] ?? []
    },
  },
  methods: {
    showCategory() {
      const sectionOrigin = this.$store.getters['enum/kv']['brand/section']
        .origin
      if (this.inputs.section === sectionOrigin) {
        return true
      } else {
        this.inputs.category = ''
        return false
      }
    },
  },
}
</script>

<style scoped>
form .control-fields {
  display: flex;
  align-items: center;
  min-height: 54px;
}
form .control-label {
  font-size: 1rem;
  line-height: 3rem;
  text-align: right;
  padding-right: 3rem;
  min-width: 15%;
}
form .form-control {
  margin: 0 1rem 8px 0 !important;
}
form .form-control.medium {
  width: 30%;
  min-width: 30%;
}
form .form-control.small {
  width: 18%;
  min-width: 18%;
}
form span {
  font-size: 1rem;
  line-height: 3rem;
  margin-right: 1rem;
}
.control-fields >>> .time-picker {
  margin-right: 10px;
}
.control-fields >>> input {
  border-top: 0 !important;
  border-right: 0 !important;
  border-left: 0 !important;
}
.control-fields >>> .vdp-datepicker {
  margin-right: 10px;
}
.text-center {
  text-align: center;
}
.default-url {
  padding-bottom: 20px;
  padding-right: 8px;
}
</style>
