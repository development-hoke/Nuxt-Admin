import * as environment from '@/constants/environment'

export const emit = (level, ...message) => {
  if (process.env.NODE_ENV !== environment.ENV_PRD) {
    console[level](...message)
  }
}
export const log = (...message) => emit('log', ...message)
export const info = (...message) => emit('info', ...message)
export const warn = (...message) => emit('warn', ...message)
export const error = (...message) => emit('error', ...message)
export const debug = (...message) => emit('debug', ...message)
