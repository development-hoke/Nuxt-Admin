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
                    <label for="item_jan_id" class="control-label"
                      >item_id</label
                    >
                    <text-field
                      id="item_jan_id"
                      v-model="inputs.item_jan_id"
                      name="item_jan_id"
                      type="text"
                      class="form-control medium"
                      valid-name="item_jan_id"
                      rules="required|max:255|integer"
                    />
                  </div>
                  <div class="control-fields">
                    <label for="ec_stock" class="control-label">ec_stock</label>
                    <text-field
                      id="ec_stock"
                      v-model="inputs.ec_stock"
                      name="ec_stock"
                      type="text"
                      class="form-control medium"
                      valid-name="ec_stock"
                      rules="required|max:255|integer"
                    />
                  </div>
                  <div class="control-fields">
                    <label for="reservable_stock" class="control-label"
                      >reservable_stock</label
                    >
                    <text-field
                      id="reservable_stock"
                      v-model="inputs.reservable_stock"
                      name="reservable_stock"
                      type="text"
                      class="form-control medium"
                      valid-name="reservable_stock"
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
                  >在庫更新</button-submit
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
          name: '在庫更新',
          route: { name: 'debug-stock-udpate' },
        },
      ],
      inputs: {
        item_jan_id: null,
        ec_stock: null,
        reservable_stock: null,
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
          .put(
            `items/update/stocks`,
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
            // console.error(error)
            console.log(error.response.data)
            if (error.response.data.errors.itemJanId) {
              this.$toast.error(error.response.data.errors.itemJanId[0])
            } else {
              this.$toast.error('APIエラー。入力内容を確認してください。')
            }
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
