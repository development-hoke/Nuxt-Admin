<template>
  <div class="container">
    <div class="section">
      <h5>基本設定</h5>
      <dl class="row">
        <dt class="col m3">ヘルプタイトル</dt>
        <dd class="col m9">{{ help.title }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">本文</dt>
        <dd class="col m9">
          <div class="ck-content" v-html="help.body"></div>
        </dd>
      </dl>
      <dl class="row">
        <dt class="col m3">優先度</dt>
        <dd class="col m9">
          {{ help.sort }}
        </dd>
      </dl>
      <dl class="row">
        <dt class="col m3">よくある質問に掲載する</dt>
        <dd class="col m9">
          {{ help.isFaq === true ? 'する' : 'しない' }}
        </dd>
      </dl>
      <dl class="row">
        <dt class="col m3">ヘルプカテゴリ</dt>
        <dd class="col m9">
          <div
            v-for="helpCategory in helpCategories"
            :key="helpCategory.id"
            class="col m9 pt-2"
          >
            {{ helpCategory.id }} |
            {{ helpCategory.name }}
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    help: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    helpCategories() {
      return this.help.helpCategories
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
