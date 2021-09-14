<template>
  <div class="container">
    <div class="section">
      <h5>基本設定</h5>
      <dl class="row">
        <dt class="col m3">ページタイトル</dt>
        <dd class="col m9">{{ page.title }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">ページURL</dt>
        <dd class="col m9">{{ staticPageUrl }}{{ page.slug }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">本文</dt>
        <dd class="col m9">
          <div class="ck-content" v-html="page.body"></div>
        </dd>
      </dl>
      <dl class="row">
        <dt class="col m3">公開ステータス</dt>
        <dd class="col m9">{{ page.status ? '公開' : '非公開' }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">公開開始日時</dt>
        <dd class="col m9">
          {{ dayjs(page.publishFrom).format('YYYY/MM/DD HH時mm分') }}
        </dd>
      </dl>
      <dl v-if="page.publishTo" class="row">
        <dt class="col m3">公開終了日時</dt>
        <dd class="col m9">
          {{ dayjs(page.publishTo).format('YYYY/MM/DD HH時mm分') }}
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  components: {},
  props: {
    page: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dayjs,
      staticPageUrl: '',
    }
  },
  computed: {},
  mounted() {
    this.staticPageUrl = process.env.staticPageUrl
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
