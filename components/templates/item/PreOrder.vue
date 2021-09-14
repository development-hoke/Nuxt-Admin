<template>
  <div class="pre-order mb-4">
    <div class="row mb-3">
      <div class="col s12 title">
        <span>予約販売設定</span>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s3 right-align-md">
        <span>
          予約設定
        </span>
      </div>
      <div class="col s9">
        <p>
          <label>
            <input type="checkbox" />
            <span>予約を受け付ける</span>
          </label>
        </p>
      </div>
    </div>
    <div class="row mb-1">
      <div class="col s3 right-align-md">
        <span>
          予約受付期間
        </span>
      </div>
      <div class="col s9">
        <input v-model="readingWay1" type="text" size="15" />
        <input v-model="readingWay1" type="text" size="6" />
        時
        <input v-model="readingWay1" type="text" size="6" />
        分 〜
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s3"></div>
      <div class="col s9">
        <input v-model="readingWay1" type="text" size="15" />
        <input v-model="readingWay1" type="text" size="6" />
        時
        <input v-model="readingWay1" type="text" size="6" />
        分
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s3"></div>
      <div class="col s9">
        <p>
          <label>
            <input type="checkbox" />
            <span>予約期間が終了しても通常販売は行わない</span>
          </label>
        </p>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s3 right-align-md">
        <span>
          予約販売価格
        </span>
      </div>
      <div class="col s9">
        <input v-model="readingWay1" type="text" size="15" />
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s3 right-align-md">
        <span>
          ポイント付与率
        </span>
      </div>
      <div class="col s9">
        <input v-model="readingWay1" type="text" size="15" /> ％
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s3 right-align-md">
        <span>
          予約可能数
        </span>
      </div>
      <div class="col s9">
        <table class="bordered striped">
          <thead>
            <tr>
              <th data-field="">色番</th>
              <th data-field="">サイズ番</th>
              <th data-field="">予約残在庫数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="3">11 クロ</td>
              <td>09</td>
              <td>0</td>
            </tr>
            <tr>
              <td>15</td>
              <td>0</td>
            </tr>
            <tr>
              <td>22</td>
              <td>0</td>
            </tr>
            <tr>
              <td rowspan="3">30 コン</td>
              <td>09</td>
              <td>0</td>
            </tr>
            <tr>
              <td>15</td>
              <td>0</td>
            </tr>
            <tr>
              <td>22</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s3 right-align-md">
        <span>
          予約在庫僅少表示閾値
        </span>
      </div>
      <div class="col s9">
        <input v-model="readingWay1" type="text" size="15" />
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s3 right-align-md">
        <span>
          予約在庫切れメール閾値
        </span>
      </div>
      <div class="col s9">
        <input v-model="readingWay1" type="text" size="15" />
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s3 right-align-md">
        <span>
          入荷予定
        </span>
      </div>
      <div class="col s9">
        <input v-model="readingWay1" type="text" size="15" />
      </div>
    </div>
    <div class="row mb-2">
      <div class="col s3 right-align-md">
        <span>
          予約商品の注意書き
        </span>
      </div>
      <div class="col s9">
        <textarea v-model="readingWay1" />
      </div>
    </div>
    <div class="row center">
      <div class="col s12">
        <a class="btn waves-effect waves-light lightrn-1" @click="save"
          >登録する</a
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      readingWay1: '',
    }
  },
  mounted() {},
  methods: {
    save() {
      console.log('save')
    },
  },
}
</script>
<style scoped>
.title {
  text-align: center;
  font-size: 20px;
}

.pre-order {
  padding: 20px;
}

input {
  width: auto !important;
  height: 24px !important;
  border: 0.5px solid #03a9f4 !important;
  text-align: center;
  margin: 0 !important;
}

input:focus {
  border-bottom: none !important;
}
</style>
