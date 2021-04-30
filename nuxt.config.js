var webpack = require('webpack');
import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
  // server: {
  //   port: 3000, // default: 3000
  //   host: '192.168.43.82' // default: localhost
  // },

  // Mode
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + 'Otaku',
    title: 'Otaku',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  pwa: {
    manifest: {
      name: 'Otaku',
      short_name: 'Otaku',
      lang: 'id',
      theme_color: "#0d1137",
      display: "standalone",
    },
    meta: {
      /* meta options */
      nativeUI: true,
      lang: 'id',
    }
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/api.js',
    '~/plugins/social-sharing.js',
    { src: '~plugins/nuxt-quill-plugin.js', ssr: false },
    { src: "@/plugins/chart", ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/vuetify',
    '@nuxtjs/laravel-echo'
  ],

  echo: {
    /* module options */
    broadcaster: 'pusher',
    cluster: 'ap1',
    authModule: true,
    connectOnLogin: true,
    disconnectOnLogout: true,
    authEndpoint: process.env.BROADCASTING_API_AUTH+'/broadcasting/auth',
    key: '0d60a8e6bfe44ccd71e6',
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
  ],
  /*
  ** Axios modules
  */
  axios: {
    // proxyHeaders: false
    baseURL: process.env.BASE_API_URL || 'http://localhost:3000',
    // credentials: true,
    headers: {
      common: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.BASE_URL || 'http://localhost:3000',
      },
    }
  },

  /*
  ** Auth
  */
  auth: {
    plugins: [ '~/plugins/auth.js' ],
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login', method: 'post', propertyName: 'access_token' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/user-data', method: 'get', propertyName: false }
        },
        tokenRequired: true,
        tokenType: 'bearer',
      },
      facebook: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        userinfo_endpoint: 'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email',
        scope: ['public_profile', 'email'],
        redirect_uri: process.env.BASE_URL+'/callback'
      },
      google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        scope: ['profile', 'email'],
        redirect_uri: process.env.BASE_URL+'/callback'
      },
    },
    redirect: {
      login: '/login',
      logout: '/',
      home: '/member/dashboard'
      // user: '/profile',
      // callback:'/'
    },
    resetOnError: true,
  },

  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          anchor: colors.red.accent3,
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          anchor: colors.red.accent3,
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['js-cookie'],
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      })
    ],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
}
