<template>
  <v-container class="fill-height">
    <v-data-iterator :items="[1, 2, 3, 4, 5]">
      <template v-slot:default="{ items }">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :title="`Item ${i}`"
        ></v-list-item>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
  //
</script>
