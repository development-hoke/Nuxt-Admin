<template>
  <div class="basic-info mb-4">
    <div class="row">
      <div class="mb-1 col s12 center">商品基本情報</div>
      <div class="mb-2 col s12">
        <table class="bordered striped">
          <thead>
            <tr>
              <th data-field="period">期</th>
              <th data-field="seasonal-symbol">季節記号</th>
              <th data-field="business-department">事業部</th>
              <th data-field="department-number">部門番号</th>
              <th data-field="part-number">事部品番</th>
              <th data-field="code-part-number">
                メーカーコード品番
              </th>
              <th data-field="fashion-rate">ファッション速度</th>
              <th data-field="product-name">商品名</th>
              <th data-field="ancient">上代(税込)</th>
              <th data-field="selling-rate">売変利率</th>
              <th data-field="start-date">売変開始日</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>65</td>
              <td>11</td>
              <td>11</td>
              <td>11</td>
              <td>111155555</td>
              <td>P400-9000</td>
              <td>4</td>
              <td>ニットブラウス</td>
              <td>15,300</td>
              <td>30%</td>
              <td>2020/01/31</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="mb-1 col s12">展開用写真</div>
      <div class="mb-2 col s12">
        <table class="bordered striped">
          <thead>
            <tr>
              <th data-field="black" colspan="2">11 クロ</th>
              <th data-field="con" colspan="2">30 コン</th>
              <th data-field="white" colspan="2">99 シロ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="center">
                <img width="80" height="100" src="~assets/img/image.jpg" />
              </td>
              <td class="center">
                <img width="80" height="100" src="~assets/img/image.jpg" />
              </td>
              <td class="center">
                <img width="80" height="100" src="~assets/img/image.jpg" />
              </td>
              <td class="center">
                <img width="80" height="100" src="~assets/img/image.jpg" />
              </td>
              <td class="center">
                <img width="80" height="100" src="~assets/img/image.jpg" />
              </td>
              <td class="center">
                <img width="80" height="100" src="~assets/img/image.jpg" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="mb-1 col s12">在庫情報</div>
      <div class="mb-2 col s6">
        <table class="bordered striped">
          <thead>
            <tr>
              <th data-field="">色番</th>
              <th data-field="">サイズ番</th>
              <th data-field="">予約残在庫数</th>
              <th data-field="">色別在庫数</th>
              <th data-field="">総在庫数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="3">11 クロ</td>
              <td>09</td>
              <td>10</td>
              <td rowspan="3">30</td>
              <td rowspan="9">45</td>
            </tr>
            <tr>
              <td>15</td>
              <td>10</td>
            </tr>
            <tr>
              <td>22</td>
              <td>10</td>
            </tr>
            <tr>
              <td rowspan="3">30 コン</td>
              <td>09</td>
              <td>3</td>
              <td rowspan="3">9</td>
            </tr>
            <tr>
              <td>15</td>
              <td>3</td>
            </tr>
            <tr>
              <td>22</td>
              <td>3</td>
            </tr>
            <tr>
              <td rowspan="3">99 コン</td>
              <td>13</td>
              <td>2</td>
              <td rowspan="3">6</td>
            </tr>
            <tr>
              <td>24</td>
              <td>2</td>
            </tr>
            <tr>
              <td>35</td>
              <td>2</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mb-2 col s6">
        <table class="bordered striped">
          <thead>
            <tr>
              <th data-field="">カラーパネル</th>
              <th data-field="">表示色番名</th>
              <th data-field="">表示順</th>
              <th data-field="">公開有無</th>
              <th data-field="">再入荷リクエスト</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="3">-</td>
              <td rowspan="3">グレー</td>
              <td rowspan="3">1</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td rowspan="3">-</td>
              <td rowspan="3">ダークブルー</td>
              <td rowspan="3">3</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td rowspan="3">-</td>
              <td rowspan="3">シロ</td>
              <td rowspan="3">2</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="mb-1 col s12">詳細商品情報</div>
      <div class="mb-2 col s12">
        <div class="row">
          <div class="mb-2 col s12">
            <div
              class="control-fields"
              style="display: inline-flex; margin: 0, 10%;"
            >
              <span>メインストアブランド :</span>
              <span>
                <radiobox
                  label=""
                  name="prev"
                  :options="[
                    { name: 'MEDOC', code: 'medoc' },
                    { name: 'LASUD', code: 'lasud' },
                    { name: 'VIN', code: 'vin' },
                    { name: 'Aga', code: 'aga' },
                    { name: 'FENNEL', code: 'fennel' },
                    { name: 'RADIATE', code: 'lasud' },
                    { name: 'CLOVE', code: 'clove' },
                  ]"
                ></radiobox>
              </span>
            </div>
          </div>
          <div class="mb-2 col s12">
            <div
              class="control-fields"
              style="display: inline-flex; margin: 0, 10%;"
            >
              <span>サブストアブランド : </span>
              <span>
                <label class="check-group">
                  <input type="checkbox" />
                  <span>MEDOC</span>
                </label>
                <label class="check-group">
                  <input type="checkbox" />
                  <span>LASUD</span>
                </label>
                <label class="check-group">
                  <input type="checkbox" />
                  <span>VIN</span>
                </label>
                <label class="check-group">
                  <input type="checkbox" />
                  <span>Aga</span>
                </label>
                <label class="check-group">
                  <input type="checkbox" />
                  <span>FENNEL</span>
                </label>
                <label class="check-group">
                  <input type="checkbox" />
                  <span>RADIATE</span>
                </label>
                <label class="check-group">
                  <input type="checkbox" />
                  <span>CLOVE</span>
                </label>
              </span>
            </div>
          </div>
          <div class="mt-2 col s12">
            <div
              class="control-fields"
              style="display: inline-flex; margin: 0, 10%;"
            >
              <span>表示ブランド名 : </span>
              <span>
                <select class="select2 browser-default">
                  <option value="test">表示ブランド名1</option>
                </select>
              </span>
            </div>
          </div>
          <div class="col s12">
            <div class="row">
              <div class="col s1">商品価格</div>
              <div class="col s9">
                <div class="row">
                  値引率 :
                  <div class="input-field inline">
                    <input type="text" />
                  </div>
                </div>
                <div class="row">
                  販売価格 :
                  <div class="input-field inline">
                    15,300円
                  </div>
                </div>
                <div class="row">
                  <div class="col s2 p-0">会員価格</div>
                  <div class="col s10">
                    <div class="row">
                      値引率 :
                      <label class="check-group">
                        <input type="checkbox" />
                        <span>会員価格を有効にする</span>
                      </label>
                    </div>
                    <div class="row">
                      会員値引率 :
                      <div class="input-field inline">
                        <input type="text" />
                      </div>
                    </div>
                    <div class="row">
                      会員販売価格 :
                      <div class="input-field inline">
                        15,300円
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  上代 :
                  <div class="input-field inline">
                    15,300円
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-1">
            <div class="col s2">
              <span>
                販売期間
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
            <div class="col s2"></div>
            <div class="col s9">
              <input v-model="readingWay1" type="text" size="15" />
              <input v-model="readingWay1" type="text" size="6" />
              時
              <input v-model="readingWay1" type="text" size="6" />
              分
            </div>
          </div>
          <div class="row mb-2">
            <div class="col s2">商品ステータス</div>
            <div class="col s10">
              <radiobox
                label=""
                name="prev"
                :options="[
                  { name: '販売中', code: '販売中' },
                  { name: '販売一時中止', code: '販売一時中止' },
                  { name: '販売終了', code: '販売終了' },
                ]"
              ></radiobox>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col s2">販売タイプ</div>
            <div class="col s10"></div>
          </div>
          <div class="row mb-2">
            <div class="col s3">オンライン分類 (カテゴリー)</div>
            <div class="col s9">
              <table class="bordered striped">
                <thead>
                  <tr>
                    <th data-field="">オンライン分類</th>
                    <th data-field="">番号</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>第一分類</td>
                    <td>11,13</td>
                  </tr>
                  <tr>
                    <td>第二分類</td>
                    <td>22,13</td>
                  </tr>
                  <tr>
                    <td>第三分類</td>
                    <td>33,13</td>
                  </tr>
                  <tr>
                    <td>第四分類</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>第五分類</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="row mb-1">
            <div class="col s12">オンラインタグ</div>
          </div>
          <div class="row mb-2">
            <div class="col s1"></div>
            <div class="col s10">
              <div class="mb-1 col s12">
                <div
                  class="control-fields"
                  style="display: inline-flex; margin: 0, 10%;"
                >
                  <span>素材 : </span>
                  <span>
                    <label class="check-group">
                      <input type="checkbox" />
                      <span>毛</span>
                    </label>
                    <label class="check-group">
                      <input type="checkbox" />
                      <span>ウール</span>
                    </label>
                    <label class="check-group">
                      <input type="checkbox" />
                      <span>モ乀ヤ</span>
                    </label>
                    <label class="check-group">
                      <input type="checkbox" />
                      <span>アンコラ</span>
                    </label>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- オンラインタグ -->
          <div class="row mb-1">
            <div class="col s12">オンラインタグ</div>
          </div>
          <div class="row mb-2">
            <div class="col s1"></div>
            <div class="col s10">
              <textarea />
            </div>
          </div>
          <!-- サイズ情報 -->
          <div class="row mb-1">
            <div class="col s12">サイズ情報</div>
          </div>
          <div class="row mb-2">
            <div class="col s1"></div>
            <div class="col s8">
              <table class="bordered striped">
                <tr>
                  <td>９号</td>
                  <td>
                    <div>袖 : 63cm</div>
                    <div>着丈 : 80cm</div>
                  </td>
                </tr>
              </table>
            </div>
            <div class="col s2">
              <button
                class="btn mb-1 waves-effect waves-light mr-1"
                name="action"
              >
                列を追加
                <i class="material-icons left">add</i>
              </button>
            </div>
            <div class="col s10 mt-2 add-row-btn">
              <button
                class="btn mb-1 waves-effect waves-light mr-1"
                name="action"
              >
                行を追加
                <i class="material-icons left">add</i>
              </button>
            </div>
          </div>
          <!-- サイズに関する注意書き -->
          <div class="row mb-1">
            <div class="col s12">サイズに関する注意書き</div>
          </div>
          <div class="row mb-2">
            <div class="col s1"></div>
            <div class="col s10">
              <textarea />
            </div>
          </div>
          <!-- 素材情報 -->
          <div class="row mb-1">
            <div class="col s12">素材情報</div>
          </div>
          <div class="row mb-2">
            <div class="col s1"></div>
            <div class="col s8">
              <table class="bordered striped">
                <tr>
                  <td>本体</td>
                  <td>
                    <div>レーヨン : 40%</div>
                    <div>ポリエステル : 60%</div>
                  </td>
                </tr>
              </table>
            </div>
            <div class="col s2">
              <button
                class="btn mb-1 waves-effect waves-light mr-1"
                name="action"
              >
                列を追加
                <i class="material-icons left">add</i>
              </button>
            </div>
            <div class="col s10 mt-2 add-row-btn">
              <button
                class="btn mb-1 waves-effect waves-light mr-1"
                name="action"
              >
                行を追加
                <i class="material-icons left">add</i>
              </button>
            </div>
          </div>
          <!-- 素材に関する注意書き -->
          <div class="row mb-1">
            <div class="col s12">素材に関する注意書き</div>
          </div>
          <div class="row mb-2">
            <div class="col s1"></div>
            <div class="col s10">
              <textarea />
            </div>
          </div>
          <!-- 商品画像登録 -->
          <div class="row mb-1 text-align-center">
            <div class="col s12">商品画像登録</div>
          </div>
          <div class="row mb-2">
            <div class="col s1"></div>
            <div class="col s10">
              <table class="bordered striped">
                <thead>
                  <tr>
                    <th data-field=""></th>
                    <th data-field="">ファイル名</th>
                    <th data-field="">カラーパネル</th>
                    <th data-field="">表示色番名</th>
                    <th data-field="">写真情報</th>
                    <th data-field=""></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img
                        class="materialboxed"
                        width="60"
                        height="80"
                        src="~assets/img/report-img.png"
                      />
                    </td>
                    <td>モデルimage1.jpg</td>
                    <td>-</td>
                    <td>
                      <select class="select2 browser-default">
                        <option value="グレー">グレー</option>
                        <option value="ダークブルー">ダークブルー</option>
                      </select>
                    </td>
                    <td>モデル身長163cm Sサイズ</td>
                    <td>
                      <a
                        class="waves-effect waves-light btn gradient-45deg-red-pink box-shadow-none border-round mr-1 mb-1"
                        >X 削除</a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col s12 mt-2 add-row-btn">
              <button
                class="btn mb-1 waves-effect waves-light mr-1"
                name="action"
              >
                追加
                <i class="material-icons left">add</i>
              </button>
            </div>
          </div>
          <!-- 紐付けられているスタッフコーディネート -->
          <div class="row mb-1 text-align-center">
            <div class="col s12">紐付けられているスタッフコーディネート</div>
          </div>
          <div class="row mb-2">
            <div class="col s1"></div>
            <div class="col s10">
              <div
                v-for="(item, index) in 6"
                :key="`img1-${index}`"
                class="col s2"
              >
                <img class="materialboxed" src="~assets/img/report-img.png" />
              </div>
            </div>
          </div>
          <!-- おすすめ商品の登録 -->
          <div class="row mb-1 text-align-center">
            <div class="col s12">おすすめ商品の登録</div>
          </div>
          <div class="row mb-2">
            <div class="col s1"></div>
            <div class="col s10">
              <div
                v-for="(item, index) in 6"
                :key="`img1-${index}`"
                class="col s2"
              >
                <img class="materialboxed" src="~assets/img/report-img.png" />
              </div>
            </div>
            <div class="col s12 mt-2 add-row-btn">
              <button
                class="btn mb-1 waves-effect waves-light mr-1"
                name="action"
                @click="onCreateItem"
              >
                追加
                <i class="material-icons left">add</i>
              </button>
            </div>
          </div>
          <!-- 似ている商品の登録 -->
          <div class="row mb-1 text-align-center">
            <div class="col s12">似ている商品の登録</div>
          </div>
          <div class="row mb-2">
            <div class="col s1"></div>
            <div class="col s10">
              <div
                v-for="(item, index) in 6"
                :key="`img1-${index}`"
                class="col s2"
              >
                <img class="materialboxed" src="~assets/img/report-img.png" />
              </div>
            </div>
            <div class="col s12 mt-2 mb-2 add-row-btn">
              <button
                class="btn mb-1 waves-effect waves-light mr-1"
                name="action"
                @click="onCreateItem"
              >
                追加
                <i class="material-icons left">add</i>
              </button>
            </div>
          </div>
          <!-- 公開せず保存, 保存して公開 -->
          <div class="row mb-1 mt-4 text-align-center">
            <div class="col s12">
              <a
                class="waves-effect waves-light btn gradient-45deg-green-teal box-shadow-none border-round mr-1 mb-1"
                >公開せず保存</a
              >
              <a
                class="waves-effect waves-light btn box-shadow-none border-round mr-1 mb-1"
                >保存して公開</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="visibleNewCreateItem"
      style="
        position: absolute;
        left: 0;
        right: 0;
        top: 80%;
        margin: auto;
        z-index: 1000;
        width: 650px;
      "
    >
      <div class="card lighten-4 padding-4">
        <div class="row center">
          <div class="col s12">
            事部品番(9桁) :
            <div class="input-field inline">
              <input type="text" />
            </div>
          </div>
        </div>
        <div class="row center">
          <div class="col s12">
            メーカー品番(8桁) :
            <div class="input-field inline">
              <input type="text" />
            </div>
          </div>
        </div>
        <div class="row center">
          <div class="col s12">
            <a class="btn waves-effect waves-light lightrn-1">検索</a>
          </div>
        </div>
        <div class="row mt-2 mb-1">該当商品</div>
        <div class="row center">
          <div v-for="(item, index) in 3" :key="`img1-${index}`" class="col s2">
            <img class="materialboxed" src="~assets/img/report-img.png" />
          </div>
        </div>
        <div class="row center mt-2">
          <div class="col s12">
            <a
              class="btn waves-effect waves-light lightrn-1"
              @click="saveNewItem"
              >追加</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Radiobox from '@/components/molecules/form/RadioBox'

export default {
  components: {
    Radiobox,
  },
  data() {
    return {
      readingWay1: '',
      visibleNewCreateItem: false,
    }
  },
  mounted() {},
  methods: {
    save() {
      console.log('save')
    },
    onCreateItem() {
      this.visibleNewCreateItem = true
    },
    saveNewItem() {
      this.visibleNewCreateItem = false
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

.check-group {
  margin-left: 15px;
}

.add-row-btn {
  text-align: center;
}

.text-align-center {
  text-align: center;
}
</style>
