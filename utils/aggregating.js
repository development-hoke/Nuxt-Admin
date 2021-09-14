export const computeTotalAmount = (
  items,
  valueProp = 'price',
  countProp = 'amount'
) => {
  return items.reduce((sum, item) => {
    const count = Number(item[countProp] ?? 1)
    const price = Number(item[valueProp] ?? 0)

    return [...new Array(count)].reduce((sum) => price + sum, sum)
  }, 0)
}
