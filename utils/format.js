import { isEmptyNumber } from '@/utils/number'
import { multiply10NthPower } from '@/utils/math'

export const formEmptyNumber = (value) => (isEmptyNumber(value) ? null : value)

export const formatNumber = (value) =>
  isEmptyNumber(value) ? '0' : new Intl.NumberFormat().format(value)

export const yen = (value) => `${formatNumber(value)}円`

export const percentile = (value) =>
  String(isEmptyNumber(value) ? 0 : multiply10NthPower(value, 2)) + '%'
