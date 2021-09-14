<template>
  <div class="container">
    <div class="section">
      <div class="row">
        <div class="col s3">
          <img :src="plan.thumbnail" class="materialboxed" width="150" />
        </div>
        <div class="col s9">
          <dl class="row">
            <dt class="col m3">タイトル</dt>
            <dd class="col m9">{{ plan.title }}</dd>
          </dl>
          <dl class="row">
            <dt class="col m3">ページURL</dt>
            <dd class="col m9">{{ planPageUrl }}{{ plan.slug }}</dd>
          </dl>
          <dl class="row">
            <dt class="col m3">表示ストアブランド</dt>
            <dd class="col m9">
              {{
                commonStoreBrand[Number(plan.storeBrand)]
                  ? commonStoreBrand[Number(plan.storeBrand)]
                  : '総合'
              }}
            </dd>
          </dl>
          <dl class="row">
            <dt class="col m3">表示箇所</dt>
            <dd class="col m9">
              {{
                placeOptions[Number(plan.place)]
                  ? placeOptions[Number(plan.place)]
                  : 'なし'
              }}
            </dd>
          </dl>
          <dl class="row">
            <dt class="col m3">本文</dt>
            <dd class="col m9">
              <div class="ck-content" v-html="plan.body"></div>
            </dd>
          </dl>
          <dl class="row">
            <dt class="col m3">公開ステータス</dt>
            <dd class="col m9">{{ plan.status ? '公開' : '非公開' }}</dd>
          </dl>
          <div v-if="plan.status">
            <dl class="row">
              <dt class="col m3">公開開始日時</dt>
              <dd class="col m9">
                {{ plan.periodFrom | date }}
              </dd>
            </dl>
            <dl class="row">
              <dt class="col m3">公開終了日時</dt>
              <dd class="col m9">
                {{ plan.periodTo | date }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    plan: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      planPageUrl: '',
    }
  },
  computed: {
    enumValueLabels() {
      return this.$store.getters['enum/valueLabel']
    },
    commonStoreBrand() {
      return this.enumValueLabels['common/storeBrand'] ?? {}
    },
    placeOptions() {
      return this.enumValueLabels['plan/place'] ?? {}
    },
  },
  mounted() {
    this.planPageUrl = process.env.planPageUrl
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
