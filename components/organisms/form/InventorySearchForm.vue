<template>
  <ValidationObserver v-slot="{ handleSubmit }" tag="div" class="form-wrapper">
    <div class="amber white">
      <div class="row">
        <div class="col s6">
          <div class="row">
            <div class="col s12">
              <ArrayInputTextareaField
                v-model="inputs.productNumber"
                label="事業品番（改行区切りで複数指定可）"
                name="productNumber"
              />
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <ArrayInputTextareaField
                v-model="inputs.makerProductNumber"
                label="メーカーコード・メーカー品番"
                name="makerProductNumber"
              />
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Multiselect
                v-model="inputs.organizationId"
                :options="organizationOptions"
                name="organizationId"
                label="組織"
              ></Multiselect>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Multiselect
                v-model="inputs.divisionId"
                :options="divisionOptions"
                name="divisionId"
                label="事業部番号"
              ></Multiselect>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Multiselect
                v-model="inputs.departmentId"
                :options="departmentOptions"
                name="departmentId"
                label="部門番号"
              ></Multiselect>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Multiselect
                v-model="inputs.termId"
                :options="termOptions"
                name="termId"
                label="期"
              ></Multiselect>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Multiselect
                v-model="inputs.fashionSpeed"
                :options="fashionSpeedOptions"
                name="fashionSpeed"
                label="ファッション速度"
              ></Multiselect>
            </div>
          </div>
        </div>
        <div class="col s6">
          <div class="row">
            <div class="col s12">
              <Radiobox
                v-model="inputs.stockType"
                :options="stockTypeOptions"
                name="stockType"
                label="総在庫数"
              ></Radiobox>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Radiobox
                v-model="inputs.reservableStockType"
                :options="reservableStockTypeOptions"
                name="reservableStockType"
                label="予約可能在庫数"
              ></Radiobox>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Radiobox
                v-model="inputs.status"
                :options="statusOptions"
                name="status"
                label="公開/非公開"
              ></Radiobox>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Radiobox
                v-model="inputs.slowMovingInventoryDayType"
                :options="slowMovingInventoryDayTypeOptions"
                name="slowMovingInventoryDayType"
                label="公開時滞留日数"
              ></Radiobox>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Radiobox
                v-model="inputs.deadInventoryDayType"
                :options="deadInventoryDayTypeOptions"
                name="deadInventoryDayType"
                label="非公開時不動日数"
              ></Radiobox>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <label class="typo__label">最新の在庫追加日時 (開始)</label>
              <div class="data-range">
                <DateitemPickerField
                  v-model="inputs.lastAddedStockDateFrom"
                  name="lastSalesDateFrom"
                  rules="date_lt:lastSalesDateTo"
                  valid-name="期間（開始）"
                />
              </div>
              <label class="typo__label">最新の在庫追加日時 (終了)</label>
              <div class="data-range">
                <DateitemPickerField
                  v-model="inputs.lastAddedStockDateTo"
                  name="lastSalesDateTo"
                  valid-name="期間（終了）"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <Checkbox
                v-model="inputs.containingSalesStatusStop"
                label="販売一時停止の商品を表示する"
                name="containingSalesStatusStop"
              />
            </div>
            <div class="col s12">
              <Checkbox
                v-model="inputs.containingSalesStatusSoldOut"
                name="containingSalesStatusSoldOut"
                label="販売終了の商品を表示する"
              />
            </div>
          </div>
          <div class="row pb-5 mb-5 text-right">
            <div class="col s12">
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
import Multiselect from '@/components/molecules/form/MultiSelectBox'
import Radiobox from '@/components/molecules/form/RadioBox'
import ArrayInputTextareaField from '@/components/molecules/form/ArrayInputTextareaField'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import DateitemPickerField from '@/components/molecules/form/DateitemPickerField'
import Checkbox from '@/components/molecules/form/Checkbox'
import {
  filterQueryParams,
  preprocessStringfyingQuery,
  postprocessParsingQuery,
  castBooleanLikeToNumber,
} from '@/utils/http'
import camelcase from '@/utils/camelcase'

export const createInitialInputs = () => ({
  organizationId: [],
  divisionId: [],
  departmentId: [],
  termId: [],
  fashionSpeed: [],
  status: null,
  stockType: null,
  favoriteCount: null,
  productNumber: [],
  makerProductNumber: [],
  name: '',
  deadInventoryDayType: null,
  slowMovingInventoryDayType: null,
  lastAddedStockDateFrom: null,
  lastAddedStockDateTo: null,
  containingSalesStatusStop: false,
  containingSalesStatusSoldOut: false,
})

export const castQueryParams = (key, value) => {
  switch (camelcase(key)) {
    case 'containingSalesStatusStop':
    case 'containingSalesStatusSoldOut':
      return castBooleanLikeToNumber(value)
    default:
      return value
  }
}

export default {
  name: 'InventorySearchForm',
  components: {
    Multiselect,
    Radiobox,
    Checkbox,
    ArrayInputTextareaField,
    DateitemPickerField,
    ButtonContainer,
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('master/fetchTerms'),
      this.$store.dispatch('master/fetchDivisions'),
      this.$store.dispatch('master/fetchDepartments'),
    ])

    const query = postprocessParsingQuery(this.$route.query)

    Object.keys(query).forEach((key) => {
      this.$set(this.inputs, key, castQueryParams(key, query[key]))
    })
  },
  data() {
    return {
      inputs: createInitialInputs(),
    }
  },
  computed: {
    ...mapGetters({
      enumOptions: 'enum/options',
      termOptions: 'master/termOptions',
      divisionOptions: 'master/divisionOptions',
      departmentOptions: 'master/departmentOptions',
      organizationOptions: 'master/organizationOptions',
    }),
    fashionSpeedOptions() {
      return this.enumOptions['item/fashionSpeed'] || []
    },
    stockTypeOptions() {
      return [{ name: 'すべて', code: null }].concat(
        this.enumOptions['params/itemStock'] || []
      )
    },
    reservableStockTypeOptions() {
      return [{ name: 'すべて', code: null }].concat(
        this.enumOptions['params/itemStock'] || []
      )
    },
    statusOptions() {
      return [{ name: 'すべて', code: null }].concat(
        this.enumOptions['common/status'] || []
      )
    },
    deadInventoryDayTypeOptions() {
      return [{ name: 'すべて', code: null }].concat(
        this.enumOptions['itemDetail/deadInventoryDayType'] || []
      )
    },
    slowMovingInventoryDayTypeOptions() {
      return [{ name: 'すべて', code: null }].concat(
        this.enumOptions['itemDetail/slowMovingInventoryDayType'] || []
      )
    },
  },
  methods: {
    handleClickClose() {
      this.$emit('close')
    },
    handleClickSearch() {
      const queryParams = { ...this.inputs }

      Object.keys(queryParams).forEach((key) => {
        if (typeof queryParams[key] === 'boolean') {
          queryParams[key] = Number(queryParams[key])
        }
      })

      const query = preprocessStringfyingQuery(filterQueryParams(queryParams))
      this.$router.push({ name: 'inventory', query })
    },
    reset() {
      this.inputs = createInitialInputs()
      this.handleClickSearch()
    },
  },
}
</script>
