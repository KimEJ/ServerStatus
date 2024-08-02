<template>
<v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
    <v-btn
      v-bind="activatorProps"
      color="surface-variant"
      density="compact" icon="mdi-information"
      variant="flat"
    ></v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card :title="data.name">
        <v-row>
            <v-col>
                <v-text-field label="host" v-model="data.host" />
            </v-col>
            <v-col>
                <v-text-field label="type" v-model="data.type" />
            </v-col>
            <v-col>
                <v-text-field label="location" v-model="data.location" />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-text-field label="최종 접속" v-model="data.lastSync" />
            </v-col>
            <v-col>
                <v-text-field label="접속 실패 대기(초)" v-model="data.timeLimit" />
            </v-col>
            <v-col>
                <v-text-field label="최종 접속 실패 알림" v-model="data.timeLastAlert" />
            </v-col>
            
        </v-row>
        <v-row>
            <v-col>
                <v-text-field label="최종 CPU 알림" v-model="data.CPULastAlert" />
            </v-col>
            <v-col>
                <v-text-field label="CPU 과부하 기준" v-model="data.maxCPU" />
            </v-col>
            <v-col>
                <v-text-field label="CPU 저하 기준" v-model="data.minCPU" />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-text-field label="최종 Memory 알림" v-model="data.memoryLastAlert" />
            </v-col>
            <v-col>
                <v-text-field label="Memory 과부하 기준" v-model="data.maxMemory" />
            </v-col>
            <v-col>
                <v-text-field label="Memory 저하 기준" v-model="data.minMemory" />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-text-field label="최종 Network 알림" v-model="data.networkLastAlert" />
            </v-col>
            <v-col>
                <v-text-field label="Network 과부하 기준" v-model="data.maxNetwork" />
            </v-col>
            <v-col>
                <v-text-field label="Network 저하 기준" v-model="data.minNetwork" />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-text-field label="최종 Load 알림" v-model="data.loadLastAlert" />
            </v-col>
            <v-col>
                <v-text-field label="Load 과부하 기준" v-model="data.maxLoad" />
            </v-col>
            <v-col>
                <v-text-field label="Load 저하 기준" v-model="data.minLoad" />
            </v-col>
        </v-row>
        <v-row>
        </v-row>
        <v-row>
        </v-row>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Close Dialog"
          @click="isActive.value = false"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
</template>

<script lang="ts" setup>
  import { useAxios } from '@/plugins/axios'
import { onMounted, ref } from 'vue';

    const axios = useAxios()

    const { id } = defineProps<{ id: string }>()
    const data = ref({
        id: 0,
        name: '',
        type: '',
        host: '',
        location: '',
        password: '',
        lastSync: '',
        timeLastAlert: '',
        CPULastAlert: '',
        memoryLastAlert: '',
        networkLastAlert: '',
        loadLastAlert: '',
        timeLimit: 0,
        timeLimitAlert: 0,
        maxCPU: '',
        maxMemory: '',
        maxNetwork: '',
        maxLoad: '',
        minCPU: '',
        minMemory: '',
        minNetwork: '',
        minLoad: ''
    })

    onMounted(() => {
        axios.get(`/nodes/${id}`).then((res) => {
            data.value = res.data
        }).catch((err) => {
            console.error(err)
        })
    })

  //
</script>