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
                    <label for="purchase_id" class="control-label"
                      >受注番号</label
                    >
                    <text-field
                      id="purchase_id"
                      v-model="inputs.purchase_id"
                      name="purchase_id"
                      type="text"
                      class="form-control medium"
                      valid-name="受注番号"
                      rules="required|max:255"
                    />
                  </div>
                  <div class="control-fields">
                    <label for="delivery_number" class="control-label"
                      >送り状番号</label
                    >
                    <text-field
                      id="delivery_number"
                      v-model="inputs.delivery_number"
                      name="delivery_number"
                      type="text"
                      class="form-control medium"
                      valid-name="送り状番号"
                      rules="required|max:40"
                    />
                  </div>
                  <div class="control-fields mb-2">
                    <label for="delivery_company" class="control-label"
                      >運送会社</label
                    >
                    <RadioBox
                      v-model="inputs.delivery_company"
                      name="delivery_company"
                      :options="companyOptions"
                    ></RadioBox>
                  </div>
                  <div class="control-fields">
                    <label for="delivery_date" class="control-label"
                      >配送日時(YYYY-MM-DD HH:MI:SS)</label
                    >
                    <text-field
                      id="delivery_date"
                      v-model="inputs.delivery_date"
                      name="delivery_date"
                      type="text"
                      class="form-control medium"
                      valid-name="配送日時"
                      rules="required|max:255"
                    />
                  </div>
                  <div class="control-fields">
                    <label for="status" class="control-label"
                      >配送ステータス</label
                    >
                    <RadioBox
                      v-model="inputs.status"
                      name="status"
                      :options="statusOptions"
                    ></RadioBox>
                  </div>
                </form>
              </div>
              <div class="row">
                <button-submit
                  button-class="btn"
                  color="primary"
                  @onClick="handleClickSave"
                  >保存</button-submit
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import TextField from '@/components/molecules/form/TextField'
import RadioBox from '@/components/molecules/form/RadioBox'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'

export default {
  components: {
    Breadcrumb,
    TextField,
    RadioBox,
    ButtonSubmit,
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '配送完了処理',
          route: { name: 'debug-delivered' },
        },
      ],
      companyOptions: [
        { code: 1, name: 'ヤマト' },
        { code: 2, name: 'ゆうパック' },
      ],
      statusOptions: [
        { code: 1, name: '配送指示' },
        { code: 2, name: '配送完了' },
      ],
      errors: {},
      inputs: {
        purchase_id: '',
        delivery_number: '',
        delivery_company: 1,
        delivery_date: '',
        status: 1,
      },
    }
  },
  computed: {},
  methods: {
    async handleClickSave() {
      try {
        this.$store.commit('common/loading', true)
        const params = { ...this.inputs }
        await axios
          .post(
            `purchase/${params.purchase_id}/delivered`,
            params,
            {},
            {
              isFront: true,
            }
          )
          .then((res) => {
            console.log(res)
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
