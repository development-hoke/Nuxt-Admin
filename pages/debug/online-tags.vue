<template>
  <div class="row">
    <Breadcrumb :items="breadcrumbs" />
    <div class="col s12">
      <div class="container">
        <div class="section">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <button-submit
                  button-class="btn"
                  color="primary"
                  @onClick="handleClickSave"
                  >オンラインタグ取得</button-submit
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
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'

export default {
  components: {
    Breadcrumb,
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
          name: 'システムトークン',
          route: { name: 'debug-online-tags' },
        },
      ],
      jsonData: null,
    }
  },
  computed: {},
  methods: {
    async handleClickSave() {
      try {
        this.$store.commit('common/loading', true)
        await axios
          .fetch(
            `master/online_tags`,
            {},
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
