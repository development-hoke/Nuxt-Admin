<template>
  <div>
    <header class="modal-header">
      <slot name="header"></slot>
    </header>
    <section class="modal-body">
      <slot name="body"></slot>
    </section>
    <footer class="modal-footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ModalTemplate',
}
</script>

<style scoped lang="scss">
.modal-header,
.modal-footer {
  padding: 15px 5%;
}

.modal-header {
  border-bottom: 1px solid #eee;
  justify-content: space-between;
}

.modal-footer {
  height: unset;
  border-top: 1px solid #eee;
  justify-content: flex-end;

  .btn {
    margin-left: 6px !important;
  }
}

.modal-body {
  position: relative;
  padding: 20px 5%;
}
</style>
