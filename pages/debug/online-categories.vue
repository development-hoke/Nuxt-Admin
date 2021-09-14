<template>
  <div class="row">
    <Breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <div class="row mb-5">
                <form class="col s12">
                  <div class="control-fields">
                    <label for="page" class="control-label"
                      >ページ (指定なし:全件)</label
                    >
                    <text-field
                      id="page"
                      v-model="inputs.page"
                      name="page"
                      type="text"
                      class="form-control medium"
                      valid-name="ページ"
                      rules="max:255|integer"
                    />
                  </div>
                  <div class="control-fields">
                    <label for="perPage" class="control-label"
                      >1ページの件数 (指定なし:1000件)</label
                    >
                    <text-field
                      id="perPage"
                      v-model="inputs.perPage"
                      name="perPage"
                      type="text"
                      class="form-control medium"
                      valid-name="1ページの件数"
                      rules="max:255|integer"
                    />
                  </div>
                </form>
              </div>
              <div class="row">
                <button-submit
                  button-class="btn"
                  color="primary"
                  @onClick="handleClickSave"
                  >オンラインカテゴリ取得</button-submit
                >
              </div>
              <div class="row mt-5 bg-black" v-if="jsonData != null">
                <json-view
                  :data="jsonData"
                  arrowSize="10px"
                  colorScheme="dark"
                  :maxDepth="5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { JSONView } from 'vue-json-component'
import axios from '@/api/axios'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import TextField from '@/components/molecules/form/TextField'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'

export default {
  components: {
    Breadcrumb,
    TextField,
    ButtonSubmit,
    'json-view': JSONView,
  },
  filters: {
    pretty: (value) => {
      return JSON.stringify(JSON.parse(value), null, 2)
    },
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'オンラインカテゴリ',
          route: { name: 'debug-online-categories' },
        },
      ],
      jsonData: null,
      inputs: {
        page: '',
        perPage: '',
      },
    }
  },
  computed: {},
  methods: {
    async handleClickSave() {
      try {
        this.$store.commit('common/loading', true)
        await axios
          .fetch(
            `master/online_categories`,
            {
              params: {
                page: this.inputs.page,
                per_page1: this.inputs.perPage,
              },
            },
            {
              isFront: true,
            }
          )
          .then((res) => {
            console.log(res)
            this.jsonData = res.data
            this.$toast.success('成功しました。')
          })
          .catch((error) => {
            console.log(error)
            this.$toast.error('APIエラー。入力内容を確認してください。')
          })
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.bg-black {
  background: #000;
}
</style>
