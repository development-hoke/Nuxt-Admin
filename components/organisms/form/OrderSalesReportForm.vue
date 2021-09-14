<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    tag="div"
    class="wrapper mb-3"
    :external-errors="serverErrors"
  >
    <div class="row">
      <div class="col s12 mt-2 right-align">
        <CancelButton class="close-button" @click="$emit('close')" />
      </div>
    </div>
    <div class="container">
      <div class="section">
        <div class="row">
          <div class="col s3">
            <ArrayInputTextareaField
              v-model="inputs.productNumber"
              name="productNumber"
              label="事部品番（改行区切りで複数指定可）"
            />
            <Radiobox
              v-model="inputs.unit"
              :options="aggregationUnitOptions"
              name="unit"
              rules="required"
              label="集計単位"
            ></Radiobox>
          </div>
          <div class="col s3">
            <ArrayInputTextareaField
              v-model="inputs.makerProductNumber"
              name="makerProductNumber"
              label="メーカーコード・メーカー品番"
            />
            <Radiobox
              v-model="inputs.by"
              :options="aggregationByOptions"
              name="by"
              rules="required"
              label="集計軸"
            ></Radiobox>
          </div>
          <div class="col s6">
            <div>
              <label class="typo__label">集計期間 (開始)</label>
              <div class="data-range">
                <DateitemPickerField
                  v-model="inputs.dateFrom"
                  name="dateFrom"
                  rules="required|date_required|date_lt:dateTo"
                  valid-name="期間（開始）"
                />
              </div>
            </div>
            <div>
              <label class="typo__label">集計期間 (終了)</label>
              <div class="data-range">
                <DateitemPickerField
                  v-model="inputs.dateTo"
                  name="dateTo"
                  rules="required|date_required"
                  valid-name="期間（終了）"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col s6">
          <div class="row">
            <div class="col s12">
              <RadioBoxSingle
                v-model="inputs.group1"
                name="group1"
                :option-value="group1Kv.organization"
                @input="handleChangeGroup1"
              >
                <span>組織</span>
              </RadioBoxSingle>
              <Multiselect
                v-model="inputs.organizationId"
                name="organizationId"
                :disabled="
                  Number(inputs.group1) !== Number(group1Kv.organization)
                "
                :options="organizationOptions"
                valid-name="組織"
                :rules="`required_if:group1,${group1Kv.organization}`"
                :replace-messages="{
                  required_if: '選択中の項目は入力必須です。',
                }"
              ></Multiselect>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <Radiobox
                v-model="sumGroup1Flg1"
                :options="[
                  { code: 0, name: '各自' },
                  { code: 1, name: '合計' },
                ]"
                name="sumGroup1Flg1"
                valid-name="表示切り替え"
                :disabled="
                  Number(inputs.group1) !== Number(group1Kv.organization)
                "
                @input="handleChangeSumGroup1Flg"
              ></Radiobox>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <RadioBoxSingle
                v-model="inputs.group1"
                name="group1"
                :option-value="group1Kv.division"
                @input="handleChangeGroup1"
              >
                <span>事業部</span>
              </RadioBoxSingle>
              <Multiselect
                v-model="inputs.divisionId"
                name="divisionId"
                :disabled="Number(inputs.group1) !== Number(group1Kv.division)"
                :options="divisionOptions"
                valid-name="事業部"
                :rules="`required_if:group1,${group1Kv.division}`"
                :replace-messages="{
                  required_if: '選択中の項目は入力必須です。',
                }"
              ></Multiselect>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <Radiobox
                v-model="sumGroup1Flg2"
                :options="[
                  { code: 0, name: '各自' },
                  { code: 1, name: '合計' },
                ]"
                name="sumGroup1Flg2"
                valid-name="表示切り替え"
                :disabled="Number(inputs.group1) !== Number(group1Kv.division)"
                @input="handleChangeSumGroup1Flg"
              ></Radiobox>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <RadioBoxSingle
                v-model="inputs.group1"
                name="group1"
                :option-value="group1Kv.mainStoreBrand"
                @input="handleChangeGroup1"
              >
                <span>ストラブランド</span>
              </RadioBoxSingle>
              <Multiselect
                v-model="inputs.mainStoreBrand"
                name="mainStoreBrand"
                :disabled="
                  Number(inputs.group1) !== Number(group1Kv.mainStoreBrand)
                "
                :options="mainStoreBrandOptions"
                valid-name="ストラブランド"
                :rules="`required_if:group1,${group1Kv.mainStoreBrand}`"
                :replace-messages="{
                  required_if: '選択中の項目は入力必須です。',
                }"
              ></Multiselect>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <Radiobox
                v-model="sumGroup1Flg3"
                :options="[
                  { code: 0, name: '各自' },
                  { code: 1, name: '合計' },
                ]"
                name="sumGroup1Flg3"
                valid-name="表示切り替え"
                :disabled="
                  Number(inputs.group1) !== Number(group1Kv.mainStoreBrand)
                "
                @input="handleChangeSumGroup1Flg"
              ></Radiobox>
            </div>
          </div>
        </div>
        <div class="col s6">
          <div class="row">
            <div class="col s12">
              <RadioBoxSingle
                v-model="inputs.group2"
                name="group2"
                :option-value="group2Kv.department"
                @input="handleChangeGroup2"
              >
                <span>部門</span>
              </RadioBoxSingle>
              <Multiselect
                v-model="inputs.departmentId"
                name="departmentId"
                :disabled="
                  Number(inputs.group2) !== Number(group2Kv.department)
                "
                :options="departmentOptions"
                valid-name="部門"
                :rules="`required_if:group2,${group2Kv.department}`"
                :replace-messages="{
                  required_if: '選択中の項目は入力必須です。',
                }"
              ></Multiselect>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <Radiobox
                v-model="sumGroup2Flg1"
                :options="[
                  { code: 0, name: '各自' },
                  { code: 1, name: '合計' },
                ]"
                name="sumGroup2Flg1"
                valid-name="表示切り替え"
                :disabled="
                  Number(inputs.group2) !== Number(group2Kv.department)
                "
                @input="handleChangeSumGroup2Flg"
              ></Radiobox>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <RadioBoxSingle
                v-model="inputs.group2"
                name="group2"
                :option-value="group2Kv.onlineCategory"
                @input="handleChangeGroup2"
              >
                <span>オンライン分類</span>
              </RadioBoxSingle>
              <Multiselect
                v-model="inputs.onlineCategoryId"
                name="onlineCategoryId"
                :disabled="
                  Number(inputs.group2) !== Number(group2Kv.onlineCategory)
                "
                :options="onlineCategoryOptions"
                valid-name="オンライン分類"
                :rules="`required_if:group2,${group2Kv.onlineCategory}`"
                :replace-messages="{
                  required_if: '選択中の項目は入力必須です。',
                }"
              ></Multiselect>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <Radiobox
                v-model="sumGroup2Flg2"
                :options="[
                  { code: 0, name: '各自' },
                  { code: 1, name: '合計' },
                ]"
                name="sumGroup2Flg2"
                valid-name="表示切り替え"
                :disabled="
                  Number(inputs.group2) !== Number(group2Kv.onlineCategory)
                "
                @input="handleChangeSumGroup2Flg"
              ></Radiobox>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col s12 text-right">
              <ButtonContainer
                type="danger"
                button-class="accent-2"
                @click="reset"
                >クリア</ButtonContainer
              >
              <ButtonContainer @click="handleSubmit(handleClickSearch)"
                >検索</ButtonContainer
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import CancelButton from '@/components/atoms/button/CancelButton'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import DateitemPickerField from '@/components/molecules/form/DateitemPickerField'
import Multiselect from '@/components/molecules/form/MultiSelectBox'
import Radiobox from '@/components/molecules/form/RadioBox'
import RadioBoxSingle from '@/components/molecules/form/RadioBoxSingle'
import ArrayInputTextareaField from '@/components/molecules/form/ArrayInputTextareaField'
import {
  filterQueryParams,
  preprocessStringfyingQuery,
  postprocessParsingQuery,
} from '@/utils/http'
import {
  TARGET_TYPE_PRICE,
  TARGET_TYPE_AMOUNT,
} from '@/constants/salesReport/targetType'

