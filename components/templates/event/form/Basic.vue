<template>
  <div>
    <div class="row">
      <form class="col s12">
        <div class="control-fields">
          <label for="title" class="control-label">タイトル名</label>
          <text-field
            id="title"
            v-model="inputs.title"
            type="text"
            class="form-control medium"
            valid-name="タイトル名"
            rules="required|max:255"
          />
        </div>
        <div class="control-fields">
          <label class="control-label">開始日時</label>
          <DateitemPickerField
            v-model="inputs.periodFrom"
            name="periodFrom"
            rules="date_required|date_lt:periodTo"
            :clear-button="false"
            valid-name="開始日時"
          />
          <span class="">時 : 分</span>
        </div>
        <div class="control-fields">
          <label for="e_date" class="control-label">終了日時</label>
          <DateitemPickerField
            v-model="inputs.periodTo"
            name="periodTo"
            rules="date_required|required"
            :clear-button="false"
            valid-name="終了日時"
          />
          <span class="">時 : 分</span>
        </div>
        <div class="control-fields">
          <label for="" class="control-label">対象商品計上</label>
          <radiobox
            v-model="inputs.target"
            name="target"
            :options="targetOptions"
          ></radiobox>
        </div>
        <div class="control-fields">
          <label for="" class="control-label"></label>
          <radio-box-single
            v-model="inputs.saleType"
            :option-value="saleType.normal"
            name="saleType"
            vid="sale_type"
          >
            <span>通常セール</span>
          </radio-box-single>
          <div class="control-fields">
            <label class="control-label">値引率</label>
            <div class="vertical-field">
              <div class="control-fields">
                <radiobox
                  v-model="inputs.discountType"
                  vid="discout_type"
                  valid-name="値引タイプ"
                  name="discountType"
                  :options="discountTypeOptions"
                ></radiobox>
                <PercentField
                  id="discout_rate"
                  v-model="inputs.discountRate"
                  type="number"
                  class="form-control small"
                  valid-name="値引率"
                  :rules="{
                    required:
                      inputs.discountType === discountType.flat &&
                      Number(inputs.saleType) === Number(saleType.normal),
                  }"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="control-fields">
          <label for="" class="control-label"></label>
          <radio-box-single
            v-model="inputs.saleType"
            :option-value="saleType.bundle"
            name="saleType"
            vid="sale_type"
          >
            <span>バンドル販売</span>
          </radio-box-single>
          <validation-provider tag="div" vid="sale_type" class="control-fields">
            <label class="control-label"></label>
            <bundle-info
              v-model="inputs.eventBundleSales"
              :is-sale-type-bundle="inputs.saleType === saleType.bundle"
            />
          </validation-provider>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Radiobox from '@/components/molecules/form/RadioBox'
import TextField from '@/components/molecules/form/TextField'
import PercentField from '@/components/molecules/form/PercentField'
import DateitemPickerField from '@/components/molecules/form/DateitemPickerField'
import RadioBoxSingle from '@/components/molecules/form/RadioBoxSingle'
import BundleInfo from '@/components/templates/event/form/basic/BundleInfo'

export default {
  name: 'EventBasic',
  components: {
    Radiobox,
    DateitemPickerField,
    TextField,
    PercentField,
    BundleInfo,
    RadioBoxSingle,
  },
  props: {
    inputs: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeTab: 'basic',
    }
  },
  computed: {
    saleType() {
      return this.$store.getters['enum/kv']['event/saleType'] || {}
    },
    target() {
      return this.$store.getters['enum/kv']['event/target'] || {}
    },
    targetOptions() {
      return this.$store.getters['enum/options']['event/target'] || []
    },
    discountType() {
      return this.$store.getters['enum/kv']['event/discountType'] || {}
    },
    discountTypeOptions() {
      const options =
        this.$store.getters['enum/options']['event/discountType'] || []
      return [...options].sort((i1, i2) => i2.code - i1.code)
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
.btn-group {
  display: flex;
  justify-content: space-around;
  margin-top: 3rem;
  margin-bottom: 3rem;
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
