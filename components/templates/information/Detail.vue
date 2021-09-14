<template>
  <div class="container">
    <div class="section">
      <h5>基本設定</h5>
      <dl class="row">
        <dt class="col m3">タイトル</dt>
        <dd class="col m9">{{ information.title }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">本文</dt>
        <dd class="col m9">
          <div class="ck-content" v-html="information.body"></div>
        </dd>
      </dl>
      <dl class="row">
        <dt class="col m3">公開日時</dt>
        <dd class="col m9">
          {{ dayjs(information.publishAt).format('YYYY/MM/DD HH時mm分') }}
        </dd>
      </dl>
      <dl class="row">
        <dt class="col m3">優先度</dt>
        <dd class="col m9">
          {{ information.priority }}
        </dd>
      </dl>
      <dl class="row">
        <dt class="col m3">公開ステータス</dt>
        <dd class="col m9">{{ information.status ? '公開' : '非公開' }}</dd>
      </dl>
      <dl class="row">
        <dt class="col m3">ストアトップに掲載する</dt>
        <dd class="col m9">
          {{ information.isStoreTop === true ? 'する' : 'しない' }}
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
    information: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dayjs,
    }
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