export const createInitialInputs = () => ({
  dateFrom: null,
  dateTo: null,
  unit: null,
  by: null,
  group1: null,
  group2: null,
  organizationId: [],
  divisionId: [],
  mainStoreBrand: [],
  departmentId: [],
  onlineCategoryId: [],
  productNumber: [],
  makerProductNumber: [],
})

export const isDefaultQuery = (query) => {
  query = postprocessParsingQuery(query)

  return !Object.keys(createInitialInputs()).some(
    (key) => query[key] !== undefined
  )
}

export default {
  name: 'OrderSalesReportForm',
  components: {
    ButtonContainer,
    CancelButton,
    DateitemPickerField,
    Multiselect,
    Radiobox,
    RadioBoxSingle,
    ArrayInputTextareaField,
  },
  props: {
    serverErrors: {
      type: Object,
      default: () => ({}),
    },
    target: {
      type: Number,
      default: TARGET_TYPE_PRICE,
      validate(value) {
        return [TARGET_TYPE_PRICE, TARGET_TYPE_AMOUNT].includes(value)
      },
    },
    sumGroup1Flg: {
      type: Number,
      default: 0,
    },
    sumGroup2Flg: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const query = isDefaultQuery(this.$route.query)
      ? this.$store.getters['salesAggregation/order/requestParams']
      : postprocessParsingQuery(this.$route.query)

    const inputs = createInitialInputs()

    Object.keys(inputs).forEach((key) => {
      if (query[key] !== undefined) {
        this.$set(inputs, key, query[key])
      }
    })

    return {
      inputs,
      sumGroup1Flg1: 0,
      sumGroup1Flg2: 0,
      sumGroup1Flg3: 0,
      sumGroup2Flg1: 0,
      sumGroup2Flg2: 0,
      isResetting: false,
    }
  },
  computed: {
    ...mapGetters({
      enumKv: 'enum/kv',
      enumVk: 'enum/vk',
      enumOptions: 'enum/options',
      divisionOptions: 'master/divisionOptions',
      departmentOptions: 'master/departmentOptions',
      onlineCategoryOptions: 'onlineCategory/options',
    }),
    innerAggregationTarget: {
      set(value) {
        this.$emit('update:target', value)
      },
      get() {
        return this.target
      },
    },
    organizationOptions() {
      return this.$store.getters['master/organizationOptions'] ?? []
    },
    mainStoreBrandOptions() {
      return this.enumOptions['common/storeBrand'] ?? []
    },
    aggregationByOptions() {
      return this.enumOptions['orderAggregation/by'] ?? []
    },
    aggregationUnitOptions() {
      return this.enumOptions['orderAggregation/unit'] ?? []
    },
    group1Options() {
      return this.enumOptions['orderAggregation/group1'] ?? []
    },
    group2Options() {
      return this.enumOptions['orderAggregation/group2'] ?? []
    },
    group1Kv() {
      return this.enumKv['orderAggregation/group1'] ?? {}
    },
    group2Kv() {
      return this.enumKv['orderAggregation/group2'] ?? {}
    },
    group1Vk() {
      return this.enumVk['orderAggregation/group1'] ?? {}
    },
    group2Vk() {
      return this.enumVk['orderAggregation/group2'] ?? {}
    },
    group1FieldNames() {
      return {
        [this.group1Kv.organization]: 'organizationId',
        [this.group1Kv.division]: 'divisionId',
        [this.group1Kv.mainStoreBrand]: 'mainStoreBrand',
      }
    },
    group2FieldNames() {
      return {
        [this.group2Kv.department]: 'departmentId',
        [this.group2Kv.onlineCategory]: 'onlineCategoryId',
      }
    },
  },
  watch: {
    sumGroup1Flg(value) {
      switch (Number(this.inputs.group1)) {
        case Number(this.group1Kv.organization):
          this.sumGroup1Flg1 = Number(value)
          break
        case Number(this.group1Kv.division):
          this.sumGroup1Flg2 = Number(value)
          break
        case Number(this.group1Kv.mainStoreBrand):
          this.sumGroup1Flg3 = Number(value)
          break
      }
    },
    sumGroup2Flg(value) {
      switch (Number(this.inputs.group2)) {
        case Number(this.group2Kv.department):
          this.sumGroup2Flg1 = Number(value)
          break
        case Number(this.group2Kv.onlineCategory):
          this.sumGroup2Flg2 = Number(value)
          break
      }
    },
  },
  beforeMount() {
    const { query } = this.$route
    this.setSumGroup1Flg(query.sum_group1_flg ?? 0)
    this.setSumGroup2Flg(query.sum_group2_flg ?? 0)
  },
  methods: {
    handleClickSearch() {
      const query = this.convertInputs2Query()

      this.$router.push({ name: 'report-sales-tally', query })
    },

    reset() {
      if (this.isResetting) return
      this.isResetting = true
      const query = { useDefault: 1 }
      this.$store
        .dispatch('salesAggregation/order/fetch', query)
        .then((res) => {
          const query = this.$store.getters[
            'salesAggregation/order/requestParams'
          ]

          const inputs = createInitialInputs()

          Object.keys(inputs).forEach((key) => {
            if (query[key] !== undefined) {
              this.$set(inputs, key, query[key])
            }
          })
          this.inputs = inputs
          this.isResetting = false
        })
    },

    handleChangeSumGroup1Flg(value) {
      // リアルタイムで切り替え結果を反映させる処理。
      // this.$emit('update:sumGroup1Flg', value)
    },

    handleChangeGroup1() {
      // リアルタイムで切り替え結果を反映させる処理。
      // const value = this.getCurrentSumGroup1Flg()
      // this.$emit('update:sumGroup1Flg', value)
    },

    getCurrentSumGroup1Flg() {
      switch (Number(this.inputs.group1)) {
        case Number(this.group1Kv.organization):
          return this.sumGroup1Flg1

        case Number(this.group1Kv.division):
          return this.sumGroup1Flg2

        case Number(this.group1Kv.mainStoreBrand):
          return this.sumGroup1Flg3
      }
    },

    handleChangeSumGroup2Flg(value) {
      // リアルタイムで切り替え結果を反映させる処理。
      // this.$emit('update:sumGroup2Flg', value)
    },

    handleChangeGroup2() {
      // リアルタイムで切り替え結果を反映させる処理。
      // const value = this.getCurrentSumGroup2Flg()
      // this.$emit('update:sumGroup2Flg', value)
    },

    getCurrentSumGroup2Flg() {
      switch (Number(this.inputs.group2)) {
        case Number(this.group2Kv.department):
          return this.sumGroup2Flg1

        case Number(this.group2Kv.onlineCategory):
          return this.sumGroup2Flg2
      }
    },

    setSumGroup1Flg(value) {
      switch (Number(this.inputs.group1)) {
        case Number(this.group1Kv.organization):
          this.sumGroup1Flg1 = Number(value)
          break
        case Number(this.group1Kv.division):
          this.sumGroup1Flg2 = Number(value)
          break
        case Number(this.group1Kv.mainStoreBrand):
          this.sumGroup1Flg3 = Number(value)
          break
      }
    },

    setSumGroup2Flg(value) {
      switch (Number(this.inputs.group2)) {
        case Number(this.group2Kv.department):
          this.sumGroup2Flg1 = Number(value)
          break
        case Number(this.group2Kv.onlineCategory):
          this.sumGroup2Flg2 = Number(value)
          break
      }
    },

    convertInputs2Query() {
      const propNames = [
        'dateFrom',
        'dateTo',
        'unit',
        'by',
        'group1',
        'group2',
        this.group1FieldNames[this.inputs.group1],
        this.group2FieldNames[this.inputs.group2],
        'productNumber',
        'makerProductNumber',
      ]

      const queryParams = propNames.reduce((params, propName) => {
        return Object.assign(params, { [propName]: this.inputs[propName] })
      }, {})

      Object.keys(queryParams).forEach((key) => {
        if (typeof queryParams[key] === 'boolean') {
          queryParams[key] = Number(queryParams[key])
        }
      })

      queryParams.sumGroup1Flg = this.getCurrentSumGroup1Flg()
      queryParams.sumGroup2Flg = this.getCurrentSumGroup2Flg()
      queryParams.target = this.target

      const query = preprocessStringfyingQuery(filterQueryParams(queryParams))

      return query
    },
  },
}
</script>
