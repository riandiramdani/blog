<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Settings</h1>
      <div class="mt-6">
        <v-card class="">
          <v-tabs
            v-model="tab"
            background-color="grey"
            dark
          >
            <v-tab v-for="tab in tabs" :key="tab.name">
              {{ tab.name }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <form @submit.prevent="updateSettings()">
              <v-tab-item>
                <v-card flat class="px-4 py-5">
                  <v-text-field
                    type="text"
                    label="Site Name (*)"
                    color="red accent-2"
                    dense
                    outlined
                    required
                    v-model="formData.site_name"
                  ></v-text-field>

                  <v-text-field
                    type="text"
                    label="SEO Site Meta Title (This is your site meta title. The recommended length is 50-60 characters.)"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.site_meta_title"
                  ></v-text-field>

                  <v-text-field
                    type="text"
                    label="SEO Keywords"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.site_keywords"
                  ></v-text-field>

                  <v-textarea
                    v-model="formData.site_description"
                    label="Site Description"
                    color="red accent-2"
                    no-resize
                    outlined
                    dense
                  ></v-textarea>

                  <v-text-field
                    type="text"
                    label="Timezone"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.timezone"
                  ></v-text-field>

                  <v-text-field
                    type="text"
                    label="Datetime Format"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.datetime_format"
                  ></v-text-field>

                  <v-text-field
                    type="text"
                    label="Max Upload File Size"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.fileupload_max"
                  ></v-text-field>

                  <v-divider></v-divider>

                  <div class="text-right">
                    <v-btn
                      color="primary"
                      type="submit"
                      class="px-8 my-6"
                      :loading="loading"
                    >
                      Save
                    </v-btn>
                  </div>
                </v-card>
              </v-tab-item>

              <!-- Emails -->
              <v-tab-item>
                <v-card flat class="px-4 py-5">
                  <v-text-field
                    type="text"
                    label="Admin Email (*)"
                    color="red accent-2"
                    dense
                    outlined
                    required
                    v-model="formData.admin_email"
                  ></v-text-field>

                  <v-divider></v-divider>

                  <div class="text-right">
                    <v-btn
                      color="primary"
                      type="submit"
                      class="px-8 my-6"
                      :loading="loading"
                    >
                      Save
                    </v-btn>
                  </div>
                </v-card>
              </v-tab-item>

              <!-- Social Links -->
              <v-tab-item>
                <v-card flat class="px-4 py-5">
                  <v-text-field
                    type="text"
                    label="Facebook URL"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.facebook_url"
                  ></v-text-field>

                  <v-text-field
                    type="text"
                    label="Twitter URL"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.twitter_url"
                  ></v-text-field>

                  <v-text-field
                    type="text"
                    label="Instagram URL"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.instagram_url"
                  ></v-text-field>

                  <v-text-field
                    type="text"
                    label="Youtube URL"
                    color="red accent-2"
                    dense
                    outlined
                    v-model="formData.youtube_url"
                  ></v-text-field>

                  <v-divider></v-divider>

                  <div class="text-right">
                    <v-btn
                      color="primary"
                      type="submit"
                      class="px-8 my-6"
                      :loading="loading"
                    >
                      Save
                    </v-btn>
                  </div>
                </v-card>
              </v-tab-item>
            </form>
          </v-tabs-items>
        </v-card>
      </div>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      :multi-line="false"
    >
      <span :class="{'red--text': isError}">{{ snackbarMessage }}</span>
      <v-btn
        color="red"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      formData: {
        site_name: '',
        site_meta_title: '',
        site_keywords: '',
        site_description: '',
        timezone: '',
        datetime_format: '',
        ssl_enable: '',
        fileupload_max: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        youtube_url: '',
        admin_email: '',
      },
      options: [],
      page: {},
      settings: {},
      tab: null,
      tabs: [
        { name: 'General' },
        { name: 'Emails' },
        { name: 'Social Media Links' },
      ],
      loading: true,
      snackbar: false,
      snackbarMessage: '',
      isError: false,
    }
  },
  created() {
    this.fetchComments()
  },
  methods: {
    fetchComments() {
      this.loading = true
      this.$api.adminGetOptions()
        .then(res => {
          this.options = res.data.options
          this.settings = res.data.settings
          this.page = res.data.settings

          this.formData.site_name = this.settings.site_name.value
          this.formData.site_meta_title = this.settings.site_meta_title.value
          this.formData.site_keywords = this.settings.site_keywords.value
          this.formData.site_description = this.settings.site_description.value
          this.formData.timezone = this.settings.timezone.value
          this.formData.datetime_format = this.settings.datetime_format.value
          this.formData.ssl_enable = this.settings.ssl_enable.value
          this.formData.fileupload_max = this.settings.fileupload_max.value
          this.formData.facebook_url = this.settings.facebook_url.value
          this.formData.instagram_url = this.settings.instagram_url.value
          this.formData.twitter_url = this.settings.twitter_url.value
          this.formData.youtube_url = this.settings.youtube_url.value
          this.formData.admin_email = this.settings.admin_email.value

          this.loading = false
        })
    },
    updateSettings() {
      let formData = new FormData()
      for (let data in this.formData) {
        let idData = this.settings[data]['id']
        if (this.formData[data] !== null) {
          formData.append(`Options[${idData}][value]`, this.formData[data])
          // console.log(this.formData[data])
        }
      }

      this.$api.saveSettings(formData)
        .then(res => {
          console.log(res)
          this.fetchComments()
        })
    }
  }
}
</script>
