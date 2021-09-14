import Vue from 'vue'
import { ValidationProvider, localize, extend } from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja.json'
import dayjs from 'dayjs'

/* eslint-disable camelcase */
import {
  required,
  max,
  min,
  email,
  alpha_num,
  alpha_dash,
  required_if,
  integer,
  oneOf,
  max_value,
  min_value,
  excluded,
  is_not,
} from 'vee-validate/dist/rules'

import * as httpStatusCode from '@/constants/httpStatusCode'
import ValidationObserver from '@/components/molecules/form/validation/ValidationObserver'

export const GLOBAL_ERROR_MESSAGE = '送信に失敗しました。'

const processInvalidInputError = (error) => {
  const { errors } = error.response.data

  const cleanedErrors = Object.keys(errors).reduce((cleaned, key) => {
    cleaned[key] = Array.isArray(errors[key]) ? errors[key] : [errors[key]]
    return cleaned
  }, {})

  return {
    ...cleanedErrors,
    global: cleanedErrors.global || [GLOBAL_ERROR_MESSAGE],
  }
}

/**
 * エラーから、バリデーションメッセージを抽出する
 *
 * @param {Error} error
 * @return {Object}
 */
export const extractValidationError = (error) => {
  const global = [GLOBAL_ERROR_MESSAGE]

  if (!error.response) {
    return { global }
  }

  const response = error.response

  switch (response.status) {
    case httpStatusCode.UNPROCESSABLE_ENTITY:
      return processInvalidInputError(error)

    default:
      return {
        global: [response.data.message] || [GLOBAL_ERROR_MESSAGE],
      }
  }
}

/**
 * エラーを割り当てる
 *
 * @param {Object} errorObj
 * @param {Error} error
 * @return {void}
 */
export const assignErrors = (errorObj, error) => {
  const extractedErrors = extractValidationError(error)

  Object.keys(extractedErrors).forEach((field) => {
    Vue.set(errorObj, field, extractedErrors[field])
  })
}

// VeeValidateがデフォルトで用意している各ルールを使用するよう指定
extend('integer', integer)
extend('required_if', {
  ...required_if,
  message: (fieldName, placeholders) => {
    const { target, values } = placeholders

    if (values === 'null') {
      return `${fieldName}か${target}どちらかの入力が必要です。`
    }

    if (!Array.isArray(values)) {
      return `${fieldName}は${target}が${values}の場合必須の項目です。`
    }

    return `${fieldName}は${target}が${values.join(
      '、'
    )}のどれかの値の場合必須の項目です。`
  },
})
extend('oneOf', oneOf)
extend('is_not', is_not)
extend('required', required)
extend('email', email)
extend('max', max)
extend('min', min)
extend('excluded', excluded)
extend('max_value', max_value)
extend('min_value', min_value)
extend('alpha_num', alpha_num)
extend('alpha_dash', alpha_dash)
extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target
  },
  message: 'パスワードが一致しません',
})
extend('between', {
  params: ['min', 'max'],
  validate(value, { min, max }) {
    return value.length >= min && value.length <= max
  },
  message: 'このフィールドは {min}文字 から {max}文字で入力してください',
})
extend('kana', {
  validate(value) {
    // eslint-disable-next-line no-irregular-whitespace
    return /^[ァ-ヶー　]+$/.test(value)
  },
  message: '{_field_}はカタカナで入力してください。',
})
extend('date_required', {
  validate(value) {
    return dayjs(value).isValid()
  },
  message: '{_field_}の入力が最後まで終わっていません。',
})
extend('date_gt', {
  params: [
    {
      name: 'target',
      isTarget: true,
    },
  ],
  validate(value, { target }) {
    value = dayjs(value)
    target = dayjs(target)

    if (!value.isValid() || !target.isValid()) {
      return true
    }

    return value.unix() > target.unix()
  },
  message: '{target}よりも後の日時を指定してください。',
})
extend('date_lt', {
  params: [
    {
      name: 'target',
      isTarget: true,
    },
  ],
  validate(value, { target }) {
    value = dayjs(value)
    target = dayjs(target)

    if (!value.isValid() || !target.isValid()) {
      return true
    }

    return value.unix() < target.unix()
  },
  message: '{target}よりも前の日時を指定してください。',
})

extend('date_bt', {
  params: [
    {
      name: 'target',
      isTarget: true,
    },
    'days',
  ],
  validate(value, { target, days }) {
    value = dayjs(value)
    target = dayjs(target)

    return value.diff(target, 'day') <= days
  },
  message: '予約受け付け期間が{days}日以上に設定できません。',
})

extend('color', {
  validate(value) {
    return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value)
  },
  message: '{_field_}のカラーコードを正確に入力してください。',
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
localize('ja', ja)
