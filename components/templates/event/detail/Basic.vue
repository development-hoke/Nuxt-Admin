<template>
  <div class="container">
    <div class="section">
      <h5>基本設定</h5>
      <dl class="row">
        <dt class="col m3">タイトル名</dt>
        <dd class="col m9">{{ event.title }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">開始日時</dt>
        <dd class="col m9">
          {{ dayjs(event.periodFrom).format('YYYY/MM/DD HH時mm分') }}
        </dd>
      </dl>
      <dl class="row">
        <dt class="col m3">終了日時</dt>
        <dd class="col m9">
          {{ dayjs(event.periodTo).format('YYYY/MM/DD HH時mm分') }}
        </dd>
      </dl>
      <dl class="row">
        <dt class="col m3">対象商品計上</dt>
        <dd class="col m9">{{ targetDict[event.target] }}</dd>
      </dl>
    </div>

    <div v-if="event.saleType == saleType.normal" class="section">
      <h5>通常セール設定</h5>
      <dl class="row">
        <dt class="col m3">値引率</dt>
        <dd class="col m9">
          <span>{{ discountTypeDict[event.discountType] }}</span>
          <template v-if="event.discountType == discountType.flat">
            <span>{{ discountRate }}</span>
          </template>
        </dd>
      </dl>
    </div>
    <div v-else class="section">
      <h5 class="col m9">バンドル販売設定</h5>
      <div class="row">
        <table class="highlight col m6 s12">
          <thead>
            <tr>
              <th>個数</th>
              <th>値引率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in event.eventBundleSales" :key="index">
              <td>{{ item.count }}<span>個</span></td>
              <td>{{ item.rate }}<span>%</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="event.isDeliverySetting" class="section">
      <h5>配送料設定</h5>
      <div class="row">
        <dt class="col m3">条件</dt>
        <dd class="col m9">{{ event.deliveryCondition }}円以上の購買</dd>
      </div>
      <div class="row">
        <dt class="col m3">配送料</dt>
        <dd class="col m9">{{ event.deliveryPrice }}円</dd>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'EventBasic',
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dayjs,
      activeTab: 'basic',
      selectedIcons: [],
    }
  },
  computed: {
    icons() {
      return this.$store.getters['icon/data']
    },
    eventIcon() {
      return this.icons.find(
        ({ id }) => Number(id) === Number(this.event.iconId)
      )
    },
    discountRate() {
      return `${Math.round(this.event.discountRate * 100)}%`
    },
    targetDict() {
      return this.$store.getters['enum/valueLabel']['event/target']
    },
    discountTypeDict() {
      return this.$store.getters['enum/valueLabel']['event/discountType']
    },
    saleType() {
      return this.$store.getters['enum/kv']['event/saleType']
    },
    discountType() {
      return this.$store.getters['enum/kv']['event/discountType']
    },
  },
}
</script>

<style scoped>
.row {
  margin-top: 22px;
}
.container {
  width: 90%;
  padding-bottom: 2rem;
}
</style>
