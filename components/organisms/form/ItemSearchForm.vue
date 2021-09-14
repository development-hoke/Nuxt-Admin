<template>
  <validation-observer v-slot="{ handleSubmit }" tag="div" class="wrapper mb-3">
    <div class="item-search-form-container">
      <div class="row">
        <div class="col s6">
          <array-input-textarea-field
            v-model="inputs.productNumber"
            :error-messages="errors.productNumber"
            label-class="typo__label"
            label="事業品番（改行区切りで複数指定可）"
          />
          <array-input-textarea-field
            v-model="inputs.makerProductNumber"
            :error-messages="errors.makerProductNumber"
            label-class="typo__label"
            label="メーカーコード・メーカー品番"
          />
          <text-field
            v-model="inputs.name"
            :error-messages="errors.name"
            label-class="typo__label"
            label="商品名(部分一致)"
            type="text"
          />
          <radio-box
            v-model="inputs.stockType"
            :error-messages="errors.stockType"
            label="総在庫数"
            :options="stockTypeOptions"
            label-class="typo__label"
          ></radio-box>
          <radio-box
            v-model="inputs.status"
            :error-messages="errors.status"
            label="公開/非公開"
            :options="statusOptions"
            label-class="typo__label"
          ></radio-box>
          <text-field
            v-model="inputs.favoriteCount"
            :error-messages="errors.favoriteCount"
            label-class="typo__label"
            label="お気に入り数"
            type="number"
          />
          <text-field
            v-model="inputs.oldJanCode"
            :error-messages="errors.oldJanCode"
            label-class="typo__label"
            label="旧JANコード"
            type="text"
          />
          <checkbox
            v-model="inputs.saleStop"
            name="status"
            label="販売一時停止の商品を表示する"
            vid="status"
          />
          <checkbox
            v-model="inputs.saleSoldOut"
            name="status"
            label="販売終了の商品を表示する"
            vid="status"
          />
        </div>
        <div class="col s6">
          <multiselect
            v-model="inputs.organizationId"
            label="組織"
            :options="organizationOptions"
            :error-messages="errors.organizationId"
          ></multiselect>
          <multiselect
            v-model="inputs.divisionId"
            label="事業部番号"
            :options="divisionOptions"
            :error-messages="errors.divisionId"
          ></multiselect>
          <multiselect
            v-model="inputs.departmentId"
            label="部門番号"
            :options="departmentOptions"
            :error-messages="errors.departmentId"
          ></multiselect>
          <multiselect
            v-model="inputs.termId"
            label="期"
            :options="termOptions"
            :error-messages="errors.termId"
          ></multiselect>
          <multiselect
            v-model="inputs.fashionSpeed"
            label="ファッション速度"
            :options="fashionSpeedOptions"
            :error-messages="errors.fashionSpeed"
          ></multiselect>
          <multiselect
            v-model="inputs.onlineCategoryId"
            :options="onlineCategoryOptions"
            :error-messages="errors.onlineCategoryId"
            label="オンライン分類"
          ></multiselect>
          <multiselect
            v-model="inputs.onlineTagId"
            label="オンラインタグ"
            :options="onlineTagOptions"
            :error-messages="errors.onlineTagId"
          ></multiselect>
          <div class="mt-2 text-right">
            <ButtonContainer
              type="danger"
              button-class="accent-2"
              @click="reset"
              >クリア</ButtonContainer
            >
            <button-container @click="handleSubmit(handleClickSearch)"
              >検索</button-container
            >
          </div>
        </div>
      </div>
    </div>
  </validation-observer>
</template>

<script>
import { mapGetters } from 'vuex'
import Multiselect from '@/components/molecules/form/MultiSelectBox'
import RadioBox from '@/components/molecules/form/RadioBox'
import ArrayInputTextareaField from '@/components/molecules/form/ArrayInputTextareaField'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import TextField from '@/components/molecules/form/TextField'
import Checkbox from '@/components/molecules/form/Checkbox'
import {
  filterQueryParams,
  preprocessStringfyingQuery,
  postprocessParsingQuery,
} from '@/utils/http'

export const createInitialInputs = () => ({
  organizationId: [],
  divisionId: [],
  departmentId: [],
  termId: [],
  fashionSpeed: [],
  status: null,
  onlineCategoryId: [],
  onlineTagId: [],
  stockType: null,
  favoriteCount: null,
  productNumber: [],
  makerProductNumber: [],
  name: '',
  oldJanCode: '',
  saleStop: false,
  saleSoldOut: false,
})

export default {
  name: 'ItemSearchForm',
  components: {
    Multiselect,
    RadioBox,
    TextField,
    ArrayInputTextareaField,
    ButtonContainer,
    Checkbox,
  },
  props: {
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('master/fetchTerms'),
      this.$store.dispatch('master/fetchDivisions'),
      this.$store.dispatch('master/fetchDepartments'),
      this.$store.dispatch('master/fetchOrganizations'),
      this.$store.dispatch('onlineTag/fetch'),
      this.$store.dispatch('onlineCategory/fetch'),
    ])

    const query = postprocessParsingQuery(this.$route.query)

    Object.keys(query).forEach((key) => {
      this.$set(this.inputs, key, query[key])
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
      onlineCategoryOptions: 'onlineCategory/options',
      onlineTagOptions: 'onlineTag/options',
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
    statusOptions() {
      return [{ name: 'すべて', code: null }].concat(
        this.enumOptions['common/status'] || []
      )
    },
  },
  methods: {
    handleClickSearch() {
      const query = preprocessStringfyingQuery(filterQueryParams(this.inputs))
      this.$router.push({ name: 'item', query })
    },
    reset() {
      this.inputs = createInitialInputs()
      this.handleClickSearch()
    },
  },
}
</script>
