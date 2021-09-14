<template>
  <div class="col s12">
    <div class="container">
      <div id="login-page" class="row">
        <validation-observer
          :key="componentKey"
          v-slot="{ handleSubmit, valid }"
          ref="validationObserver"
          :external-errors="errors"
          class="validate-provider col s12 m6 l4 z-depth-4 card-panel border-radius-6 login-card bg-opacity-8"
          tag="div"
        >
          <form class="login-form" @submit.prevent="handleSubmit(login)">
            <div class="row">
              <div class="input-field col s12">
                <h5 class="ml-4">Sign in</h5>
              </div>
            </div>
            <SmallErrorMessageList :messages="errors.global" />
            <div class="row margin">
              <text-field
                id="code"
                v-model="inputs.code"
                name="code"
                label="コード"
                icon="person_outline"
                type="text"
                rules="required|alpha_num"
              />
            </div>
            <div class="row margin">
              <text-field
                id="password"
                v-model="inputs.password"
                name="password"
                label="パスワード"
                icon="lock_outline"
                type="password"
                rules="required|alpha_num|between:5,20"
              />
            </div>
            <div class="row mt-5">
              <div class="input-field col s12">
                <button-submit
                  :disabled="!valid"
                  color="primary"
                  @onClick="handleSubmit(login)"
                >
                  Login
                </button-submit>
              </div>
            </div>
          </form>
        </validation-observer>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import TextField from '@/components/molecules/form/TextField'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'
import { assignErrors } from '@/plugins/vee-validate'
import * as httpStatusCode from '@/constants/httpStatusCode'

export default {
  layout: 'login',
  components: {
    ButtonSubmit,
    TextField,
    SmallErrorMessageList,
  },
  data() {
    return {
      inputs: {
        code: null,
        password: null,
      },
      errors: {
        global: [],
      },
      componentKey: 0,
    }
  },
  methods: {
    async login() {
      if (this.$store.getters['common/loading']) {
        return
      }
      try {
        this.$store.commit('common/loading', true)

        const params = { ...this.inputs }

        await this.$store.dispatch('currentUser/login', params)

        this.$router.push('/dashboard')
      } catch (error) {
        console.error('error')
        console.error(error)

        if (this.isAuthError(error)) {
          console.log(error.response.data.message)
          this.$set(this.errors, 'global', [
            error.response.data.message ||
              'コードまたはパスワードに誤りがあります。',
          ])
        } else {
          assignErrors(this.errors, error)
        }
      } finally {
        this.$store.commit('common/loading', false)
        this.componentKey += 1
      }
    },
    isAuthError(error) {
      if (!error.response) {
        return false
      }

      switch (error.response.status) {
        case httpStatusCode.UNAUTHORIZED:
        case httpStatusCode.FORBIDDEN:
          return true

        default:
          return false
      }
    },
  },
}
</script>
