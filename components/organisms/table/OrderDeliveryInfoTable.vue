<template>
  <table class="bordered striped">
    <tbody>
      <tr>
        <td class="bg-blue">伝票番号</td>
        <td>{{ order.deliveryNumber }}</td>
      </tr>
      <tr>
        <td class="bg-blue">お客様氏名</td>
        <td>
          {{ `${order.deliveryAddress.lname} ${order.deliveryAddress.fname}` }}
        </td>
      </tr>
      <tr>
        <td class="bg-blue">お客様氏名（カナ）</td>
        <td>
          {{ `${order.deliveryAddress.lkana} ${order.deliveryAddress.fkana}` }}
        </td>
      </tr>
      <tr>
        <td class="bg-blue">郵便番号</td>
        <td>{{ order.deliveryAddress.zip }}</td>
      </tr>
      <tr>
        <td class="bg-blue">都道府県</td>
        <td>{{ order.deliveryAddress.pref.name }}</td>
      </tr>
      <tr>
        <td class="bg-blue">市区町村</td>
        <td>{{ order.deliveryAddress.city }}</td>
      </tr>
      <tr>
        <td class="bg-blue">町名</td>
        <td>{{ order.deliveryAddress.town }}</td>
      </tr>
      <tr>
        <td class="bg-blue">発送番地</td>
        <td>{{ order.deliveryAddress.address }}</td>
      </tr>
      <tr>
        <td class="bg-blue">建物名</td>
        <td>{{ order.deliveryAddress.building }}</td>
      </tr>
      <tr>
        <td class="bg-blue">連絡先</td>
        <td>{{ order.deliveryAddress.tel }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'OrderDeliveryInfoTable',
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
