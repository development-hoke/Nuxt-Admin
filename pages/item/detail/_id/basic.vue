<template>
  <div tag="div" class="tab-content active">
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
        <ItemStockTable
          :item-details="item.itemDetails"
          :color-dict="colorDict"
        />
      </div>

      <div class="section">
        <MediumTitle>ブランド</MediumTitle>
        <div class="row">
          <div class="mb-2 mt-2 col s12">
            <div class="control-fields control-fields-type1">
              <span>メインストアブランド :</span>
              <span>
                {{ commonStoreBrandValueLabel[item.mainStoreBrand] }}
              </span>
            </div>
          </div>
          <div class="mb-2 col s12">
            <div class="control-fields control-fields-type1">
              <span>サブストアブランド : </span>
              <RectangleSign
                v-for="brand in item.itemSubBrands"
                :key="brand.id"
                type="normal"
                class="ml-2"
                >{{
                  commonStoreBrandValueLabel[brand.subStoreBrand]
                }}</RectangleSign
              >
            </div>
          </div>
          <div class="col s12">
            <div class="control-fields control-fields-type1 row">
              <span class="col c12">表示ブランド名: {{ item.brand.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>商品価格</MediumTitle>
        <div class="row">
          <div class="col s10">
            <div class="row pl-0 mb-0 mt-0">
              値引率 : {{ multiply10NthPower(item.discountRate, 2) }}%
            </div>
            <div class="row mt-0">販売価格 : {{ yen(discountedPrice) }}</div>

            <div class="section mt-2">
              <SmallTitle>会員価格</SmallTitle>
              <div class="row">
                <div class="col s10">
                  <div class="row mt-3">
                    値引率 :
                    {{
                      item.isMemberDiscount
                        ? '会員価格を有効にする'
                        : '会員価格を有効にしない'
                    }}
                  </div>
                  <div class="row mt-2">
                    会員値引率 :
                    {{ multiply10NthPower(item.memberDiscountRate, 2) }}%
                  </div>
                  <div class="row mt-2">
                    会員販売価格 : {{ yen(memberDiscountedPrice) }}
                  </div>
                  <div class="row mt-3">上代 : {{ yen(item.retailPrice) }}</div>
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
                {{ dayjs(item.salesPeriodFrom).format('YYYY/MM/DD HH:mm:ss') }}
              </div>
            </div>
            <div class="row mb-2">
              <InlineFieldLabel class="col s2">終了:</InlineFieldLabel>
              <div class="col s10">
                {{ dayjs(item.salesPeriodTo).format('YYYY/MM/DD HH:mm:ss') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>商品ステータス</MediumTitle>
        <div class="row mb-2">
          <div class="col s10">
            {{ salesStatusValueLabel[item.salesStatus] }}
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>取り寄せ販売</MediumTitle>
        <div class="row mb-2">
          <div class="col s10">
            {{ Number(item.backOrderble) ? '可能' : '不可能' }}
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>返品</MediumTitle>
        <div class="row mb-2">
          <div class="col s10">
            {{ Number(item.returnable) ? '可能' : '不可能' }}
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>販売タイプ</MediumTitle>
        <div class="row mb-2">
          <div class="col s10">
            <RectangleSign
              v-for="salesType in item.salesTypes"
              :key="salesType.id"
              type="normal"
              class="ml-2"
              >{{ salesType.name }}</RectangleSign
            >
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
                  <th>オンライン分類</th>
                  <th>番号</th>
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
        </div>
      </div>

      <div class="section">
        <MediumTitle>オンラインタグ</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <div
              v-for="parentId in Object.keys(onlineTagGroups)"
              :key="parentId"
              class="control-fields row mb-2"
            >
              <div class="col s12">
                <span>{{ onlineTagDict[parentId].name }}:</span>
                <RectangleSign
                  v-for="childTag in onlineTagGroups[parentId]"
                  :key="childTag.id"
                  type="normal"
                  class="ml-1"
                  >{{ childTag.name }}</RectangleSign
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>商品説明</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <div class="ck-content" v-html="item.description"></div>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>サイズ情報</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <div class="ck-content" v-html="item.sizeOptionalInfo"></div>
          </div>
        </div>

        <MediumTitle>サイズに関する注意書き</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <div class="ck-content" v-html="item.sizeCaution"></div>
          </div>
        </div>

        <MediumTitle>素材情報</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <div class="ck-content" v-html="item.materialInfo"></div>
          </div>
        </div>

        <MediumTitle>素材に関する注意書き</MediumTitle>
        <div class="row mb-2">
          <div class="col s12">
            <div class="ck-content" v-html="item.materialCaution"></div>
          </div>
        </div>
      </div>

      <div class="section">
        <MediumTitle>商品画像登録</MediumTitle>
        <ItemImageTable
          :item-images="item.itemImages"
          :colors="colors"
          class="mb-2"
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
        <SelectItemList :items="itemsUsedSameStylings" :show-add-button="false">
          <template #item="props">
            <item-thumbnail :url="getImageUrl(props.item)" />
          </template>
        </SelectItemList>
      </div>

      <div class="section">
        <MediumTitle>おすすめ商品の登録</MediumTitle>
        <SelectItemList :items="recommendItems" :show-add-button="false">
          <template #item="props">
            <item-thumbnail :url="getImageUrl(props.item)" />
            <span>{{ props.item.name }}</span>
          </template>
        </SelectItemList>
      </div>
    </div>
  </div>
</template>

<script>
import EventEmitter from 'events'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import MediumTitle from '@/components/atoms/title/MediumTitle'
import SmallTitle from '@/components/atoms/title/SmallTitle'
import InlineFieldLabel from '@/components/atoms/label/InlineFieldLabel'
import ItemStockTable from '@/components/organisms/table/ItemStockTable'
import ItemThumbnail from '@/components/atoms/thumbnail/ItemThumbnail'
import SelectItemList from '@/components/molecules/input/SelectItemList'
import ItemImageTable from '@/components/organisms/table/ItemImageTable'
import RectangleSign from '@/components/atoms/sign/RectangleSign'
import { yen, percentile } from '@/utils/format'
import { aggrigate } from '@/utils/dataStructure'
import { getThumbnailImageUrl } from '@/utils/prop'
import { multiply10NthPower } from '@/utils/math'

export default {
  components: {
    MediumTitle,
    SmallTitle,
    InlineFieldLabel,
    ItemStockTable,
    SelectItemList,
    ItemThumbnail,
    ItemImageTable,
    RectangleSign,
  },
  async fetch() {
    const { id } = this.$route.params

    await Promise.all([
      this.$store.dispatch('item/fetchOne', { id }),
      this.$store.dispatch('color/fetch', { all: 1 }),
      this.$store.dispatch('enum/fetch'),
      this.$store.dispatch('onlineCategory/fetch'),
      this.$store.dispatch('onlineTag/fetch'),
      this.$store.dispatch('salesType/fetch', { all: 1 }),
    ])

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
      stylingFirstFetched: false,
    }
  },
  computed: {
    ...mapGetters({
      enumValueLabel: 'enum/valueLabel',
      enumOptions: 'enum/options',
      colors: 'color/data',
      colorDict: 'color/dict',
      colorOptions: 'color/options',
      onlineTagDict: 'onlineTag/dict',
      onlineCategoryDict: 'onlineCategory/dict',
      recommendItems: 'recommendItem/data',
      itemsUsedSameStylings: 'itemsUsedSameStyling/data',
      stylings: 'styling/data',
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
    discountedPrice() {
      return Math.round(
        this.item.retailPrice - this.item.retailPrice * this.item.discountRate
      )
    },
    memberDiscountedPrice() {
      return Math.round(
        this.item.retailPrice -
          this.item.retailPrice * this.item.memberDiscountRate
      )
    },
    categoryGroups() {
      return aggrigate(
        this.item.onlineCategories.map(({ id }) => this.onlineCategoryDict[id]),
        'level'
      )
    },
    onlineCategoryLevelOptions() {
      return this.enumOptions['onlineCategory/level']
    },
    onlineTagGroups() {
      return aggrigate(this.item.onlineTags, 'parentId')
    },
    commonStoreBrandValueLabel() {
      return this.enumValueLabel['common/storeBrand']
    },
    salesStatusValueLabel() {
      return this.enumValueLabel['item/salesStatus']
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
    getImageUrl(...args) {
      return getThumbnailImageUrl(...args)
    },
    multiply10NthPower(...args) {
      return multiply10NthPower(...args)
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
  },
}
</script>
