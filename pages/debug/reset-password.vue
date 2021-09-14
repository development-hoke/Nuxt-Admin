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
                    <label for="email_address" class="control-label"
                      >メールアドレス</label
                    >
                    <text-field
                      id="email_address"
                      v-model="inputs.email"
                      name="email"
                      type="text"
                      class="form-control medium"
                      valid-name="メールアドレス"
                      rules="required|max:255|email"
                    />
                  </div>
                  <div class="control-fields">
                    <label for="birthday" class="control-label"
                      >誕生日(YYYY-MM-DD)</label
                    >
                    <text-field
                      id="birthday"
                      v-model="inputs.birthday"
                      name="birthday"
                      type="text"
                      class="form-control medium"
                      valid-name="誕生日"
                      rules="required|max:255"
                    />
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
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'

export default {
  components: {
    Breadcrumb,
    TextField,
    ButtonSubmit,
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: 'パスワードのリセット',
          route: { name: 'debug-reset-password' },
        },
      ],
      inputs: {
        email: '',
        birthday: '',
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
            `member/reset_password/callback_url`,
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
