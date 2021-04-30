<template>
  <v-bottom-navigation
    grow
    color="red accent-2"
    :fixed="true"
    class="d-md-none"
  >
    <v-btn to="/">
      <span>Home</span>
      <v-icon>mdi-home-variant-outline</v-icon>
    </v-btn>

    <v-btn to="/bookmark">
      <span>Bookmark</span>
      <v-icon>mdi-bookmark-outline</v-icon>
    </v-btn>

    <v-btn to="/search">
      <span>Search</span>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn to="/member">
      <span>Profile</span>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
