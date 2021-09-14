<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    tag="div"
    class="mb-2 mt-2 search-toolbar"
    :external-errors="serverErrors"
  >
    <SmallTitle class="row mb-1">注文情報</SmallTitle>
    <div class="row mb-1">
      <div class="col s1 field-label">
        <span>発注日</span>
      </div>
      <div class="col s5 field-column">
        <Datepicker
          v-model="inputs.orderDateFrom"
          name="orderDateFrom"
          rules="date_lt:orderDateTo"
          valid-name="開始日"
        />
        <label class="term-separator">~</label>
        <Datepicker
          v-model="inputs.orderDateTo"
          name="orderDateTo"
          valid-name="終了日"
        />
      </div>
      <div class="col s2">
        <div class="control-fields field-column mr-10 ml-10">
          <span class="field-label">ステータス : </span>
          <SelectInput
            v-model="inputs.status"
            name="status"
            wrapper-tag="span"
            :options="statusOptions"
            :unselect-option="{ code: null, name: '全て' }"
            valid-name="ステータス"
          />
        </div>
      </div>
      <div class="col s2">
        <div class="control-fields field-column mr-10 ml-10">
          <span class="field-label">注文 : </span>
          <SelectInput
            v-model="inputs.orderType"
            name="orderType"
            wrapper-tag="span"
            :options="orderTypeOptions"
            :unselect-option="{ code: null, name: '全て' }"
            valid-name="注文"
          />
        </div>
      </div>
    </div>
    <div class="row mb-1">
      <div class="col s1 field-label">
        <span>受注コード</span>
      </div>
      <div class="col s2">
        <TextField v-model="inputs.code" name="code" rules="max:255" />
      </div>
      <div class="col s1 field-label">
        <span>送り状番号</span>
      </div>
      <div class="col s2">
        <ArrayInputTextareaField
          v-model="inputs.deliveryNumber"
          name="deliveryNumber"
          valid-name="送り状番号"
        />
      </div>
      <div class="col s2">
        <div class="control-fields field-column mr-10 ml-10">
          <span class="field-label">決済 : </span>
          <SelectInput
            v-model="inputs.paymentType"
            name="paymentType"
            wrapper-tag="span"
            :options="paymentTypeOptions"
            :unselect-option="{ code: null, name: '全て' }"
            valid-name="決済"
          />
        </div>
      </div>
      <div class="col s2">
        <div class="control-fields field-column mr-10 ml-10">
          <span class="field-label">入金 : </span>
          <SelectInput
            v-model="inputs.paid"
            name="paid"
            wrapper-tag="span"
            :options="paidOptions"
            :unselect-option="{ code: null, name: '全て' }"
            valid-name="入金"
          />
        </div>
      </div>
      <div class="col s2">
        <div class="control-fields field-column mr-10 ml-10">
          <span class="field-label">検品 : </span>
          <SelectInput
            v-model="inputs.inspected"
            name="inspected"
            wrapper-tag="span"
            :options="inspectedOptions"
            :unselect-option="{ code: null, name: '全て' }"
            valid-name="検品"
          />
        </div>
      </div>
    </div>
    <div class="row mb-1">
      <div class="col s1 field-label">
        <span>事部品番</span>
      </div>
      <div class="col s2">
        <ArrayInputTextareaField
          v-model="inputs.productNumber"
          name="productNumber"
          valid-name="事部品番"
        />
      </div>
      <div class="col s1 field-label">
        <span>JANコード</span>
      </div>
      <div class="col s2">
        <ArrayInputTextareaField
          v-model="inputs.janCode"
          name="janCode"
          valid-name="JANコード"
        />
      </div>
      <div class="col s2">
        <div class="control-fields field-column mr-10 ml-10">
          <span class="field-label">配送 : </span>
          <SelectInput
            v-model="inputs.deliveryType"
            name="deliveryType"
            wrapper-tag="span"
            :options="deliveryTypeOptions"
            :unselect-option="{ code: null, name: '全て' }"
            valid-name="配送"
          />
        </div>
      </div>
      <div class="col s2">
        <div class="control-fields field-column mr-10 ml-10">
          <span class="field-label">発送 : </span>
          <SelectInput
            v-model="inputs.deliveryed"
            name="deliveryed"
            wrapper-tag="span"
            :options="deliveryedOptions"
            :unselect-option="{ code: null, name: '全て' }"
            valid-name="発送"
          />
        </div>
      </div>
    </div>
    <SmallTitle class="row mb-1">お客様情報</SmallTitle>
    <div class="row mb-1">
      <div class="col s1 field-label">
        <span>お客様名</span>
      </div>
      <div class="col s2">
        <TextField
          v-model="inputs.memberName"
          name="memberName"
          valid-name="お客様名"
        />
      </div>
      <div class="col s1 field-label">
        <span>電話番号</span>
      </div>
      <div class="col s2">
        <TextField
          v-model="inputs.memberPhoneNumber"
          name="memberPhoneNumber"
          valid-name="電話番号"
        />
      </div>
      <div class="col s1 field-label">
        <span>メールアドレス</span>
      </div>
      <div class="col s2">
        <TextField
          v-model="inputs.memberEmail"
          name="memberEmail"
          valid-name="メールアドレス"
        />
      </div>
      <div class="col s3 right-align-md">
        <ButtonContainer type="danger" button-class="accent-2" @click="reset">
          クリア
        </ButtonContainer>
        <ButtonContainer @click="handleSubmit(handleClickSearch)"
          >検索</ButtonContainer
        >
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import SmallTitle from '@/components/atoms/title/SmallTitle'
import Datepicker from '@/components/molecules/form/Datepicker'
import SelectInput from '@/components/molecules/form/SelectInput'
import TextField from '@/components/molecules/form/TextField'
import ArrayInputTextareaField from '@/components/molecules/form/ArrayInputTextareaField'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import orderLabels from '@/assets/label/order'
import {
  filterQueryParams,
  preprocessStringfyingQuery,
  postprocessParsingQuery,
} from '@/utils/http'

