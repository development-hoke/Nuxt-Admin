<template>
  <div>
    <div class="row">
      <form class="col s12">
        <div class="control-fields">
          <label for="title" class="control-label">ヘルプタイトル</label>
          <text-field
            id="title"
            v-model="inputs.title"
            name="title"
            type="text"
            class="form-control medium"
            valid-name="タイトル"
            rules="required|max:255"
          />
        </div>
        <div class="control-fields">
          <label for="body" class="control-label">本文</label>
          <editor-field
            id="body"
            v-model="inputs.body"
            name="body"
            valid-name="本文"
            rules="required|max:10000"
          />
        </div>
        <div class="control-fields">
          <label for="sort" class="control-label">優先度</label>
          <text-field
            id="sort"
            v-model="inputs.sort"
            name="sort"
            type="text"
            class="form-control medium"
            valid-name="優先度"
            rules="required|integer"
          />
        </div>
        <div class="control-fields">
          <label for="is_faq" class="control-label"></label>
          <checkbox
            v-model="inputs.isFaq"
            name="is_faq"
            label="よくある質問に掲載する"
            vid="is_faq"
          />
        </div>
        <div class="control-fields-top">
          <label for="help-category" class="control-label"
            >ヘルプカテゴリ</label
          >
          <TreeViewSelectInput
            v-model="helpCategories"
            class="row"
            :tree="helpCategoryTree"
            :dict="helpCategoryDict"
          />
        </div>
        <div class="control-fields">
          <label for="status" class="control-label">公開ステータス</label>
          <radiobox
            v-model="inputs.status"
            name="status"
            :options="statusOptions"
          ></radiobox>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Radiobox from '@/components/molecules/form/RadioBox'
import TextField from '@/components/molecules/form/TextField'
import Checkbox from '@/components/molecules/form/Checkbox'
import EditorField from '@/components/molecules/form/EditorField'
import TreeViewSelectInput from '@/components/organisms/input/TreeViewSelectInput'

export default {
  components: {
    Radiobox,
    TextField,
    Checkbox,
    EditorField,
    TreeViewSelectInput,
  },
  props: {
    inputs: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: [],
      staticPageUrl: '',
      helpCategoryId: [],
      helpCategoriesEdited: false,
    }
  },
  computed: {
    ...mapGetters({
      enumOptions: 'enum/options',
    }),
    statusOptions() {
      return this.enumOptions['common/status'] || []
    },
    helpCategoryTree() {
      return this.$store.getters['helpCategory/tree']
    },
    helpCategoryDict() {
      return this.$store.getters['helpCategory/dict']
    },
    helpCategories: {
      get() {
        return this.inputs.helpCategories.map(({ id }) => id)
      },
      set(val) {
        this.helpCategoriesEdited = true
        this.helpCategoryId = val
      },
    },
  },
  methods: {
    sendValue() {
      return this.helpCategoriesEdited
        ? this.helpCategoryId
        : this.helpCategories
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
form .control-fields-top {
  display: flex;
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
.default-url {
  padding-bottom: 20px;
  padding-right: 8px;
}
</style>
