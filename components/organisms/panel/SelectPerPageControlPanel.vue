<template>
  <div class="row">
    <div class="col s12 right">
      <div class="input-field inline panel-content">
        <span class="input-label">表示件数:</span>
        <select v-model="selectedPerPage" class="browser-default">
          <option v-for="perPage in options" :key="perPage" :value="perPage">{{
            perPage
          }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectPerPageControlPanel',
  props: {
    options: {
      type: Array,
      default: () => [50, 100, 200],
    },
    defaultPerPage: {
      type: Number,
      default: 50,
    },
    route: {
      type: Object,
      default: null,
    },
  },
  computed: {
    selectedPerPage: {
      get() {
        return Number(this.$route.query.per_page ?? this.defaultPerPage)
      },
      set(perPage) {
        const route = this.route ?? this.$route
        const { query } = route

        this.$router.push({
          ...route,
          query: { ...query, per_page: perPage },
        })
      },
    },
  },
}
</script>

<style scoped lang="scss">
.panel-content {
  display: flex;
  justify-content: flex-end;

  .input-label {
    padding-top: 13px;
    min-width: 92px;
  }
  .browser-default {
    max-width: 100px;
  }
}
</style>
