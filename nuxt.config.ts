require('dotenv').config()

module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Hubb',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Hubb はウェブベースの記事投稿サービスです。記事の投稿や閲覧を行うことができます。記事には文字の他に写真や動画を使用することができます。'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#3B8070' },

  plugins: [
    '~/plugins/firebase',
    '~/plugins/vuelidate',
    '~/plugins/auth',
    '~/plugins/croppa',
    '~/plugins/moment',
    '~/plugins/sanitize'
    //'~/plugins/fcm'
  ],

  modules: [
    '@nuxtjs/bulma',
    '@nuxtjs/dotenv',
    [
      '@nuxtjs/axios',
      { baseURL: process.env.BASE_URL || 'http://localhost:8080' }
    ],
    ['@nuxtjs/pwa', { icon: false }],
    '@nuxtjs/style-resources'
  ],

  styleResources: {
    sass: ['~assets/css/main.scss']
  },

  css: [
    '@fortawesome/fontawesome-free-webfonts',
    '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css',
    '~assets/css/default.css'
  ],

  router: {},

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },

    postcss: {
      plugins: {
        'postcss-preset-env': {}
      }
    }
  },

  manifest: {
    name: 'My Awesome App',
    lang: 'fa',
    // eslint-disable-next-line @typescript-eslint/camelcase
    gcm_sender_id: '103953800507'
  },

  workbox: {
    importScripts: [
      //'firebase-messaging-sw.js'
    ]
  }
}
