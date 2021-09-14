<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    tag="div"
    class="wrapper mb-3"
    :external-errors="serverErrors"
  >
    <div class="white lighten-4">
      <div class="row">
        <div class="col s6">
          <ArrayInputTextareaField
            v-model="inputs.productNumber"
            name="productNumber"
            label="事部品番（改行区切りで複数指定可）"
          />
          <ArrayInputTextareaField
            v-model="inputs.makerProductNumber"
            name="makerProductNumber"
            label="メーカーコード・メーカー品番"
          />
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
          <Radiobox
            v-model="inputs.by"
            :options="aggregationByOptions"
            name="by"
            rules="required"
            label="集計軸"
          ></Radiobox>
          <Radiobox
            v-model="inputs.saleType"
            :options="saleTypeOptions"
            name="saleType"
            rules="required"
            label="販売タイプ"
          ></Radiobox>
        </div>
        <div class="col s6">
          <div class="row">
            <div class="col s12">
              <Multiselect
                v-model="inputs.organizationId"
                name="organizationId"
                :options="organizationOptions"
                label="組織"
              ></Multiselect>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <Multiselect
                v-model="inputs.divisionId"
                name="divisionId"
                :options="divisionOptions"
                label="事業部"
              ></Multiselect>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <Multiselect
                v-model="inputs.mainStoreBrand"
                name="mainStoreBrand"
                :options="mainStoreBrandOptions"
                label="ストラブランド"
              ></Multiselect>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Multiselect
                v-model="inputs.departmentId"
                name="departmentId"
                :options="departmentOptions"
                label="部門"
              ></Multiselect>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col s12">
              <Multiselect
                v-model="inputs.onlineCategoryId"
                name="onlineCategoryId"
                :options="onlineCategoryOptions"
                label="オンライン分類"
              ></Multiselect>
            </div>
          </div>
          <div class="row mt-3">
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
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import DateitemPickerField from '@/components/molecules/form/DateitemPickerField'
import Multiselect from '@/components/molecules/form/MultiSelectBox'
import Radiobox from '@/components/molecules/form/RadioBox'
import ArrayInputTextareaField from '@/components/molecules/form/ArrayInputTextareaField'
import {
  filterQueryParams,
  preprocessStringfyingQuery,
  postprocessParsingQuery,
} from '@/utils/http'

export const createInitialInputs = () => ({
  dateFrom: null,
  dateTo: null,
  by: null,
  saleType: null,
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
  name: 'ItemSalesReportForm',
  components: {
    ButtonContainer,
    DateitemPickerField,
    Multiselect,
    Radiobox,
    ArrayInputTextareaField,
  },
  props: {
    serverErrors: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const query = isDefaultQuery(this.$route.query)
      ? this.$store.getters['salesAggregation/item/requestParams']
      : postprocessParsingQuery(this.$route.query)

    const inputs = createInitialInputs()

    Object.keys(inputs).forEach((key) => {
      if (query[key] !== undefined) {
        this.$set(inputs, key, query[key])
      }
    })

    return {
      inputs,
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
    organizationOptions() {
      return this.$store.getters['master/organizationOptions'] ?? []
    },
    mainStoreBrandOptions() {
      return this.enumOptions['common/storeBrand'] ?? []
    },
    aggregationByOptions() {
      return this.enumOptions['orderAggregation/by'] ?? []
    },
    saleTypeOptions() {
      return this.enumOptions['order/saleType'] ?? []
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
  methods: {
    handleClickSearch() {
      const queryParams = { ...this.inputs }

      Object.keys(queryParams).forEach((key) => {
        if (typeof queryParams[key] === 'boolean') {
          queryParams[key] = Number(queryParams[key])
        }
      })

      const query = preprocessStringfyingQuery(filterQueryParams(queryParams))

      this.$router.push({ name: 'report-product-performance', query })
    },
    reset() {
      this.inputs = createInitialInputs()
      this.handleClickSearch()
    },
  },
}
</script>
