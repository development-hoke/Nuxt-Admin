<template>
  <div>
    <div class="row">
      <form class="col s12">
        <div class="control-fields">
          <label for="title" class="control-label">タイトル</label>
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
          <label for="s_date" class="control-label">公開日時</label>
          <datepicker
            id="s_date"
            v-model="inputs.publishAtDate"
            name="s_date"
            rules="required"
            :clear-button="false"
            valid-name="公開日"
          ></datepicker>
          <timepicker
            id="s_hr"
            v-model="inputs.publishAtTime"
            name="s_hr"
            rules="required"
            valid-name="時刻"
            :clear-button="false"
          ></timepicker>
          <span class="">時 : 分</span>
        </div>
        <div class="control-fields">
          <label for="priority" class="control-label">優先度</label>
          <text-field
            id="priority"
            v-model="inputs.priority"
            name="priority"
            type="text"
            class="form-control medium"
            valid-name="優先度"
            rules="required|integer"
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
        <div class="control-fields">
          <label for="" class="control-label"></label>
          <checkbox
            v-model="inputs.isStoreTop"
            name="is_store_top"
            label="ストアトップに掲載する"
            vid="is_store_top"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import TextField from '@/components/molecules/form/TextField'
import Datepicker from '@/components/molecules/form/Datepicker'
import Timepicker from '@/components/molecules/form/Timepicker'
import Checkbox from '@/components/molecules/form/Checkbox'
import Radiobox from '@/components/molecules/form/RadioBox'
import EditorField from '@/components/molecules/form/EditorField'

export default {
  components: {
    Datepicker,
    Timepicker,
    TextField,
    Checkbox,
    Radiobox,
    EditorField,
  },
  props: {
    inputs: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    statusOptions() {
      return this.$store.getters['enum/options']['common/status'] || {}
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
</style>
