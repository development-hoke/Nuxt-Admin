<template>
  <table class="bordered striped">
    <tbody>
      <tr>
        <td class="bg-blue">お客様情報</td>
        <td>{{ name }}</td>
      </tr>
      <tr>
        <td class="bg-blue">発送先郵便番号</td>
        <td>{{ member && member.zip }}</td>
      </tr>
      <tr>
        <td class="bg-blue">発送先銃所</td>
        <td>{{ address }}</td>
      </tr>
      <tr>
        <td class="bg-blue">連絡先</td>
        <td>{{ member && member.tel }}</td>
      </tr>
      <tr>
        <td class="bg-blue">メールアドレス</td>
        <td>{{ member && member.email }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'OrderCustomerInfo',
  props: {
    member: {
      type: Object,
      required: true,
    },
    prefDict: {
      type: Object,
      required: true,
    },
  },
  computed: {
    name() {
      if (!this.member) {
        return ''
      }

      const member = this.member

      return `${member.lname} ${member.fname}`
    },
    address() {
      if (!this.member) {
        return ''
      }

      const { prefId, city, town, address, building } = this.member

      return `${this.prefDict[prefId].name}${city}${town ?? ''}${
        address ?? ''
      }${building ?? ''}`
    },
  },
}
</script>
