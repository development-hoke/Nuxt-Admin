import CKEditorWebpackPlugin from '@ckeditor/ckeditor5-dev-webpack-plugin'
import { styles } from '@ckeditor/ckeditor5-dev-utils'

const applyCkeditorSettings = (config) => {
  // css-loaderの設定がバッティングするのでexcludeを追加する
  config.module.rules.forEach((rule) => {
    if (/^\/\\.css\$\/i/.test(rule.test.toString())) {
      if (!rule.exclude) {
        rule.exclude = []
      } else if (!Array.isArray(rule.exclude)) {
        rule.exclude = [rule.exclude]
      }

      rule.exclude.push(/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/)
    }
  })

  config.module.rules.forEach((rule) => {
    if (/svg/.test(rule.test.toString())) {
      if (!rule.exclude) {
        rule.exclude = []
      } else if (!Array.isArray(rule.exclude)) {
        rule.exclude = [rule.exclude]
      }

      rule.exclude.push(
        /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/
      )
    }
  })

  config.module.rules.push({
    test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
    use: ['raw-loader'],
  })

  config.module.rules.push({
    test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
    use: [
      {
        loader: 'style-loader',
        options: {
          injectType: 'singletonStyleTag',
          attributes: {
            'data-cke': true,
          },
        },
      },
      {
        loader: 'postcss-loader',
        options: styles.getPostCssConfig({
          themeImporter: {
            themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
          },
          minify: true,
        }),
      },
    ],
  })

  // plugins
  config.plugins = config.plugins || []
  config.plugins.push(
    new CKEditorWebpackPlugin({
      language: 'ja',
      addMainLanguageTranslationsToAllAssets: true,
    })
  )
}

export default {
  ssr: false,
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    bodyAttrs: {
      class:
        'vertical-layout page-header-light vertical-menu-collapsible vertical-dark-menu preload-transitions 2-columns document_mode',
    },
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { src: '/assets/js/vendors.min.js', body: true },
      { src: '/assets/js/materialize.min.js', body: true },
      { src: '/assets/js/plugins.min.js', body: true },
      { src: '/assets/js/search.min.js', body: true },
    ],
  },
  /*
   ** Global CSS
   */
  css: [
    'static/admin-assets/vendors/vendors.min.css',
    'static/admin-assets/css/themes/vertical-dark-menu-template/materialize.min.css',
    'static/admin-assets/css/themes/vertical-dark-menu-template/style.min.css',
    'static/admin-assets/css/custom/custom.css',
    'assets/scss/app.scss',
    'vue-multiselect/dist/vue-multiselect.min.css',
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '@/plugins/helpers',
    '@/plugins/vee-validate',
    '@/plugins/notice',
    '@/plugins/api',
    '@/plugins/dayjs',
    '@/plugins/filters',
    '@/plugins/loading',
    '@/plugins/toast',
  ],
  router: {
    middleware: ['guard', 'routingController', 'currentUser', 'notice'],
  },
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: false,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxt/http'],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient }) {
      if (!isDev) {
        // config.output.publicPath = './spa/'
      }
      // リリース前にはコメントアウトする
      //   config.devtool = 'source-map'

      // loaderの追加
      config.module.rules.push({ test: /\.html$/, use: 'html-loader' })

      // CKEditor
      applyCkeditorSettings(config)
    },
  },
  watchers: {
    webpack: {
      poll: true,
    },
  },
  env: {
    apiBaseUrl:
      process.env.API_BASE_URL || 'https://store.ymdy.local/api/v1/admin',
    apiFrontBaseUrl:
      process.env.FRONT_API_BASE_URL || 'https://store.ymdy.local/api/v1',
    staticPageUrl: process.env.STATIC_PAGE_URL,
    planPageUrl: process.env.PLAN_PAGE_URL,
    frontBaseUrl: process.env.FRONT_BASE_URL,
    debugMode: process.env.DEBUG_MODE || false,
  },
  server: {
    port: 3001, // デフォルト: 3001
    host: '0.0.0.0', // デフォルト: localhost
  },
}
