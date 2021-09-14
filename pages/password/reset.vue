<template>
  <div class="col s12">
    <div class="container">
      <div id="login-page" class="row">
        <validation-observer
          v-slot="{ handleSubmit, valid }"
          ref="validationObserver"
          class="validate-provider col s12 m6 l4 z-depth-4 card-panel border-radius-6 login-card bg-opacity-8"
          tag="div"
        >
          <form class="login-form" @submit.prevent="handleSubmit(login)">
            <div class="row">
              <div class="input-field col s12">
                <h5 class="ml-4">パスワードリセット</h5>
              </div>
            </div>
            <div class="row margin">
              <text-field
                id="email"
                v-model="email"
                label="メールアドレス"
                icon="person_outline"
                type="text"
                rules="required|email"
              />
            </div>
            <div class="row">
              <div class="input-field col s12">
                <button-submit
                  class="btn cyan waves-effect waves-light col s12"
                  :disabled="!valid"
                  color="primary"
                  @onClick="login"
                >
                  パスワードリセット
                </button-submit>
              </div>
            </div>
            <div class="row">
              <div class="input-field col">
                <p class="margin right-align medium-small">
                  <nuxt-link to="/login">
                    ログインページに戻る
                  </nuxt-link>
                </p>
              </div>
            </div>
          </form>
        </validation-observer>
      </div>
    </div>
    <div class="content-overlay"></div>
  </div>
</template>

<script>
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import TextField from '@/components/molecules/form/TextField'
export default {
  layout: 'login',
  components: {
    ButtonSubmit,
    TextField,
  },
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login() {
      this.$refs.validationObserver.validate().then((result) => {
        if (result) {
          this.$formDisableAll(true)
          console.log(`result=${result}`)
          console.log(result)
          setTimeout(() => {
            this.$router.push('/login')
            this.$formDisableAll(false)
          }, 1000)
        }
      })
    },
  },
}
</script>
