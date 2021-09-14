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
          <text-field
            v-model="inputs.oldJanCode"
            :error-messages="errors.oldJanCode"
            label-class="typo__label"
            label="旧JANコード"
            type="text"
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
          <div class="mt-2 text-right">
            <ButtonContainer
              type="danger"
              button-class="accent-2"
              @click="handleSearchClear"
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
import ArrayInputTextareaField from '@/components/molecules/form/ArrayInputTextareaField'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import TextField from '@/components/molecules/form/TextField'
import {
  filterQueryParams,
  preprocessStringfyingQuery,
  postprocessParsingQuery,
} from '@/utils/http'

export const createInitialInputs = () => ({
  organizationId: [],
  divisionId: [],
  departmentId: [],
  productNumber: [],
  makerProductNumber: [],
  name: '',
  oldJanCode: '',
})

export default {
  name: 'PastItemSearchForm',
  components: {
    Multiselect,
    TextField,
    ArrayInputTextareaField,
    ButtonContainer,
  },
  props: {
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('master/fetchDivisions'),
      this.$store.dispatch('master/fetchDepartments'),
      this.$store.dispatch('master/fetchOrganizations'),
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
      divisionOptions: 'master/divisionOptions',
      departmentOptions: 'master/departmentOptions',
      organizationOptions: 'master/organizationOptions',
    }),
  },
  methods: {
    handleClickSearch() {
      const query = preprocessStringfyingQuery(filterQueryParams(this.inputs))
      this.$router.push({ name: 'item-past-item', query })
    },
    handleSearchClear() {
      this.$router.push({ name: 'item-past-item' })
    },
    reset() {
      this.inputs = createInitialInputs()
      this.handleClickSearch()
    },
  },
}
</script>
