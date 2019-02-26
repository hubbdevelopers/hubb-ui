require('dotenv').config()

module.exports = {
  mode: "spa",
  /*
  ** Headers of the page
  */
  head: {
    title: 'hubb',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],

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
    //'~/plugins/fcm'
  ],

  modules: [
    '@nuxtjs/bulma',
    '@nuxtjs/dotenv',
    ['@nuxtjs/axios', {baseURL: process.env.BASE_URL || 'http://localhost:8080'}],
    ['@nuxtjs/pwa', { icon: false }]
  ],

  css: [
    '@fortawesome/fontawesome-free-webfonts',
    '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css'
  ],

  router: {
   // middleware: 'checkInit'
  },  

  /*
  ** Build configuration
  */
  build: {

    postcss: {
      plugins: {
        'postcss-preset-env': {
        }
      }
    },

  },

  manifest: {
    name: 'My Awesome App',
    lang: 'fa',
    gcm_sender_id: "103953800507"
  },

  workbox: {
    importScripts: [
      //'firebase-messaging-sw.js'
    ],
  },
}

