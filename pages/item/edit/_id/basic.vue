<template>
  <ValidationObserver
    v-slot="{ handleSubmit, invalid }"
    :external-errors="serverErrors"
    tag="div"
    class="tab-content active"
  >
    <Loading :show="$fetchState.pending" />
    <div v-if="!$fetchState.pending" class="basic-info mb-4 container">
      <div class="section">
        <MediumTitle>商品基本情報</MediumTitle>
        <div class="row">
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
                  <td>{{ item.termId }}</td>
                  <td>{{ item.seasonId }}</td>
                  <td>{{ item.divisionId }}</td>
                  <td>{{ item.departmentId }}</td>
                  <td>{{ item.productNumber }}</td>
                  <td>{{ item.makerProductNumber }}</td>
                  <td>{{ item.fashionSpeed }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ yen(item.retailPrice) }}</td>
                  <td>{{ percentile(item.priceChangeRate) }}</td>
                  <td>
                    {{
                      dayjs(item.priceChangePeriod).format(
                        'YYYY/MM/DD HH時mm分'
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>展開用写真</MediumTitle>
        <div class="row">
          <div class="mb-2 col s12">
            <table class="bordered striped">
              <thead>
                <tr>
                  <th
                    v-for="colorId in Object.keys(backendItemImageGroups)"
                    :key="colorId"
                    data-field="black"
                    :colspan="backendItemImageGroups[colorId].length"
                  >
                    <template v-if="colorDict[colorId]">
                      {{ `${colorId} ${colorDict[colorId].name}` }}
                    </template>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <template
                    v-for="colorId in Object.keys(backendItemImageGroups)"
                  >
                    <td
                      v-for="image in backendItemImageGroups[colorId]"
                      :key="image.id"
                      class="center"
                    >
                      <item-thumbnail :url="image.urlM" :alt="item.name" />
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>在庫情報</MediumTitle>
        <ItemStockTableInput
          v-model="inputs.itemDetails"
          :item-details="item.itemDetails"
          :color-dict="colorDict"
        />
      </div>
      <div class="section">
        <MediumTitle>表示商品名</MediumTitle>
        <div class="row mb-2">
          <div class="col s10">
            <TextField
              v-model="inputs.displayName"
              rules="required|max:255"
              name="displayName"
              valid-name="表示商品名"
            />
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>ブランド</MediumTitle>
        <div class="row">
          <div class="mb-2 mt-2 col s12">
            <div class="control-fields control-fields-type1">
              <span>メインストアブランド :</span>
              <span>
                <radiobox
                  v-model="inputs.mainStoreBrand"
                  valid-name="メインストアブランド"
                  name="storeBrand"
                  rules="required"
                  :options="storeBrandOptions"
                ></radiobox>
              </span>
            </div>
          </div>
          <div class="mb-2 col s12">
            <div class="control-fields control-fields-type1">
              <span>サブストアブランド : </span>
              <checkbox-list
                v-model="inputs.itemSubBrands"
                valid-name="サブストアブランド"
                name="subStoreBrand"
                :options="storeBrandOptions"
                wrapper-tag="span"
                input-field-class="check-group"
                wrapper-class="check-group-wrap"
              />
            </div>
          </div>
          <div class="col s12">
            <div class="control-fields control-fields-type1 row">
              <InlineFieldLabel class="col c2 mt-5"
                >表示ブランド名:
              </InlineFieldLabel>
              <span class="col c10">
                <SelectInput
                  v-model="inputs.brandId"
                  :options="brandOptions"
                  :use-unselect-option="false"
                  valid-name="表示ブランド名"
                  name="brandId"
                  rules="required"
                  input-field-class="mt-0"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>商品価格</MediumTitle>
        <div class="row">
          <div class="col s10">
            <div class="row pl-0 mb-0 mt-0">
              <div class="col s12">
                値引率 :
                <div class="input-field inline ml-3">
                  <percent-field
                    v-model="inputs.discountRate"
                    valid-name="値引率"
                    name="discountRate"
                    rules="required"
                  />
                </div>
              </div>
            </div>
            <div class="row mt-0">
              <div class="col s12">
                販売価格 :
                <div class="input-field inline">
                  {{ yen(discountedPrice) }}
                </div>
              </div>
            </div>

            <div class="section mt-2">
              <SmallTitle>会員価格</SmallTitle>
              <div class="row">
                <div class="col s10">
                  <div class="row mt-3">
                    <div class="col s12">
                      値引率 :
                      <label class="check-group">
                        <input
                          v-model="inputs.isMemberDiscount"
                          valid-name="値引率"
                          name="isMemberDiscount"
                          type="checkbox"
                        />
                        <span>会員価格を有効にする</span>
                      </label>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col s12">
                      会員値引率 :
                      <div class="input-field inline">
                        <percent-field
                          v-model="inputs.memberDiscountRate"
                          valid-name="会員値引率"
                          name="memberDiscountRate"
                          rules="required_if:isMemberDiscount,true"
                          :replace-messages="{
                            required_if:
                              '会員価格を有効にした場合、会員値引率は必須です。',
                          }"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col s12">
                      会員販売価格 :
                      <div class="input-field inline">
                        {{ yen(memberDiscountedPrice) }}
                      </div>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col s12">
                      上代 :
                      <div class="input-field inline">
                        {{ yen(item.retailPrice) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>販売期間</MediumTitle>
        <div class="row">
          <div class="col s12">
            <div class="row mb-1">
              <InlineFieldLabel class="col s2">開始:</InlineFieldLabel>
              <div class="col s10">
                <DateitemPickerField
                  v-model="inputs.salesPeriodFrom"
                  rules="date_required|date_lt:salesPeriodTo"
                  name="salesPeriodFrom"
                  :clear-button="false"
                  valid-name="開始日時"
                />
              </div>
            </div>
            <div class="row mb-2">
              <InlineFieldLabel class="col s2">終了:</InlineFieldLabel>
              <div class="col s10">
                <DateitemPickerField
                  v-model="inputs.salesPeriodTo"
                  rules="date_required"
                  name="salesPeriodTo"
                  :clear-button="false"
                  valid-name="終了日時"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>商品ステータス</MediumTitle>
        <div class="row mb-2">
          <div class="col s10">
            <radiobox
              v-model="inputs.salesStatus"
              valid-name="商品ステータス"
              name="salesStatus"
              :options="salesStatusOptions"
            ></radiobox>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>取り寄せ販売</MediumTitle>
        <div class="row mb-2">
          <div class="col s10">
            <radiobox
              v-model="inputs.backOrderble"
              valid-name="取り寄せ販売"
              name="backOrderble"
              :options="[
                { code: 1, name: '可能' },
                { code: 0, name: '不可能' },
              ]"
            ></radiobox>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>返品</MediumTitle>
        <div class="row mb-2">
          <div class="col s10">
            <radiobox
              v-model="inputs.returnable"
              valid-name="返品"
              name="returnable"
              :options="[
                { code: 1, name: '可能' },
                { code: 0, name: '不可能' },
              ]"
            ></radiobox>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>販売タイプ</MediumTitle>
        <div class="row mb-2">
          <div class="col s10">
            <SortableListSelectField
              v-model="inputs.salesTypes"
              display-name="販売タイプ"
              name="salesTypes"
              :options="salesTypeOptions"
            />
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>オンライン分類 (カテゴリー)</MediumTitle>
        <div class="row mb-2">
          <div class="col s8">
            <table class="bordered striped">
              <thead>
                <tr>
                  <th data-field="">オンライン分類</th>
                  <th data-field="">番号</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="{ code, name } in onlineCategoryLevelOptions"
                  :key="code"
                >
                  <td>{{ name }}</td>
                  <td>
                    <template v-if="categoryGroups[code]">{{
                      categoryGroups[code].map(({ id }) => id).join(',')
                    }}</template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col s1">
            <EditButton @click="handleClickOnlineCategoryTable" />
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>オンラインタグ</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <div
              v-for="parentTag in onlineTagTree"
              :key="parentTag.id"
              class="control-fields row mb-1"
            >
              <div v-if="parentTag.children.length > 0" class="col s12">
                {{ parentTag.name }}:<checkbox-list
                  v-model="inputs.onlineTagId"
                  valid-name="オンラインタグ"
                  name="onlineTag"
                  :options="createOptions(parentTag.children)"
                  wrapper-tag="span"
                  input-field-class="check-group"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>商品説明</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <editor-field
              v-model="inputs.description"
              name="description"
              rules="required"
              valid-name="商品説明"
            />
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>サイズ情報</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <editor-field
              ref="sizeOptionalInfo"
              v-model="inputs.sizeOptionalInfo"
              name="sizeOptionalInfo"
              rules="max:10000"
              valid-name="サイズ情報"
            />
          </div>
        </div>

        <MediumTitle>サイズに関する注意書き</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <editor-field
              v-model="inputs.sizeCaution"
              name="sizeCaution"
              rules="max:10000"
              valid-name="サイズに関する注意書き"
            />
          </div>
        </div>

        <MediumTitle>素材情報</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <editor-field
              ref="materialInfo"
              v-model="inputs.materialInfo"
              name="materialInfo"
              rules="max:10000"
              valid-name="素材情報"
            />
          </div>
        </div>

        <MediumTitle>素材に関する注意書き</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <editor-field
              v-model="inputs.materialCaution"
              name="materialCaution"
              rules="max:10000"
              valid-name="素材に関する注意書き"
            />
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>商品画像登録</MediumTitle>
        <ItemImageTableInput
          v-model="inputs.itemImages"
          :colors="colors"
          class="mb-2"
          @image-update="updateImagesList"
        />
      </div>

      <div class="section">
        <MediumTitle>紐付けられているスタッフコーディネート</MediumTitle>
        <SelectItemList
          :items="stylings"
          :show-add-button="false"
          :use-inifiniate-loading="true"
          @reached-end="handleStylingReachedEnd"
        >
          <template #item="props">
            <item-thumbnail :url="props.item.imageUrl" />
          </template>
        </SelectItemList>
      </div>

      <div class="section">
        <MediumTitle>コーディネートに使用した商品</MediumTitle>
        <SelectItemList
          :items="inputs.itemsUsedSameStylings"
          @add="handleAddItemsUsedSameStyling"
        >
          <template #item="props">
            <cancel-button @click="deleteStylingThumbnail(props.item)" />
            <item-thumbnail :url="getImageUrl(props.item)" />
          </template>
        </SelectItemList>
      </div>

      <div class="section">
        <MediumTitle>おすすめ商品の登録</MediumTitle>
        <radiobox
          v-model="inputs.isManuallySettingRecommendation"
          valid-name="おすすめ商品の登録"
          name="isManuallySettingRecommendation"
          input-class="form-control"
          direction="vertical"
          :options="[
            {
              code: recommendedFormat.brand,
              name: '同ブランドの新着商品を表示',
            },
            { code: recommendedFormat.manual, name: '手動で登録' },
          ]"
          @input="updateStatus"
        ></radiobox>
        <template
          v-if="
            inputs.isManuallySettingRecommendation === recommendedFormat.manual
          "
        >
          <SelectItemList
            :items="inputs.recommendItems"
            @add="handleAddRecommendItem"
          >
            <template #item="props">
              <cancel-button @click="deleteRecommendThumbnail(props.item)" />
              <item-thumbnail :url="getImageUrl(props.item)" />
              <span>{{ props.item.name }}</span>
            </template>
          </SelectItemList>
        </template>
      </div>

      <Notice v-if="invalid" type="warn"
        >入力エラーがあるため保存出来ません。</Notice
      >

      <div class="row mt-4 mb-1">
        <div class="col s12 center-align">
          <ButtonSubmit
            color="secondary"
            :disabled="invalid"
            @onClick="handleSubmit(() => handleClickSave(false))"
            >公開せず保存</ButtonSubmit
          >
          <ButtonSubmit
            color="primary"
            @onClick="handleSubmit(() => handleClickPreview())"
            >プレビュー</ButtonSubmit
          >
          <ButtonSubmit
            color="primary"
            :disabled="invalid"
            @onClick="handleSubmit(() => handleClickSave(true))"
            >保存して公開</ButtonSubmit
          >
        </div>
      </div>

      <ErrorMessageList
        class="row mb-1 mt-2 center-align"
        :messages="serverErrors.global"
      />

      <SelectItemInputModal
        ref="selectItemInputModal"
        @select="(items) => events.emit('selectItems', items)"
      />
      <TreeViewSelectInputModal
        ref="treeViewSelectInputModal"
        :tree="onlineCategoryTree"
        :dict="onlineCategoryDict"
        @enter="(items) => events.emit('enterOnlineCategory', items)"
      />
    </div>
  </ValidationObserver>
</template>

<script>
import EventEmitter from 'events'
import querystring from 'querystring'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import MediumTitle from '@/components/atoms/title/MediumTitle'
import SmallTitle from '@/components/atoms/title/SmallTitle'
import InlineFieldLabel from '@/components/atoms/label/InlineFieldLabel'
import ItemStockTableInput from '@/components/organisms/input/ItemStockTableInput'
import TextField from '@/components/molecules/form/TextField'
import CancelButton from '@/components/atoms/button/CancelButton'
import Radiobox from '@/components/molecules/form/RadioBox'
import CheckboxList from '@/components/molecules/form/CheckboxList'
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import SelectInput from '@/components/molecules/form/SelectInput'
import DateitemPickerField from '@/components/molecules/form/DateitemPickerField'
import SelectItemList from '@/components/molecules/input/SelectItemList'
import SelectItemInputModal from '@/components/organisms/modal/SelectItemInputModal'
import TreeViewSelectInputModal from '@/components/organisms/modal/TreeViewSelectInputModal'
import ItemImageTableInput from '@/components/organisms/input/ItemImageTableInput'
import EditorField from '@/components/molecules/form/EditorField'
import PercentField from '@/components/molecules/form/PercentField'
import SortableListSelectField from '@/components/molecules/form/SortableListSelectField'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import EditButton from '@/components/atoms/button/EditButton'
import ErrorMessageList from '@/components/organisms/notice/ErrorMessageList'
import Notice from '@/components/molecules/notice/Notice'
import { assignErrors, extractValidationError } from '@/plugins/vee-validate'
import { yen, percentile } from '@/utils/format'
import { aggrigate, createOptions } from '@/utils/dataStructure'
import * as arrayUtil from '@/utils/array'
import { getThumbnailImageUrl } from '@/utils/prop'
import { sumProp } from '@/utils/math'

export default {
  components: {
    MediumTitle,
    SmallTitle,
    InlineFieldLabel,
    ItemStockTableInput,
    TextField,
    Radiobox,
    CheckboxList,
    SelectInput,
    DateitemPickerField,
    SelectItemList,
    SelectItemInputModal,
    TreeViewSelectInputModal,
    ItemThumbnail,
    ItemImageTableInput,
    EditorField,
    PercentField,
    SortableListSelectField,
    ButtonSubmit,
    EditButton,
    ErrorMessageList,
    Notice,
    CancelButton,
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([
      this.$store.dispatch('item/fetchOne', { id }),
      this.$store.dispatch('brand/fetch'),
      this.$store.dispatch('master/fetchTerms'),
      this.$store.dispatch('color/fetch', { all: 1 }),
      this.$store.dispatch('enum/fetch'),
      this.$store.dispatch('onlineTag/fetch'),
      this.$store.dispatch('onlineCategory/fetch'),
      this.$store.dispatch('salesType/fetch', { all: 1 }),
    ])

    this.initializeInputs()

    this.$store
      .dispatch('styling/fetchCursor', {
        params: { productNumber: this.item.productNumber },
      })
      .then(() => {
        this.stylingFirstFetched = true
        this.events.emit('stylingFeached')
      })
  },
  data() {
    return {
      events: new EventEmitter(),
      inputs: null,
      serverErrors: {},
      stylingFirstFetched: false,
    }
  },
  computed: {
    ...mapGetters({
      brandOptions: 'brand/options',
      termDict: 'master/termDict',
      colors: 'color/data',
      colorDict: 'color/dict',
      onlineTagTree: 'onlineTag/tree',
      onlineCategoryTree: 'onlineCategory/tree',
      onlineCategoryDict: 'onlineCategory/dict',
      itemsUsedSameStylings: 'itemsUsedSameStyling/data',
      itemsUsedSameStylingDict: 'itemsUsedSameStyling/dict',
      recommendItems: 'recommendItem/data',
      salesTypeOptions: 'salesType/data',
      stylings: 'styling/data',
      enumKv: 'enum/kv',
    }),
    itemId() {
      return this.$route.params.id
    },
    item() {
      return this.$store.getters['item/find'](this.itemId)
    },
    backendItemImageGroups() {
      if (!this.item) {
        return {}
      }

      return aggrigate(
        this.item.backendItemImages.map((image) => {
          return { ...image, colorId: image.colorId ?? -1 }
        }),
        'colorId'
      )
    },
    storeBrandOptions() {
      return this.$store.getters['enum/options']['common/storeBrand'] ?? []
    },
    salesStatusOptions() {
      return this.$store.getters['enum/options']['item/salesStatus'] ?? []
    },
    discountedPrice() {
      return Math.round(
        this.item.retailPrice - this.item.retailPrice * this.inputs.discountRate
      )
    },
    memberDiscountedPrice() {
      return Math.round(
        this.item.retailPrice -
          this.item.retailPrice * this.inputs.memberDiscountRate
      )
    },
    categoryGroups() {
      return aggrigate(
        this.inputs.onlineCategoryId.map((id) => this.onlineCategoryDict[id]),
        'level'
      )
    },
    onlineCategoryLevelOptions() {
      return this.$store.getters['enum/options']['onlineCategory/level']
    },
    recommendedFormat() {
      return this.enumKv['recommended/format'] || {}
    },
  },
  methods: {
    yen(...args) {
      return yen(...args)
    },
    percentile(...args) {
      return percentile(...args)
    },
    dayjs(...args) {
      return dayjs(...args)
    },
    sumProp(...args) {
      return sumProp(...args)
    },
    createOptions(...args) {
      return createOptions(...args)
    },
    getImageUrl(...args) {
      return getThumbnailImageUrl(...args)
    },
    deleteStylingThumbnail(item) {
      const result = []
      this.inputs.itemsUsedSameStylings.map((node) => {
        if (node.id !== item.id) {
          result.push(node)
        }
      })
      this.inputs.itemsUsedSameStylings = result
    },
    deleteRecommendThumbnail(item) {
      const result = []
      this.inputs.recommendItems.map((node) => {
        if (node.id !== item.id) {
          result.push(node)
        }
      })
      this.inputs.recommendItems = result
    },
    async handleStylingReachedEnd($state) {
      try {
        if (!this.stylingFirstFetched) {
          await new Promise((resolve) =>
            this.events.once('stylingFeached', resolve)
          )
          $state.loaded()
          return
        }

        await this.$store.dispatch('styling/nextPage', {
          params: { productNumber: this.item.productNumber },
        })

        if (this.$store.getters['styling/cursor'].isReachedEnd) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } catch (error) {
        console.error(error)
        $state.error()
      }
    },
    initializeInputs() {
      const item = this.item
      const inputs = { ...item }

      inputs.itemImages = item.itemImages.map((image) => ({
        ...image,
        isNew: false,
      }))
      inputs.onlineCategoryId = item.onlineCategories.map(({ id }) => id)
      inputs.onlineTagId = item.onlineTags.map(({ id }) => id)
      inputs.itemDetails = item.itemDetails.map(
        ({ id, sort, redisplayRequested, status, colorId }) => ({
          id,
          sort,
          redisplayRequested,
          colorId,
          status: Boolean(status),
        })
      )
      inputs.itemSubBrands = item.itemSubBrands.map(
        ({ subStoreBrand }) => subStoreBrand
      )
      inputs.salesTypes = item.salesTypes.map((salesType) => ({ ...salesType }))
      inputs.recommendItems = this.recommendItems.map((item) => ({ ...item }))
      inputs.itemsUsedSameStylings = this.itemsUsedSameStylings.map((item) => ({
        ...item,
      }))

      if (!inputs.materialInfo) {
        inputs.materialInfo = require('@/assets/html/editor/item-material-info.html')
      }
      if (!inputs.sizeOptionalInfo) {
        inputs.sizeOptionalInfo = require('@/assets/html/editor/item-size-optional-info.html')
      }

      this.inputs = inputs
    },

    async handleClickSave(publishing) {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.serverErrors = {}

        this.$store.commit('common/loading', true)

        const params = this.buildParams(publishing)
        const id = this.item.id

        await this.$store.dispatch('item/update', { id, params })

        this.initializeInputs()
        this.$toast.success('商品を更新しました')
      } catch (error) {
        console.error(error)
        assignErrors(this.serverErrors, error)
        const { product } = extractValidationError(error)
        if (product) {
          this.$toast.error(product[0])
        } else {
          this.$toast.error('商品の更新に失敗しました')
        }
      } finally {
        this.$store.commit('common/loading', false)
      }
    },

    buildParams(status = null) {
      const params = {}

      if (status !== null) {
        params.status = status
      }

      params.mainStoreBrand = this.inputs.mainStoreBrand
      params.name = this.inputs.name
      params.displayName = this.inputs.displayName
      params.discountRate = this.inputs.discountRate
      params.isMemberDiscount = this.inputs.isMemberDiscount
      params.memberDiscountRate = this.inputs.memberDiscountRate
      params.salesPeriodFrom = this.inputs.salesPeriodFrom
      params.salesPeriodTo = this.inputs.salesPeriodTo

      params.salesStatus = this.inputs.salesStatus
      params.backOrderble = this.inputs.backOrderble
      params.returnable = this.inputs.returnable
      params.description = this.inputs.description
      params.sizeCaution = this.inputs.sizeCaution
      params.materialCaution = this.inputs.materialCaution
      params.isManuallySettingRecommendation = this.inputs.isManuallySettingRecommendation

      if (this.$refs.sizeOptionalInfo.isDirty()) {
        params.sizeOptionalInfo = this.inputs.sizeOptionalInfo
      }
      if (this.$refs.materialInfo.isDirty()) {
        params.materialInfo = this.inputs.materialInfo
      }

      params.itemDetails = this.inputs.itemDetails.map(
        ({ id, sort, status, redisplayRequested }) => ({
          id,
          sort,
          redisplayRequested,
          status: Number(status),
        })
      )
      params.itemImages = this.inputs.itemImages.map((image) => ({
        ...image,
      }))
      params.onlineCategoryId = [...this.inputs.onlineCategoryId]
      params.onlineTagId = [...this.inputs.onlineTagId]
      params.itemSubBrands = [...this.inputs.itemSubBrands]
      params.brandId = this.inputs.brandId
      params.salesTypes = this.inputs.salesTypes.map(({ id, sort }, index) => ({
        id,
        sort,
      }))
      params.recommendItemId = this.inputs.recommendItems.map(({ id }) => id)
      params.itemsUsedSameStylingUsedItemId = this.inputs.itemsUsedSameStylings.map(
        ({ id }) => id
      )

      return params
    },

    async handleAddItemsUsedSameStyling() {
      if (this.inputs.itemsUsedSameStylings.length >= 10) {
        this.$toast.error('10以上の商品は追加できません。')
        return false
      }
      const exclueds = this.inputs.itemsUsedSameStylings.map(({ id }) => id)

      this.$refs.selectItemInputModal.open({
        exclueds,
        title: 'コーディネートに使用した商品',
      })

      const items = await new Promise((resolve) =>
        this.events.once('selectItems', resolve)
      )

      if (items.length === 0) {
        this.$refs.selectItemInputModal.close()
        return
      }

      const newItems = arrayUtil.unique(
        this.inputs.itemsUsedSameStylings.concat(items)
      )
      this.$set(this.inputs, 'itemsUsedSameStylings', newItems)

      this.$refs.selectItemInputModal.close()
    },

    async handleAddRecommendItem() {
      if (this.inputs.recommendItems.length >= 10) {
        this.$toast.error('10以上の商品は追加できません。')
        return false
      }
      const exclueds = this.inputs.recommendItems.map(({ id }) => id)

      this.$refs.selectItemInputModal.open({
        exclueds,
        title: 'おすすめ商品の登録',
      })

      const items = await new Promise((resolve) =>
        this.events.once('selectItems', resolve)
      )

      if (items.length === 0) {
        this.$refs.selectItemInputModal.close()
        return
      }

      const newItems = arrayUtil.unique(
        this.inputs.recommendItems.concat(items)
      )
      this.$set(this.inputs, 'recommendItems', newItems)

      this.$refs.selectItemInputModal.close()
    },

    async handleClickOnlineCategoryTable() {
      this.$refs.treeViewSelectInputModal.open({
        value: this.inputs.onlineCategoryId,
        title: 'オンライン分類（カテゴリー）',
      })

      const onlineCategoryId = await new Promise((resolve) =>
        this.events.once('enterOnlineCategory', resolve)
      )

      this.$set(this.inputs, 'onlineCategoryId', onlineCategoryId)
    },
    async handleClickPreview() {
      const token = this.$store.getters['currentUser/accessToken']
      const productNumber = this.item.productNumber
      const baseUrl = process.env.frontBaseUrl

      const { key } = await this.storePreview()

      const params = querystring.stringify({ token, key })

      window.open(
        `${baseUrl}/items/detail/${productNumber}/preview/?${params}`,
        '_blank'
      )
    },
    async storePreview() {
      if (this.$store.getters['common/loading']) {
        return
      }

      try {
        this.serverErrors = {}

        this.$store.commit('common/loading', true)

        const params = this.buildParams()
        const id = this.item.id

        const { data } = await this.$api.item.createPreview(id, params)

        return data
      } catch (error) {
        console.error(error)
        assignErrors(this.serverErrors, error)
        this.$toast.error('プレビューデータを作成出来ませんでした。')
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    updateStatus(value) {
      this.inputs.isManuallySettingRecommendation = value
    },
    async updateImagesList() {
      const { id } = this.$route.params
      await Promise.all([this.$store.dispatch('item/fetchOne', { id })])
      this.initializeInputs()
    },
  },
}
</script>

<style scoped lang="scss">
input:focus {
  border-bottom: none !important;
}

.check-group {
  margin-left: 15px;
}

.check-group-wrap {
  margin-left: 15px;
}

.control-fields-type1 {
  display: inline-flex;
}

::v-deep .input-field {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
::v-deep .check-group:first-child {
  margin-left: 15px;
}

.materialboxed {
  margin: 0 auto;
}
.staff-coord {
  overflow-x: auto;
  display: flex;

  .staff-coord-item {
    margin-right: 60px;
  }
}
</style>
