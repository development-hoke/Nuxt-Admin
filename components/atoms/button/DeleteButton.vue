<template>
  <div class="inline">
    <button-submit
      v-if="buttonLong"
      button-class="btn"
      color="danger"
      @onClick="handleClickDelete"
      >削除</button-submit
    >
    <a v-else-if="deleteForeverIcon" href="" @click.prevent="handleClickDelete"
      ><i class="material-icons">delete_forever</i></a
    >
    <a
      v-else
      href=""
      class="btn-floating red btn-small waves-effect waves-light"
      @click.prevent="handleClickDelete"
      ><i class="material-icons">delete</i></a
    >
    <ConfirmModal
      ref="confirmModal"
      type="warn"
      @ok="events.emit('confirmed', true)"
      @cancel="events.emit('confirmed', false)"
    >
      <template v-if="title" #title>
        <p>{{ title }}</p>
      </template>
      <template v-else #title>
        <p>削除確認</p>
      </template>
      <template v-if="body" #body>
        <p>{{ body }}</p>
      </template>
      <template v-else #body>
        <p>削除します。よろしいですか？</p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script>
import EventEmitter from 'events'
import ButtonSubmit from '@/components/molecules/button/ButtonSubmit'
import ConfirmModal from '@/components/organisms/modal/ConfirmModal'

export default {
  name: 'DeleteButton',
  emits: ['click'],
  components: {
    ButtonSubmit,
    ConfirmModal,
  },
  props: {
    buttonLong: {
      type: Boolean,
      default: false,
    },
    deleteForeverIcon: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
    },
    body: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      events: new EventEmitter(),
    }
  },
  methods: {
    async handleClickDelete() {
      if (this.$store.getters['common/loading']) {
        return
      }
      this.$refs.confirmModal.open()
      const result = await new Promise((resolve) =>
        this.events.once('confirmed', resolve)
      )
      this.$refs.confirmModal.close()
      if (result) {
        this.$emit('click')
      }
    },
  },
}
</script>

<style scoped>
.inline {
  display: inline-block;
}
</style>
