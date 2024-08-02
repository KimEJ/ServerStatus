<template>
  <v-container class="fill-height">
      <v-data-table :headers="headers" :items="items">
        <template v-slot:item.actions="{ item }">
          <NodeDetail :id="item.host" />
          <NodeGraph :id="item.host" />
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.lastSync > new Date().getTime() - 5000 ? 'success' : 'error'"
            dark
          >
            {{ item.lastSync > new Date().getTime() - 5000 ? 'Online' : 'Offline' }}
          </v-chip>
        </template>
      </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
  import { useAxios } from '@/plugins/axios'
  import { onMounted, ref } from 'vue'

  const axios = useAxios()

  const headers = ref([
    { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
    // { title: 'ID', key: 'id', sortable: false, align: 'center' },
    { title: '이름', key: 'name', sortable: false, align: 'center' },
    { title: 'Type', key: 'type', sortable: false, align: 'center' },
    { title: 'Host', key: 'host', sortable: false, align: 'center' },
    { title: '위치', key: 'location', sortable: false, align: 'center' },
    { title: '상태', key: 'status', sortable: false, align: 'center' },
    
  ])
  const items = ref([])

  onMounted(() => {
    axios.get('/nodes').then((res) => {
      items.value = res.data.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          type: item.type,
          host: item.host,
          location: item.location,
          lastSync: new Date(item.lastSync).getTime(),
        }
      });
    }).catch((err) => {
      console.error(err)
    })
  })
</script>
