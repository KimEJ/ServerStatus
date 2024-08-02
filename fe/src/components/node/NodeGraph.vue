<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="surface-variant" density="compact" icon="mdi-history"
        variant="flat"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Dialog">
         <chart :timeline="timeline" :datasets="hdd"/>
          <chart :timeline="timeline" :datasets="[cpu]"/>
          <chart :timeline="timeline" :datasets="[load]"/>


        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useAxios } from '@/plugins/axios'
import { computed, onMounted, ref } from 'vue';

import { DateTime } from "luxon";


const { id } = defineProps<{ id: string }>()

const timeline = ref([] as string[])
const hdd = ref([
    {
      label: "HDD Total",
      data: [] as number[],
      borderColor: "rgba(54, 162, 235, 1)",
      fill: false,
    },
    {
      label: "HDD Used",
      data: [] as number[],
      borderColor: "rgba(255, 99, 132, 1)",
      fill: false,
    }
  ],)
const cpu = ref({
  label: "CPU",
  data: [] as number[],
  borderColor: "rgba(75, 192, 192, 1)",
  fill: false,

})
const load = ref({
  label: "Load",
  data: [] as number[],
  borderColor: "rgba(255, 206, 86, 1)",
  fill: false,
})

const axios = useAxios()

onMounted(() => {
  axios.get(`/datas/${id}`).then((res) => {
    res.data.forEach((item: any) => {
      timeline.value.push(DateTime.fromISO(item.created_at, { zone: "Asia/Seoul" }).toFormat("HH:mm:ss"))
      hdd.value[0].data.push(item.hdd_total)
      hdd.value[1].data.push(item.hdd_used)
      cpu.value.data.push(item.cpu)
      load.value.data.push(item.load)
    })
  }).catch((err) => {
    console.error(err)
  })
})
//
</script>