const createInitialInputs = () => ({
  orderDateFrom: null,
  orderDateTo: null,
  code: null,
  deliveryNumber: [],
  productNumber: [],
  janCode: [],
  status: null,
  paymentType: null,
  deliveryType: null,
  orderType: null,
  paid: null,
  deliveryed: null,
  inspected: null,
  memberName: null,
  memberPhoneNumber: null,
  memberEmail: null,
})

export default {
  name: 'OrderSearchForm',
  components: {
    SmallTitle,
    Datepicker,
    SelectInput,
    TextField,
    ArrayInputTextareaField,
    ButtonContainer,
  },
  props: {
    serverErrors: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const query = postprocessParsingQuery(this.$route.query)
    const inputs = createInitialInputs()

    Object.keys(query).forEach((key) => {
      inputs[key] = query[key]
    })

    return {
      inputs,
    }
  },
  computed: {
    ...mapGetters({
      enumKv: 'enum/kv',
      enumValueLabel: 'enum/valueLabel',
      enumOptions: 'enum/options',
    }),
    statusOptions() {
      const orderStatus = this.enumKv['order/status'] || {}
      const valueLabel = this.enumValueLabel['order/status'] || {}

      const options = [
        orderStatus.ordered,
        orderStatus.pending,
        orderStatus.deliveryed,
        orderStatus.canceled,
        orderStatus.returned,
      ]

      return options.map((code) => ({ code, name: valueLabel[code] }))
    },
    orderTypeOptions() {
      return this.enumOptions['order/orderType'] ?? []
    },
    paymentTypeOptions() {
      return this.enumOptions['order/paymentType'] ?? []
    },
    deliveryTypeOptions() {
      return this.enumOptions['order/deliveryType'] ?? []
    },
    deliveryTimeOptions() {
      return this.enumOptions['order/deliveryTime'] ?? []
    },
    paidOptions() {
      const labels = orderLabels.paid
      return Object.keys(labels).map((code) => ({ code, name: labels[code] }))
    },
    inspectedOptions() {
      const labels = orderLabels.inspected
      return Object.keys(labels).map((code) => ({ code, name: labels[code] }))
    },
    deliveryedOptions() {
      const labels = orderLabels.deliveryed
      return Object.keys(labels).map((code) => ({ code, name: labels[code] }))
    },
  },
  methods: {
    handleClickSearch() {
      const query = preprocessStringfyingQuery(filterQueryParams(this.inputs))
      this.$router.push({ name: 'order', query })
    },
    reset() {
      this.inputs = createInitialInputs()
      this.handleClickSearch()
    },
  },
}
</script>

<style lang="scss" scoped>
.field-column {
  display: inline-flex;
}
.field-label {
  padding-top: 29px;
}
.term-separator {
  padding: 29px 10px 0 10px;
}
</style>
