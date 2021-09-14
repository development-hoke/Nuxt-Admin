<template>
  <tr>
    <td>{{ eventUser.memberId }}</td>
    <td>
      {{ getMemberName(eventUser.member) }}<br />
      {{ getMemberKana(eventUser.member) }}
    </td>
    <td>{{ eventUser.member ? eventUser.member.email : '' }}</td>
    <td v-if="showController">
      <DeleteButton
        title="ユーザー削除"
        body="ユーザーを削除します。よろしいですか？"
        :delete-forever-icon="true"
        @click="handleClickDelete(closedMarket)"
      />
      <small-error-message-list
        v-show="errors.global.length"
        :messages="errors.global"
      />
    </td>
  </tr>
</template>

<script>
import EventEmitter from 'events'
import DeleteButton from '@/components/atoms/button/DeleteButton'
import { assignErrors } from '@/plugins/vee-validate'
import SmallErrorMessageList from '@/components/organisms/notice/SmallErrorMessageList'

export default {
  name: 'EventUserItem',
  components: {
    DeleteButton,
    SmallErrorMessageList,
  },
  props: {
    eventUser: {
      type: Object,
      required: true,
    },
    showController: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      errors: {
        global: [],
      },
      events: new EventEmitter(),
    }
  },
  methods: {
    async handleClickDelete() {
      try {
        this.$store.commit('common/loading', true)

        const { id, eventId } = this.eventUser

        await this.$store.dispatch('eventUser/delete', {
          id,
          eventId,
        })
      } catch (error) {
        console.error(error)
        assignErrors(this.errors, error)
      } finally {
        this.$store.commit('common/loading', false)
      }
    },
    getMemberName(member) {
      if (!member) {
        return ''
      }

      return member.lname + member.fname
    },
    getMemberKana(member) {
      if (!member) {
        return ''
      }

      return member.lkana + member.fkana
    },
  },
}
</script>
