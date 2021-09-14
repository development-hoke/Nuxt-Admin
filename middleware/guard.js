import * as logger from '@/utils/log'

export default function ({ store, redirect, route }) {
  if (route.name === 'login') {
    return
  }

  if (!store.getters['currentUser/accessToken']) {
    logger.info('accessToken not found')
    redirect({ name: 'login' })
  }
}
