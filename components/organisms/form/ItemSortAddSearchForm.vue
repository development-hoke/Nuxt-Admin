<template>
  <validation-observer v-slot="{ handleSubmit }" tag="div" class="wrapper">
    <div class="card amber lighten-4 item-search-form-container pt-3 pb-1">
      <div class="row">
        <div class="col s12 right-align">
          <ClearFilterButton @click="handleClear" />
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <multiselect
            v-model="inputs.organizationId"
            label="組織"
            :options="organizationOptions"
            :error-messages="errors.organizationId"
          ></multiselect>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <multiselect
            v-model="inputs.divisionId"
            label="事業部番号"
            :options="divisionOptions"
            :error-messages="errors.divisionId"
          ></multiselect>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <multiselect
            v-model="inputs.departmentId"
            label="部門番号"
            :options="departmentOptions"
            :error-messages="errors.departmentId"
          ></multiselect>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <multiselect
            v-model="inputs.termId"
            label="期"
            :options="termOptions"
            :error-messages="errors.termId"
          ></multiselect>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <multiselect
            v-model="inputs.fashionSpeed"
            label="ファッション速度"
            :options="fashionSpeedOptions"
            :error-messages="errors.fashionSpeed"
          ></multiselect>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <radio-box
            v-model="inputs.stockType"
            :error-messages="errors.stockType"
            label="総在庫数"
            :options="stockTypeOptions"
            label-class="typo__label"
          ></radio-box>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <radio-box
            v-model="inputs.status"
            :error-messages="errors.status"
            label="公開/非公開"
            :options="statusOptions"
            label-class="typo__label"
          ></radio-box>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <array-input-textarea-field
            v-model="inputs.productNumber"
            :error-messages="errors.productNumber"
            label-class="typo__label"
            label="事部品番（改行区切りで複数指定可）"
          />
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <array-input-textarea-field
            v-model="inputs.makerProductNumber"
            :error-messages="errors.makerProductNumber"
            label-class="typo__label"
            label="メーカーコード・メーカー品番"
          />
        </div>
      </div>
      <div class="row pb-5 mb-5 center">
        <div class="col s12">
          <button-container @click="handleSubmit(handleClickSearch)"
            >検索</button-container
          >
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
import ClearFilterButton from '@/components/atoms/button/ClearFilterButton'

export const createInitialInputs = () => ({
  organizationId: [],
  divisionId: [],
  departmentId: [],
  termId: [],
  fashionSpeed: [],
  status: null,
  stockType: null,
  productNumber: [],
  makerProductNumber: [],
})

export default {
  name: 'ItemSearchForm',
  emits: ['close', 'search'],
  components: {
    Multiselect,
    RadioBox,
    ArrayInputTextareaField,
    ButtonContainer,
    ClearFilterButton,
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
    ])
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
    statusOptions() {
      return [{ name: 'すべて', code: null }].concat(
        this.enumOptions['common/status'] || []
      )
    },
  },
  methods: {
    handleClickSearch() {
      this.$emit('search', { ...this.inputs })
    },

    handleClear() {
      this.inputs = createInitialInputs()
      this.$emit('search', { ...this.inputs })
    },
  },
}
</script>

<style scoped lang="scss">
.wrapper {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  width: 250px;

  .card.amber.lighten-4 {
    margin: 0;
    height: 100%;
    background: white !important;
  }

  .close-button {
    padding: 0 1rem;
    float: right;
  }
}
</style>
