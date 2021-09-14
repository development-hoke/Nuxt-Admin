<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header id="modalTitle" class="modal-header">
          <slot name="modal__header"> </slot>
        </header>
        <section id="modalDescription" class="modal-body">
          <slot name="modal__body">
            I'm the default body!
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="modal__footer">
            I'm the default footer!

            <button
              type="button"
              class="btn-green"
              aria-label="Close modal"
              @click="close"
            >
              Close me!
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
}

.modal {
  background: #fff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #eee;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eee;
  justify-content: flex-end;
}

.modal-footer .btn {
  margin-left: 6px !important;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  border: none;
  font-size: 20px;
  padding: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
  border-radius: 2px;
}
</style>
