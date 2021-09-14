import dayjs from 'dayjs'

const createHistoryRecord = ({
  imageUrl = null,
  imageAlt = null,
  storeId = null,
  title,
  makerProductNumber = null,
  departmentName = null,
  categoryName = null,
  itemName = null,
  colorAndSize,
  price,
  amount = null,
  staffName,
  createdAt,
  isItemEvent,
}) => ({
  imageUrl,
  imageAlt,
  storeId,
  title,
  makerProductNumber,
  departmentName,
  categoryName,
  itemName,
  colorAndSize,
  price,
  amount,
  staffName,
  createdAt,
  isItemEvent,
  timestamp: dayjs(createdAt).unix(),
})

const createItemRecord = (history) => {
  const { item } = history.itemDetail
  const [imageUrl, imageAlt] = getThumbnailData(item)

  return createHistoryRecord({
    imageUrl,
    imageAlt,
    title: item.departmentId,
    makerProductNumber: item.makerProductNumber,
    departmentName: item.department.name,
    categoryName: getRootCategoryGroup(item),
    itemName: item.name,
    colorAndSize: getColorAndSize(history.itemDetail),
    price: history.diffJson.price,
    amount: history.diffJson ? history.diffJson.amount : null,
    staffName: history.staff ? history.staff.name : '',
    createdAt: history.createdAt,
    isItemEvent: history.isItemEvent,
  })
}

const createRecalculateBundleSaleRecord = (history) => {
  const record = createItemRecord(history)
  record.itemName += ' (バンドル販売再計算)'
  return record
}

export const formHistories = ({ orderChangeHistories }, eventType) => {
  if (!Array.isArray(orderChangeHistories)) {
    return []
  }

  const couponLabels = {
    [eventType.addCoupon]: '追加',
    [eventType.removeCoupon]: '削除',
  }

  return orderChangeHistories.reduce((histories, history) => {
    switch (history.eventType) {
      case eventType.changePrice:
        return histories.concat(
          createHistoryRecord({
            title: history.memo,
            price: history.diffJson.price,
            createdAt: history.createdAt,
            staffName: history.staff ? history.staff.name : '',
            isItemEvent: history.isItemEvent,
          })
        )

      case eventType.addCoupon:
      case eventType.removeCoupon:
        return histories.concat(
          createHistoryRecord({
            title: `${history.diffJson.name} ${
              couponLabels[history.eventType]
            }`,
            price: history.diffJson.price,
            createdAt: history.createdAt,
            staffName: history.staff ? history.staff.name : '',
            isItemEvent: history.isItemEvent,
          })
        )

      case eventType.removeItem:
      case eventType.addItem:
      case eventType.returnItem:
        return histories.concat(createItemRecord(history))

      case eventType.recalculateBundleSale:
        return histories.concat(createRecalculateBundleSaleRecord(history))

      default:
        return histories
    }
  }, [])
}

export const getRootCategoryGroup = (item) => {
  return Object.keys(
    item.onlineCategories.reduce((rootCateogries, category) => {
      return {
        ...rootCateogries,
        [category.root.name]: category.root,
      }
    }, {})
  ).join(' ')
}

export const getThumbnailData = (item) => {
  const image =
    item.itemImages && item.itemImages[0] ? item.itemImages[0] : null

  const imageUrl = image ? image.urlM : null
  const imageAlt = image ? image.caption ?? item.name : null

  return [imageUrl, imageAlt]
}

export const getColorAndSize = (itemDetail) =>
  `${itemDetail.color.id} ${itemDetail.color.name} ${itemDetail.size.name}`

const changeHistories = (state, getters, rootState, rootGetters) => {
  const orders = rootGetters['order/data']
  const eventType = rootGetters['enum/kv']['orderChangeHistory/eventType']

  return orders.reduce((groups, item) => {
    const histories = !eventType ? [] : formHistories(item, eventType)

    groups[item.id] = histories.sort(
      (item1, item2) => item1.timestamp - item2.timestamp
    )

    return groups
  }, {})
}

export const ORDER_DETAIL_TYPE_ITEM = 1
export const ORDER_DETAIL_TYPE_COUPON = 2
export const ORDER_DETAIL_TYPE_FEE = 3

const orderDetails = (state, getters, rootState, rootGetters) => {
  const orders = rootGetters['order/data']
  const orderDetailGropus = rootGetters['orderDetail/orderGroups']
  const discountTypeLables =
    rootGetters['enum/valueLabel']['orderDiscount/type'] || {}
  const typeKv = rootGetters['enum/kv']['orderDiscount/type'] || {}

  return orders.reduce((groups, order) => {
    const details = (orderDetailGropus[order.id] ?? []).map(
      ({ id, itemDetail, amount, priceBeforeOrder }) => {
        const item = itemDetail.item
        const [imageUrl, imageAlt] = getThumbnailData(item)

        return {
          orderDetailId: id,
          imageUrl,
          imageAlt,
          title: item.departmentId,
          productNumber: item.productNumber,
          makerProductNumber: item.makerProductNumber,
          departmentName: item.department.name,
          rootCategories: getRootCategoryGroup(item),
          itemName: item.name,
          colorAndSize: getColorAndSize(itemDetail),
          price: priceBeforeOrder,
          amount,
          type: ORDER_DETAIL_TYPE_ITEM,
        }
      }
    )

    const coupons = (order.orderUsedCoupons ?? [])
      .map((usedCoupon) => ({
        orderUsedCouponId: usedCoupon.id,
        title: usedCoupon.coupon.name,
        price: -usedCoupon.itemAppliedPrice,
        amount: 1,
        type: ORDER_DETAIL_TYPE_COUPON,
      }))
      .filter(({ price }) => Number(price) !== 0)

    details.push(...coupons)

    details.push({
      title: '手数料',
      price: order.fee,
      amount: 1,
      type: ORDER_DETAIL_TYPE_FEE,
    })

    details.push({
      title: '配送手数料',
      price: order.deliveryFee,
      amount: 1,
      type: ORDER_DETAIL_TYPE_FEE,
    })

    if (order.deliveryFeeDiscountType) {
      if (typeKv.couponDeliveryFee === order.deliveryFeeDiscountType) {
        details.push({
          orderUsedCouponId: order.deliveryFeeDiscount.discountableId,
          title: discountTypeLables[order.deliveryFeeDiscountType],
          price: -order.deliveryFeeDiscountPrice,
          amount: 1,
          type: ORDER_DETAIL_TYPE_COUPON,
        })
      } else {
        details.push({
          title: discountTypeLables[order.deliveryFeeDiscountType],
          price: -order.deliveryFeeDiscountPrice,
          amount: 1,
          type: ORDER_DETAIL_TYPE_FEE,
        })
      }
    }

    groups[order.id] = details

    return groups
  }, {})
}

export const getters = {
  changeHistories,
  orderDetails,
}
