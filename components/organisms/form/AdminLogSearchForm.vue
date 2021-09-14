<template>
  <ValidationObserver v-slot="{ handleSubmit }" class="wrapper" tag="div">
    <div class="amber white">
      <div class="row">
        <div class="col s3 range-selector">
          <label class="form-control">期間 (開始):</label>
          <Datepicker
            v-model="inputs.termFrom"
            name="termFrom"
            rules="date_lt:termTo"
            valid-name="期間 (開始)"
          />
        </div>
        <div class="col s3 range-selector">
          <label class="form-control">期間 (終了)</label>
          <Datepicker
            v-model="inputs.termTo"
            name="termTo"
            valid-name="期間 (終了)"
          />
        </div>
      </div>
      <div class="row mb-2">
        <div class="col s6">
          <div class="filter-label">
            <label class="form-control">アカウント名</label>
          </div>
          <SearchableSelectField
            v-model="inputs.staffId"
            name="staffId"
            :options="staffOptions"
            @search="debounceSearchStaff"
          />
        </div>
        <div class="col s6">
          <div class="filter-label">
            <label class="form-control">動作内容</label>
          </div>
          <SearchableSelectField
            v-model="inputs.action"
            name="action"
            :options="actionNameOptions"
          />
        </div>
      </div>
      <div class="row mb-2 center">
        <div class="col s12">
          <ButtonContainer type="danger" button-class="accent-2" @click="reset">
            クリア
          </ButtonContainer>
          <ButtonSubmit @onClick="handleSubmit(handleClickSearch)"
            >検索</ButtonSubmit
          >
        </div>
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash.debounce'
import Datepicker from '@/components/molecules/form/Datepicker'
import SearchableSelectField from '@/components/molecules/form/SearchableSelectField'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import ButtonContainer from '@/components/atoms/button/ButtonContainer'
import {
  filterQueryParams,
  preprocessStringfyingQuery,
  postprocessParsingQuery,
} from '@/utils/http'
import { createOptions } from '@/utils/dataStructure'

export const createInitialInputs = () => ({
  termFrom: null,
  termTo: null,
  staffId: [],
  action: [],
})

export default {
  name: 'AdminLogSearchForm',
  components: {
    Datepicker,
    SearchableSelectField,
    ButtonSubmit,
    ButtonContainer,
  },
  async fetch() {
    const query = postprocessParsingQuery(this.$route.query)

    if (query.staffId) {
      const { data } = await this.$api.staff.fetch({
        'id[]': query.staffId,
      })
      query.staffId = createOptions(data)
    }

    Object.keys(query).forEach((key) => {
      this.$set(this.inputs, key, query[key])
    })
  },
  data() {
    return {
      inputs: createInitialInputs(),
      staffs: [],
      debounceSearchStaff: debounce(this.handleSearchStaff.bind(this), 100),
    }
  },
  computed: {
    ...mapGetters({
      actionNameOptions: 'master/actionNameOptions',
    }),
    staffOptions() {
      return createOptions(this.staffs)
    },
  },
  methods: {
    async handleSearchStaff(search, loading) {
      if (!search) {
        return
      }

      try {
        loading(true)

        const { data } = await this.$api.staff.fetch({ name: search })

        this.staffs = data
      } catch (error) {
        console.error(error)
      } finally {
        loading(false)
      }
    },
    handleClickSearch() {
      const params = { ...this.inputs }

      params.staffId = params.staffId.map(({ code }) => code)
      params.action = params.action.map(({ code }) => code)

      const query = preprocessStringfyingQuery(filterQueryParams(params))
      this.$router.push({ name: 'admin-log', query })
    },
    reset() {
      this.inputs = createInitialInputs()
      this.handleClickSearch()
    },
  },
}
</script>
