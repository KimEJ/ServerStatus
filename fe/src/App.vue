<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  const router = useRouter()

  function loginCheck() {
    if(router.currentRoute.value.path !== '/login') {
      if(!localStorage.getItem('accessToken')) {
        router.push('/login')
      }
    }
  }

  watch(() => router, () => {
    console.log('Router changed')
    loginCheck()
  });
  onMounted(() => {
    console.log('App mounted')
    loginCheck()
  })
  //
</script>
