<template>
  <v-app>
    <AppNavBar />

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
</script>
