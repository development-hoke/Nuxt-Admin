<template>
  <div class="row">
    <div class="col s6 left left-align">
      <slot name="left"></slot>
    </div>
    <div class="col s6">
      <div class="right right-align">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardHeader',
}
</script>

<style scoped lang="scss">
.left {
  > * {
    margin: 25px 10px;
    font-size: 18px;
  }
}
.right {
  margin: 25px 10px;
}
</style>
