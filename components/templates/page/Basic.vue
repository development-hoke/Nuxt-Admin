<template>
  <div>
    <div class="row">
      <form class="col s12">
        <div class="control-fields">
          <label for="title" class="control-label">ページタイトル</label>
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
          <label for="slug" class="control-label">ページURL</label>
          <p class="default-url">{{ staticPageUrl }}</p>
          <text-field
            id="slug"
            v-model="inputs.slug"
            name="slug"
            type="text"
            class="form-control small"
            valid-name="ページURL"
            rules="required|alpha_dash|max:255"
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
        <p class="text-center">
          ※htmlおよびcssのみここに記載できます。JavaScriptは、セキュリティ上記載できません。
        </p>
        <div class="control-fields">
          <label for="" class="control-label">公開ステータス</label>
          <radiobox
            v-model="inputs.status"
            name="target"
            :options="statusOptions"
          ></radiobox>
        </div>
        <div class="control-fields">
          <label class="control-label">公開開始日時</label>
          <DateitemPickerField
            v-model="inputs.publishFrom"
            name="publishFrom"
            rules="date_required|date_lt:publishTo"
            :clear-button="false"
            valid-name="公開開始日時"
          />
          <span class="">時 : 分</span>
        </div>
        <div class="control-fields">
          <label for="e_date" class="control-label">公開終了日時</label>
          <DateitemPickerField
            v-model="inputs.publishTo"
            name="publishTo"
            :clear-button="false"
            valid-name="公開終了日時"
          />
          <span class="">時 : 分</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Radiobox from '@/components/molecules/form/RadioBox'
import TextField from '@/components/molecules/form/TextField'
import DateitemPickerField from '@/components/molecules/form/DateitemPickerField'
import EditorField from '@/components/molecules/form/EditorField'

export default {
  components: {
    Radiobox,
    TextField,
    DateitemPickerField,
    EditorField,
  },
  props: {
    inputs: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      staticPageUrl: '',
    }
  },
  computed: {
    statusOptions() {
      return this.$store.getters['enum/options']['common/status'] || []
    },
  },
  mounted() {
    this.staticPageUrl = process.env.staticPageUrl
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
