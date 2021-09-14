<template>
  <div class="container">
    <div class="section">
      <h5>基本設定</h5>
      <dl class="row">
        <dt class="col m3">ブランド区分</dt>
        <dd class="col m9">{{ brandSection[Number(brand.section)] }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">ブランド名</dt>
        <dd class="col m9">{{ brand.name }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">読み(カナ)</dt>
        <dd class="col m9">{{ brand.kana }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">所属ストアブランド</dt>
        <dd class="col m9">
          {{ commonStoreBrand[Number(brand.storeBrand)] }}
        </dd>
      </dl>
      <dl class="row">
        <dt class="col m3">分類</dt>
        <dd class="col m9">{{ showBrandCategory(brand.category) }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">表示順</dt>
        <dd class="col m9">{{ brand.sort }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    brand: {
      type: Object,
      required: true,
    },
  },
  async fetch() {
    await this.$store.dispatch('enum/fetch')
  },
  data() {
    return {}
  },
  computed: {
    enumValueLabels() {
      return this.$store.getters['enum/valueLabel']
    },
    brandSection() {
      return this.enumValueLabels['brand/section'] ?? {}
    },
    commonStoreBrand() {
      return this.enumValueLabels['common/storeBrand'] ?? {}
    },
    brandCategory() {
      return this.enumValueLabels['brand/category'] ?? {}
    },
  },
  methods: {
    showBrandCategory(category) {
      return category ? this.brandCategory[Number(category)] : '-'
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
