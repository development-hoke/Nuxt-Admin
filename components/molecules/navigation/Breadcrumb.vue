<template>
  <div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
    <div class="container">
      <div class="row">
        <div class="col s12 m6 l6">
          <h5 class="breadcrumbs-title mt-0 mb-0">
            <span>{{ currentItemName }}</span>
          </h5>
        </div>
        <div class="col s12 m6 l6 right-align-md">
          <ol class="breadcrumbs mb-0">
            <li
              v-for="(item, index) in items"
              :key="index"
              class="breadcrumb-item"
            >
              <nuxt-link v-if="!isLastIndex(index)" :to="item.route">{{
                item.name
              }}</nuxt-link>
              <span v-else class="last-breadcrumb">{{ item.name }}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    currentItem() {
      return this.items[this.items.length - 1]
    },
    currentItemName() {
      return this.currentItem.name
    },
  },
  methods: {
    isLastIndex(index) {
      return this.items.length - 1 === index
    },
  },
}
</script>

<style scoped>
.breadcrumbs-bg-image {
  background-image: url('~assets/breadcrumb-bg.jpg') !important;
}
.last-breadcrumb {
  font-weight: 300;
}
</style>
