/**
 * 10のN乗倍に数値を変換する
 *
 * @param {Number} value
 * @param {Number} num
 * @return {Number}
 */
export const multiply10NthPower = (value, num) => {
  if (!value) {
    return value
  }

  if (num === 0) {
    return value
  }

  return num > 0
    ? multiply10PositiveNthPower(value, num)
    : multiply10NegativeNthPower(value, num * -1)
}

/**
 * 10のN乗倍（プラスのみ）に数値を変換する
 *
 * @param {Number} value
 * @param {Number} num
 * @return {Number}
 */
export const multiply10PositiveNthPower = (value, num = 2) => {
  if (!value) {
    return value
  }

  const decimalPoint = String(value).indexOf('.')

  const sequence = (decimalPoint > -1
    ? String(value)
        .match(/(\d+)\.(\d+)/)
        .slice(1)
    : [String(value)]
  )
    .join('')
    .split('')

  if (decimalPoint !== -1 && sequence.length >= decimalPoint + num) {
    sequence.splice(decimalPoint + num, 0, '.')
  } else {
    const padNumber =
      decimalPoint === -1
        ? num
        : Math.max(decimalPoint + num - sequence.length, 0)
    sequence.push(...[...new Array(padNumber)].map(() => 0))
  }

  return Number(sequence.join(''))
}

/**
 * 1/10のN乗倍に数値を変換する
 *
 * @param {Number} value
 * @param {Number} num
 * @return {Number}
 */
export const multiply10NegativeNthPower = (value, num = 2) => {
  if (!value) {
    return value
  }

  const decimalPoint = String(value).indexOf('.')

  const sequence = (decimalPoint > -1
    ? String(value)
        .match(/(\d+)\.(\d+)/)
        .slice(1)
    : [String(value)]
  )
    .join('')
    .split('')

  const index = decimalPoint > -1 ? decimalPoint : sequence.length
  const newDecimalPoint = Math.max(index - num, 0)
  const padNumber = Math.min(index - num, 0) * -1

  sequence.splice(
    newDecimalPoint,
    0,
    ['.'].concat([...new Array(padNumber)].map(() => 0)).join('')
  )

  return Number(sequence.join(''))
}

export const sumProp = (items, prop) =>
  items.reduce((sum, item) => item[prop] + sum, 0)
