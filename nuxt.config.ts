/* eslint-disable @typescript-eslint/explicit-function-return-type */
require('dotenv').config()

module.exports = {
  mode: 'universal',
  head: {
    titleTemplate: `%s | ${process.env.META_TITLE}`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.META_DESCRIPTION
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: process.env.META_TITLE
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: process.env.HOST_NAME },
      { hid: 'og:image:width', property: 'og:image:width', content: 1200 },
      { hid: 'og:image:height', property: 'og:image:height', content: 630 },
      {
        hid: 'og:title',
        property: 'og:title',
        content: process.env.META_TITLE
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: process.env.META_DESCRIPTION
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: process.env.META_SITE_IMAGE
      },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: process.env.META_TITLE },
      { name: 'twitter:image', content: process.env.META_SITE_IMAGE },
      {
        name: 'twitter:description',
        content: process.env.META_DESCRIPTION
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  loading: { color: '#3B8070' },

  plugins: [
    '~/plugins/firebase',
    '~/plugins/vuelidate',
    '~/plugins/auth',
    '~/plugins/croppa',
    '~/plugins/dayjs',
    '~/plugins/sanitize'
    //'~/plugins/fcm'
  ],

  modules: [
    '@nuxtjs/bulma',
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    ['@nuxtjs/google-analytics', { id: process.env.GOOGLEANALYTICS_ID }],
    '@nuxtjs/sitemap'
  ],

  styleResources: {
    sass: ['~assets/css/bulma-variables.scss', '~assets/css/main.scss']
  },

  css: [
    '@fortawesome/fontawesome-free-webfonts',
    '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css'
  ],

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
  }

  // manifest: {
  //   name: 'Hubb',
  //   lang: 'ja',
  //   // eslint-disable-next-line @typescript-eslint/camelcase
  //   gcm_sender_id: '103953800507'
  // },

  // workbox: {
  //   importScripts: [
  //     //'firebase-messaging-sw.js'
  //   ]
  // }
}
