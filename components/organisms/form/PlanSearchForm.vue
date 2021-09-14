<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    tag="div"
    class="mb-2 mt-2 search-toolbar"
    :external-errors="serverErrors"
  >
    <div class="row mb-1">
      <div class="col s2 field-label">
        <span>公開ステータス</span>
      </div>
      <div class="col s2">
        <SelectInput
          v-model="inputs.status"
          name="status"
          wrapper-tag="span"
          :options="publishOptions"
          :unselect-option="{ code: null, name: '全て' }"
          valid-name="ステータス"
        />
      </div>
      <div class="col s2 field-label">
        <span>ストアブランド</span>
      </div>
      <div class="col s2">
        <SelectInput
          v-model="inputs.brand"
          name="brand"
          wrapper-tag="span"
          :options="storeBrandOptions"
          :unselect-option="{ code: null, name: '全て' }"
          valid-name="ストアブランド"
        />
      </div>
      <div class="col s2 right-align-md">
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
import SelectInput from '@/components/molecules/form/SelectInput'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import {
  filterQueryParams,
  preprocessStringfyingQuery,
  postprocessParsingQuery,
} from '@/utils/http'

const createInitialInputs = () => ({
  status: null,
  brand: null,
})

export default {
  name: 'PlanSearchForm',
  components: {
    SelectInput,
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
    ...mapGetters({ enumOptions: 'enum/options' }),
    publishOptions() {
      return this.enumOptions['plan/status'] ?? []
    },
    enumValueLabels() {
      return this.$store.getters['enum/valueLabel']
    },
    storeBrandOptions() {
      return this.$store.getters['enum/options']['common/storeBrand'] ?? []
    },
  },
  methods: {
    handleClickSearch() {
      const query = preprocessStringfyingQuery(filterQueryParams(this.inputs))
      this.$router.push({ name: 'plan', query })
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
