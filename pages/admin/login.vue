<template>
  <div class="row">
    <Breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <LargeTitle>代理ログイン</LargeTitle>
              <ValidationObserver
                v-slot="{ handleSubmit }"
                tag="div"
                class="row agent-login-form"
                :external-errors="serverErrors"
                @submit="handleSubmit(handleLogin)"
              >
                <div class="col s12">
                  <label>お客様ID</label>
                  <TextField
                    v-model="inputs.memberId"
                    name="memberId"
                    rules="required|integer"
                    valid-name="お客様ID"
                  />
                </div>
                <div class="col s12 login-btn">
                  <ButtonSubmit @onClick="handleSubmit(handleLogin)"
                    >ログイン</ButtonSubmit
                  >
                </div>
                <div
                  v-if="
                    Array.isArray(serverErrors.global) &&
                    serverErrors.global.length > 0
                  "
                  class="col s12"
                >
                  <ErrorMessageList :messages="serverErrors.global" />
                </div>
              </ValidationObserver>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/molecules/navigation/Breadcrumb'
import LargeTitle from '@/components/atoms/title/LargeTitle'
import TextField from '@/components/molecules/form/TextField'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import ErrorMessageList from '@/components/organisms/notice/ErrorMessageList'
import { assignErrors } from '@/plugins/vee-validate'

export default {
  components: {
    Breadcrumb,
    LargeTitle,
    TextField,
    ButtonSubmit,
    ErrorMessageList,
  },
  data() {
    return {
      breadcrumbs: [
        {
          name: '管理者管理',
          route: { name: 'admin-log' },
        },
        {
          name: '代理ログイン',
          route: { name: 'admin-login' },
        },
      ],
      inputs: {
        memberId: '',
      },
      serverErrors: {},
    }
  },
  methods: {
    async handleLogin() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.$store.commit('common/loading', true)

        const { memberToken } = await this.$api.auth.agentLogin({
          memberId: this.inputs.memberId,
        })

        window.location.href = `${process.env.frontBaseUrl}/admin/agent-login/?token=${memberToken}`
      } catch (error) {
        assignErrors(this.serverErrors, error)
        console.error(error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.agent-login-form {
  max-width: 500px;
  margin: 0 auto;

  label {
    margin-right: 1rem;
    font-size: 1rem;
  }
}

.login-btn {
  text-align: center;
  margin: 1rem 0 3rem 0;
}
</style>
