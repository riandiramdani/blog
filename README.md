# blog-project

> Blog Frontend Project

## Setup .env
``` bash
cp .env.example .env
```

Buka file .env dan isi variable tersebut
``` bash
# isi dengan base url website ini di upload
BASE_URL=

# isi dengan base API url core service di upload, jangan lupa menyertakan prefix '/api' setelah nama host
BASE_API_URL=

# Ini isi saja dengan nama host api backend anda tanpa perlu menyertakan prefix api
BROADCASTING_API_AUTH= http://blog-core-service.test

# Contoh
BASE_URL="http://0.0.0.0:3000"
BASE_API_URL="http://blog-core-service.test/api"
BROADCASTING_API_AUTH="http://blog-core-service.test"

# Socials Connect
FACEBOOK_CLIENT_ID=
GOOGLE_CLIENT_ID=
```

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
