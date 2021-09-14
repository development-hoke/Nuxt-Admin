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
                    <label for="item_id" class="control-label">item_id</label>
                    <text-field
                      id="item_id"
                      v-model="inputs.item_id"
                      name="item_id"
                      type="text"
                      class="form-control medium"
                      valid-name="item_id"
                      rules="required|max:255|integer"
                    />
                  </div>
                  <div class="control-fields">
                    <label for="amount" class="control-label">amount</label>
                    <text-field
                      id="amount"
                      v-model="inputs.amount"
                      name="amount"
                      type="text"
                      class="form-control medium"
                      valid-name="amount"
                      rules="required|max:255|integer"
                    />
                  </div>
                </form>
              </div>
              <div class="row">
                <button-submit
                  button-class="btn"
                  color="primary"
                  @onClick="handleClickSave"
                  >取り寄せ商品入荷通知</button-submit
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
          name: '取り寄せ商品入荷通知',
          route: { name: 'debug-backorder-arrivaled' },
        },
      ],
      inputs: {
        item_id: null,
        amount: null,
      },
    }
  },
  computed: {},
  methods: {
    async handleClickSave() {
      try {
        this.$store.commit('common/loading', true)
        const params = [{ ...this.inputs }]

        await axios
          .post(
            `items/back_order/arrivaled`,
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
