<template>
  <v-layout>
    <v-container>
      <h1 class="headline grey--text text-darken-4">Dashboard</h1>
      <div class="mt-6">
        <v-flex class="justify-center">
          <v-select
            :items="monthOptions"
            v-model="formData.month"
            label="Choose Month"
            color="red accent-2"
            outlined
            :disabled="disabled"
            @change="fetchStatistics()"
            dense
          ></v-select>
        </v-flex>

        <!-- Content -->
        <v-container class="pa-0">
          <v-row>
            <v-col cols="12" md="4" class="">
              <v-card color="">
                <div class="d-flex flex-no-wrap justify-space-between">
                  <div>
                    <v-card-title class="headline">Articles</v-card-title>
                    <v-card-subtitle class="display-1">{{ statistics.articles || 0 }}</v-card-subtitle>
                  </div>

                  <v-avatar
                    class="ma-3 elevation-3"
                    size="50"
                    tile
                    color="blue"
                  >
                    <v-icon dark>mdi-file-multiple-outline</v-icon>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="4" class="">
              <v-card color="">
                <div class="d-flex flex-no-wrap justify-space-between">
                  <div>
                    <v-card-title class="headline">Total Views</v-card-title>
                    <v-card-subtitle class="display-1">{{ statistics.total_views || 0 }}</v-card-subtitle>
                  </div>

                  <v-avatar
                    class="ma-3 elevation-3"
                    size="50"
                    tile
                    color="orange"
                  >
                    <v-icon dark>mdi-eye</v-icon>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="4" class="">
              <v-card color="">
                <div class="d-flex flex-no-wrap justify-space-between">
                  <div>
                    <v-card-title class="headline">Users</v-card-title>
                    <v-card-subtitle class="display-1">{{ statistics.users || 0 }}</v-card-subtitle>
                  </div>

                  <v-avatar
                    class="ma-3 elevation-3"
                    size="50"
                    tile
                    color="red"
                  >
                    <v-icon dark>mdi-account-circle</v-icon>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-container class="pa-0">
          <v-card class="mt-3">
            <client-only>
              <chart-line :data="chartData" :label="chartLabels"></chart-line>
            </client-only>
          </v-card>
        </v-container>
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
import ChartLine from "@/components/ui/ChartLine";
export default {
  layout: 'admin',
  components: { ChartLine },
  data() {
    return {
      statistics: [],
      currentMonthDays: [],
      popularArticles: [],
      newArticles: [],
      chartData: [],
      chartLabels: [],
      formData: {
        month: '',
      },
      monthOptions: [],
      loading: true,
      snackbar: false,
      snackbarMessage: '',
      isError: false,
      disabled: false,
    }
  },
  created() {
    this.fetchStatistics()
  },
  methods: {
    fetchStatistics() {
      this.loading = true
      this.$api.getAdminStatistics(this.formData.month)
        .then(res => {
          this.statistics = res.data
          this.currentMonthDays = res.data.CurrentMonthDays
          this.popularArticles = res.data.popular_articles
          this.newArticles = res.data.new_articles
          this.chartData = res.data.chartData
          this.chartLabels = res.data.chartLabels
          this.monthOptions = res.data.year_month_options
          this.loading = false
        })
    },
    deleteFile(fileId) {
      if (confirm('Are you sure to delete this item?')) {
        this.$api.adminDeleteFile(fileId)
          .then(res => {
              this.fetchFiles()
              this.snackbarMessage = res.data.response_message
              this.isError = false
              this.snackbar = true
          })
          .catch(err => {
            const error = err.response
            this.snackbarMessage = 'Error: ' + error.status + ' ' + error.statusText
            this.isError = true
            this.snackbar = true
          })
      }
    },
    resetFilter() {
      this.formData.Filter.name = null
      this.fetchFiles()
    }
  }
}
</script>
